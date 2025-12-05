import React from 'react';
import { BalanceState } from '../types';
import { Wallet, CheckCircle } from 'lucide-react';

interface BalanceCardProps {
  balance: BalanceState;
  onSettleAll: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, onSettleAll }) => {
  const isPositive = balance.netAmount >= 0;
  const isSettled = balance.netAmount === 0;

  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-lg transition-all duration-300 ${
      isSettled 
        ? 'bg-gradient-to-br from-gray-500 to-slate-600' 
        : isPositive 
          ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
          : 'bg-gradient-to-br from-rose-500 to-pink-600'
    }`}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2 opacity-90">
          <span className="text-sm font-medium tracking-wide">
            {isSettled ? '目前狀態' : (isPositive ? '古欠筠' : '筠欠古')}
          </span>
          <Wallet className="w-5 h-5 opacity-80" />
        </div>
        
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-4xl font-bold tracking-tight">
            ${Math.abs(balance.netAmount).toLocaleString()}
          </span>
          <span className="text-sm opacity-80 font-medium">TWD</span>
        </div>

        <div className="flex items-center justify-end">
             {!isSettled && (
                 <button 
                    onClick={onSettleAll}
                    className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
                >
                    <CheckCircle className="w-4 h-4" />
                    結算全部
                </button>
             )}
             {isSettled && (
                 <div className="flex items-center gap-1 text-white/80 text-sm font-medium px-2 py-2">
                     <CheckCircle className="w-4 h-4" />
                     已全部結清
                 </div>
             )}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -left-6 -top-6 w-24 h-24 bg-black/10 rounded-full blur-xl pointer-events-none"></div>
    </div>
  );
};