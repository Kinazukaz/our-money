import React from 'react';
import { Plus, Trash2, Mic } from 'lucide-react';

interface SmartEntryProps {
  onOpenManual: () => void;
  onClearSettled: () => void;
  hasSettledItems: boolean;
  onVoiceInput: (text: string) => void;
}

export const SmartEntry: React.FC<SmartEntryProps> = ({ 
  onOpenManual, 
  onClearSettled, 
  hasSettledItems,
  onVoiceInput 
}) => {

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('您的瀏覽器不支援語音輸入功能');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'zh-TW';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onVoiceInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'no-speech') {
        alert('未偵測到聲音，請再試一次。');
      } else if (event.error === 'not-allowed') {
        alert('請允許使用麥克風權限以使用語音輸入。');
      } else {
        alert('語音辨識發生錯誤，請稍後再試。');
      }
    };
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        
        {/* Clear Settled Button */}
        <button
          onClick={onClearSettled}
          disabled={!hasSettledItems}
          className={`flex items-center justify-center p-3 rounded-2xl transition-all w-12 h-12 flex-shrink-0 ${
            hasSettledItems 
              ? 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500' 
              : 'bg-gray-50 text-gray-300 cursor-not-allowed'
          }`}
          aria-label="清除已結算"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        {/* Voice Input Button */}
        <button
          onClick={handleMicClick}
          className="flex-1 h-12 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
        >
          <Mic className="w-5 h-5" />
          <span>語音輸入</span>
        </button>

        {/* Add Record Button */}
        <button
          onClick={onOpenManual}
          className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span>手動記帳</span>
        </button>
        
      </div>
    </div>
  );
};