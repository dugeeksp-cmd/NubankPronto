import React, { useState } from 'react';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2, WifiOff } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  variant?: 'banner' | 'card' | 'master';
  onDismiss?: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  variant = 'banner',
  onDismiss,
}) => {
  const { isInstallable, isInstalled, isIOS, isOnline, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // If dismissed or already installed, don't show the promotional banner
  if (isInstalled) {
    if (variant === 'master') {
      return (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">Aplicativo instalado no dispositivo</span>
          </div>
          <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">Standalone</span>
        </div>
      );
    }
    return null;
  }

  if (isDismissed && variant === 'banner') {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok && onDismiss) onDismiss();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-sm animate-in slide-in-from-top-1 select-none">
          <WifiOff className="w-3.5 h-3.5 shrink-0" />
          <span>Modo Offline Ativo · Dados salvos com segurança no seu dispositivo</span>
        </div>
      )}

      {/* Banner on Home Screen */}
      {variant === 'banner' && (
        <div className="mx-4 mt-2 bg-gradient-to-r from-purple-900 via-[#820ad1] to-[#6d09af] text-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between gap-3 border border-purple-400/30">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-amber-300 shrink-0 font-black text-sm">
              nu
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold leading-tight flex items-center gap-1.5">
                <span>Instalar o app do Nubank</span>
                <span className="text-[9px] bg-amber-400 text-purple-950 font-black px-1.5 rounded-full uppercase">PWA</span>
              </h4>
              <p className="text-[10px] text-purple-200 truncate mt-0.5">
                Adicione à tela de início para acesso rápido e seguro em tela cheia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-white hover:bg-purple-50 active:scale-95 text-[#820ad1] font-extrabold text-[11px] py-1.5 px-3 rounded-full transition-all shadow-sm flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Instalar</span>
            </button>
            <button
              onClick={() => {
                setIsDismissed(true);
                if (onDismiss) onDismiss();
              }}
              className="text-white/60 hover:text-white p-1 rounded-full transition-colors"
              title="Fechar aviso"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Master Panel Version */}
      {variant === 'master' && (
        <div className="p-3.5 bg-purple-50/80 border border-purple-200 rounded-2xl flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#820ad1]" />
              <h5 className="text-xs font-bold text-neutral-900">
                Instalar Aplicativo no Celular
              </h5>
            </div>
            <p className="text-[11px] text-neutral-600">
              Instale no Android ou iOS para ter acesso com um toque sem barra de navegador.
            </p>
          </div>
          <button
            type="button"
            onClick={handleInstallClick}
            className="bg-[#820ad1] hover:bg-[#7208b8] active:scale-95 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isIOS ? 'Como Instalar' : 'Instalar App'}</span>
          </button>
        </div>
      )}

      {/* iOS Installation Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-5 space-y-4 text-neutral-800">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#820ad1] text-white flex items-center justify-center font-black text-sm">
                  nu
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Instalar no iPhone / Safari</h3>
                  <span className="text-[10px] text-neutral-500">Nubank como App</span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="p-2 bg-purple-100 text-[#820ad1] rounded-xl shrink-0 mt-0.5">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-neutral-900 block font-bold">1. Toque em Compartilhar</strong>
                  <span className="text-neutral-600">No menu inferior do Safari, clique no ícone de compartilhamento (quadrado com seta para cima).</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="p-2 bg-purple-100 text-[#820ad1] rounded-xl shrink-0 mt-0.5">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-neutral-900 block font-bold">2. Adicionar à Tela de Início</strong>
                  <span className="text-neutral-600">Role a lista de opções para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.</span>
                </div>
              </div>

              <div className="p-3 bg-purple-50 text-purple-900 rounded-2xl text-[11px] leading-relaxed">
                Pronto! O ícone roxo do Nubank aparecerá entre seus aplicativos nativos, abrindo em tela cheia com salvamento offline.
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full bg-[#820ad1] hover:bg-[#7208b8] active:scale-95 text-white font-bold text-xs py-2.5 rounded-full transition-all"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
