import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-fade-in">
      <div className="bg-white/90 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-scale-in">
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
        <span className="font-bold text-gray-700">正在聆聽與分析...</span>
      </div>
    </div>
  );
};