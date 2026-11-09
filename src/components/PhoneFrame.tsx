import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Maximize2, Minimize2 } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('09:41');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 transition-all duration-300">
      {/* Top Bar on Desktop */}
      <div className="w-full max-w-md flex items-center justify-between px-3 py-1.5 text-neutral-400 text-xs mb-1 select-none">
        <div className="flex items-center gap-1.5 font-medium text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-neutral-300 font-bold">Nu RPG</span>
          <span className="text-neutral-500">· Conta Digital & Cartão</span>
        </div>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="flex items-center gap-1 hover:text-white px-2 py-0.5 rounded-md hover:bg-neutral-800 transition-colors text-[11px]"
          title={isFullscreen ? 'Modo Celular' : 'Modo Tela Cheia'}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3 h-3" />
              <span>Moldura</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3 h-3" />
              <span>Expandir</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container / Mobile Emulator */}
      <div
        className={`w-full bg-[#f5f5f7] flex flex-col relative overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'max-w-xl h-screen rounded-none'
            : 'max-w-md h-[100dvh] sm:h-[844px] sm:max-h-[880px] sm:rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.65)] border-0 sm:border-[8px] sm:border-neutral-800'
        }`}
      >
        {/* Dynamic Island / Notch on mobile emulator */}
        {!isFullscreen && (
          <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 z-40 w-28 h-5 bg-neutral-950 rounded-full items-center justify-center pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-neutral-800 mr-2" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 ring-1 ring-neutral-700" />
          </div>
        )}

        {/* Mobile Status Bar */}
        <div className="sticky top-0 z-40 bg-[#820ad1] text-white px-6 pt-2 pb-1 flex items-center justify-between text-[11px] font-bold select-none shrink-0">
          <span className="tracking-tight">{currentTime}</span>

          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider text-purple-200">5G NU RPG</span>
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center">
              <span className="text-[10px] mr-1 text-purple-200 font-medium">98%</span>
              <Battery className="w-4 h-4 fill-white" />
            </div>
          </div>
        </div>

        {/* Scrollable App Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};
