import React, { useState, useEffect } from 'react';
import { Transaction, Payer } from '../types';
import { X, Trash2, CheckSquare, Square } from 'lucide-react';

interface ClearSettledSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[]; // Only settled transactions should be passed here
  onConfirmDelete: (ids: string[]) => void;
}

export const ClearSettledSelectionModal: React.FC<ClearSettledSelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  transactions, 
  onConfirmDelete 
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Initialize with all selected by default for convenience, or empty? 
  // User asked to "freely check", so maybe empty or all is fine. Let's start empty to be safe.
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === transactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(transactions.map(t => t.id)));
    }
  };

  const handleDelete = () => {
    onConfirmDelete(Array.from(selectedIds));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl transform transition-all animate-slide-up h-[80vh] flex flex-col">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">清除已結算項目</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
            <button 
                onClick={toggleAll}
                className="text-sm font-bold text-emerald-600 flex items-center gap-1"
            >
                {selectedIds.size === transactions.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                全選
            </button>
            <span className="text-sm text-gray-500">已選 {selectedIds.size} 筆</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pr-1">
            {transactions.length === 0 ? (
                <p className="text-center text-gray-400 mt-10">沒有已結算的項目</p>
            ) : (
                transactions.map(t => (
                    <div 
                        key={t.id}
                        onClick={() => toggleSelection(t.id)}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-colors cursor-pointer ${
                            selectedIds.has(t.id) 
                                ? 'bg-red-50 border-red-200' 
                                : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                        }`}
                    >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                            selectedIds.has(t.id) ? 'bg-red-500 border-red-500 text-white' : 'border-gray-300 bg-white'
                        }`}>
                            {selectedIds.has(t.id) && <CheckSquare className="w-3.5 h-3.5" />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                                <span className="font-bold text-gray-700 truncate">{t.item}</span>
                                <span className="font-medium text-gray-500 decoration-slate-400 line-through">${t.amount}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>{t.date}</span>
                                <span>{t.payer === Payer.ME ? '筠' : '古'}</span>
                            </div>
                             {t.settledAt && (
                                <div className="text-[10px] text-gray-400 mt-0.5">
                                    結清: {t.settledAt}
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>

        <button
            onClick={handleDelete}
            disabled={selectedIds.size === 0}
            className={`w-full font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 ${
                selectedIds.size > 0 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
            <Trash2 className="w-5 h-5" />
            清除選取項目 ({selectedIds.size})
        </button>
      </div>
    </div>
  );
};