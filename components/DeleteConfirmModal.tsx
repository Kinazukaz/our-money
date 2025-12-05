import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "確定要刪除？",
  description = "這筆記錄刪除後將無法復原。"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl transform transition-all animate-scale-in">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            {description}
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
              className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-colors"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};