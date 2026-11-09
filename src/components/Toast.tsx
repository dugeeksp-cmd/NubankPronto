import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const getStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-rose-600 text-white';
      case 'info':
        return 'bg-neutral-800 text-white';
      default:
        return 'bg-[#820ad1] text-white';
    }
  };

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 max-w-xs w-full px-4 animate-in slide-in-from-top-4 duration-200">
      <div
        className={`${getStyles()} px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between text-xs font-bold gap-2`}
      >
        <div className="flex items-center gap-2">
          {type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-200 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
          )}
          <span>{message}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-full transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
