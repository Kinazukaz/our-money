import React, { useState, useEffect } from 'react';
import { Payer, TransactionType, Transaction } from '../types';
import { X, Calendar, DollarSign, Tag } from 'lucide-react';

interface ManualAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: Omit<Transaction, 'id' | 'createdAt' | 'isSettled'>) => void;
  initialData?: Partial<Transaction> | null;
}

export const ManualAddModal: React.FC<ManualAddModalProps> = ({ isOpen, onClose, onAdd, initialData }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState<Payer>(Payer.ME);

  // Load initial data when available
  useEffect(() => {
    if (isOpen && initialData) {
        if (initialData.item) setItem(initialData.item);
        if (initialData.amount) setAmount(initialData.amount.toString());
        if (initialData.date) setDate(initialData.date);
        if (initialData.payer) setPayer(initialData.payer);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !amount) return;

    onAdd({
      date,
      item,
      amount: parseFloat(amount),
      payer,
      type: TransactionType.DEBT
    });
    
    // Reset form
    setItem('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setPayer(Payer.ME);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl transform transition-all animate-slide-up">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">新增記錄</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Payer Selector */}
            <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-500 w-16">誰付錢</label>
                <div className="flex gap-2 flex-1">
                    <button
                        type="button"
                        onClick={() => setPayer(Payer.ME)}
                        className={`flex-1 py-2 px-3 rounded-xl border-2 text-sm font-bold transition-all ${payer === Payer.ME ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-gray-400'}`}
                    >
                        筠付 (我)
                    </button>
                    <button
                        type="button"
                        onClick={() => setPayer(Payer.FRIEND)}
                        className={`flex-1 py-2 px-3 rounded-xl border-2 text-sm font-bold transition-all ${payer === Payer.FRIEND ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 text-gray-400'}`}
                    >
                        古付
                    </button>
                </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Tag className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        placeholder="項目 (例如：餐費、家用費)"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                        required
                    />
                </div>

                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <DollarSign className="w-4 h-4" />
                    </div>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="金額"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-lg font-medium"
                        required
                        inputMode="decimal"
                    />
                </div>

                <div className="relative">
                     <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] mt-4"
            >
                新增記錄
            </button>
        </form>
      </div>
    </div>
  );
};