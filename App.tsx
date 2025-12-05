import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, BalanceState, Payer, TransactionType } from './types';
import { saveTransactions, loadTransactions } from './services/storageService';
import { BalanceCard } from './components/BalanceCard';
import { TransactionList } from './components/TransactionList';
import { SmartEntry } from './components/SmartEntry';
import { ManualAddModal } from './components/ManualAddModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SettleConfirmModal } from './components/SettleConfirmModal';
import { ClearSettledSelectionModal } from './components/ClearSettledSelectionModal';
import { Info } from 'lucide-react';
import { LoadingOverlay } from './components/LoadingOverlay';
import { parseTransactionWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [isClearSettledModalOpen, setIsClearSettledModalOpen] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [voiceInitData, setVoiceInitData] = useState<Partial<Transaction> | null>(null);

  // Load data on mount
  useEffect(() => {
    const loaded = loadTransactions();
    // Migration for old data
    const migrated = loaded.map(t => ({
        ...t, 
        isSettled: t.isSettled ?? false,
        settledAt: t.settledAt // keep existing if any
    }));
    setTransactions(migrated);
  }, []);

  // Save data on change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Calculate Balance - ONLY count unsettled transactions
  const balance = useMemo<BalanceState>(() => {
    let net = 0;
    
    transactions.filter(t => !t.isSettled).forEach(t => {
      // Standard Debt logic
      if (t.type === TransactionType.DEBT) {
        if (t.payer === Payer.ME) {
            // I paid, friend owes me (+)
            net += t.amount;
        } else {
            // Friend paid, I owe friend (-)
            net -= t.amount;
        }
      } 
      // Repayment logic (kept for backward compatibility)
      else if (t.type === TransactionType.REPAYMENT) {
        if (t.payer === Payer.ME) {
            net += t.amount;
        } else {
            net -= t.amount;
        }
      }
    });

    return {
      netAmount: net,
      status: net === 0 ? 'SETTLED' : net > 0 ? 'OWED' : 'OWING'
    };
  }, [transactions]);

  const hasSettledItems = useMemo(() => transactions.some(t => t.isSettled), [transactions]);
  
  // Filter only settled transactions for the selection modal
  const settledTransactions = useMemo(() => transactions.filter(t => t.isSettled), [transactions]);

  const handleAddTransaction = (data: Omit<Transaction, 'id' | 'createdAt' | 'isSettled'>) => {
    const newTransaction: Transaction = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      isSettled: false
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setVoiceInitData(null); // Clear voice data after adding
  };

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
        setTransactions(prev => prev.filter(t => t.id !== transactionToDelete));
        setTransactionToDelete(null);
    }
  };

  const handleSettleAllClick = () => {
    // Only open modal if there are unsettled transactions
    const hasUnsettled = transactions.some(t => !t.isSettled);
    if (hasUnsettled) {
        setIsSettleModalOpen(true);
    }
  };

  const confirmSettle = () => {
    const now = new Date();
    // Format: YYYY-MM-DD HH:mm
    const timeString = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

    setTransactions(prev => prev.map(t => {
        if (!t.isSettled) {
            return {
                ...t,
                isSettled: true,
                settledAt: timeString
            };
        }
        return t;
    }));
    setIsSettleModalOpen(false);
  };

  const handleClearSettledClick = () => {
    if (hasSettledItems) {
        setIsClearSettledModalOpen(true);
    }
  };

  const confirmClearSelectedSettled = (idsToDelete: string[]) => {
    const idsSet = new Set(idsToDelete);
    setTransactions(prev => prev.filter(t => !idsSet.has(t.id)));
  };

  const handleVoiceInput = async (transcript: string) => {
    setIsProcessingVoice(true);
    try {
        const result = await parseTransactionWithGemini(transcript);
        if (result) {
            setVoiceInitData({
                item: result.item,
                amount: result.amount,
                date: result.date,
                payer: result.payer,
                type: result.type
            });
            setIsManualModalOpen(true);
        } else {
            alert('無法辨識語音內容，請重試或手動輸入。');
        }
    } catch (error) {
        console.error("Voice processing failed", error);
        alert('發生錯誤，請稍後再試。');
    } finally {
        setIsProcessingVoice(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 pb-32">
        <LoadingOverlay isLoading={isProcessingVoice} />
        
        <header className="pt-8 px-6 pb-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                    家庭記帳 (筠 & 古)
                </h1>
                <button 
                    onClick={() => alert('家庭記帳使用說明：\n\n1. 點擊「新增記錄」或使用麥克風添加款項。\n2. 點擊「結算全部」可將目前所有款項標記為已結清（變灰），並記錄時間。\n3. 點擊「清除已結算」可勾選刪除歷史紀錄。')}
                    className="p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-emerald-500 transition-colors"
                >
                    <Info className="w-5 h-5" />
                </button>
            </div>
            
            <BalanceCard 
                balance={balance} 
                onSettleAll={handleSettleAllClick}
            />
        </header>

        <main className="px-4">
            <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-lg font-bold text-gray-700">近期記錄</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                    {transactions.length} 筆
                </span>
            </div>
            
            <TransactionList 
                transactions={transactions} 
                onDelete={handleDeleteClick} 
            />
        </main>

        <SmartEntry 
            onOpenManual={() => setIsManualModalOpen(true)}
            onClearSettled={handleClearSettledClick}
            hasSettledItems={hasSettledItems}
            onVoiceInput={handleVoiceInput}
        />

        <ManualAddModal 
            isOpen={isManualModalOpen} 
            onClose={() => {
                setIsManualModalOpen(false);
                setVoiceInitData(null);
            }} 
            onAdd={handleAddTransaction}
            initialData={voiceInitData}
        />

        {/* Modal for single transaction delete */}
        <DeleteConfirmModal
            isOpen={!!transactionToDelete}
            onClose={() => setTransactionToDelete(null)}
            onConfirm={confirmDelete}
            title="確定要刪除？"
            description="這筆記錄刪除後將無法復原。"
        />

        {/* Modal for selecting settled items to clear */}
        <ClearSettledSelectionModal
            isOpen={isClearSettledModalOpen}
            onClose={() => setIsClearSettledModalOpen(false)}
            onConfirmDelete={confirmClearSelectedSettled}
            transactions={settledTransactions}
        />

        <SettleConfirmModal
            isOpen={isSettleModalOpen}
            onClose={() => setIsSettleModalOpen(false)}
            onConfirm={confirmSettle}
        />
        
    </div>
  );
};

export default App;