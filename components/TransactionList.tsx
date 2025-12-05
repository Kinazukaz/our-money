import React from 'react';
import { Transaction, Payer, TransactionType } from '../types';
import { Trash2, ArrowUpRight, ArrowDownLeft, Calendar, Check } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-400">
        <Calendar className="w-12 h-12 mb-2 opacity-20" />
        <p>目前沒有記錄</p>
      </div>
    );
  }

  // Sort by date desc
  const sorted = [...transactions].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-3 pb-24">
      {sorted.map((t) => {
        const isDebt = t.type === TransactionType.DEBT;
        const isMe = t.payer === Payer.ME;
        const isSettled = t.isSettled;
        
        // Default styling for active items
        let amountClass = '';
        let Icon = ArrowUpRight;
        let prefix = '';
        let cardBg = 'bg-white';
        let textClass = 'text-gray-800';
        let subTextClass = 'text-gray-500';
        let iconBg = isMe ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600';
        
        if (isSettled) {
            // Styling for settled items (Grayed out)
            cardBg = 'bg-gray-100 border-gray-200';
            textClass = 'text-gray-500';
            subTextClass = 'text-gray-400';
            amountClass = 'text-gray-400 line-through decoration-2';
            iconBg = 'bg-gray-200 text-gray-400';
            Icon = Check;
            prefix = '';
        } else {
            // Active items logic
            if (t.type === TransactionType.DEBT) {
                if (t.payer === Payer.ME) {
                    // I paid for something, friend owes me
                    amountClass = 'text-emerald-600';
                    Icon = ArrowUpRight; 
                    prefix = '+';
                } else {
                    // Friend paid, I owe friend
                    amountClass = 'text-rose-600';
                    Icon = ArrowDownLeft; 
                    prefix = '-';
                }
            } else {
                // Repayment
                amountClass = 'text-blue-500'; 
                Icon = isMe ? ArrowUpRight : ArrowDownLeft;
                prefix = '還款 ';
            }
        }

        return (
          <div key={t.id} className={`${cardBg} rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center group transition-colors`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${iconBg} flex-shrink-0 w-9 h-9 flex items-center justify-center`}>
                <span className="text-xs font-bold">{isMe ? '筠' : '古'}</span>
              </div>
              <div className="min-w-0">
                <h3 className={`font-semibold truncate ${textClass}`}>{t.item}</h3>
                <p className={`text-xs ${subTextClass}`}>{t.date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pl-2">
              <div className={`text-right flex-shrink-0 ${amountClass}`}>
                <div className="flex items-center justify-end gap-1 font-bold text-lg">
                    {!isSettled && t.type === TransactionType.DEBT && <Icon className="w-4 h-4" />}
                    {prefix}${t.amount}
                </div>
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-60">
                  {isSettled ? (t.settledAt ? `結清於 ${t.settledAt.split(' ')[1]}` : '已結算') : (t.type === TransactionType.REPAYMENT ? '還款' : (isMe ? '先墊' : '代墊'))}
                </p>
                {isSettled && t.settledAt && (
                   <p className="text-[9px] text-gray-400">{t.settledAt.split(' ')[0]}</p>
                )}
              </div>
              
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(t.id);
                }}
                className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 -mr-2 rounded-full transition-all"
                aria-label="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};