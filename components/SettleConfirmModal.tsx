import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SettleConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SettleConfirmModal: React.FC<SettleConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl transform transition-all animate-scale-in">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">確認結算？</h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            這將會把目前所有未結清的項目標記為「已結算」，且無法自動復原狀態。
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-colors"
            >
              確認結算
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
