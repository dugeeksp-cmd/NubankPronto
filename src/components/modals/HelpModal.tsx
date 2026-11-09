import React from 'react';
import { X, Shield, Sparkles, Coins, CreditCard, Settings } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
  onOpenMasterPanel: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose, onOpenMasterPanel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#820ad1] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
              nu
            </div>
            <div>
              <h3 className="text-base font-bold">Me Ajuda · Nu RPG</h3>
              <p className="text-[11px] text-purple-200">Dúvidas frequentes e canais de atendimento</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-90 flex items-center justify-center text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-neutral-700">
          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 space-y-1">
            <h4 className="font-bold text-[#820ad1] text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Sua Conta do Nu RPG</span>
            </h4>
            <p className="text-neutral-600 leading-relaxed">
              O Nu RPG simplifica suas finanças com controle total em tempo real: Pix 24h gratuito, rendimento nas Caixinhas, cartão de crédito sem anuidade e compras com cashback.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-2xl">
              <Coins className="w-5 h-5 text-[#820ad1] shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block font-bold">Transferências Pix & Comprovantes</strong>
                <span>Envie e receba transferências instantâneas para qualquer banco a qualquer momento, com comprovante oficial emitido na hora.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-2xl">
              <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block font-bold">Caixinhas & Rendimentos</strong>
                <span>Guarde dinheiro com rendimento diário de 100% do CDI e garantia do FGC até R$ 250 mil por CPF.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-2xl">
              <CreditCard className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block font-bold">Cartão de Crédito Nu RPG</strong>
                <span>Acompanhe seus gastos em tempo real na fatura, consulte seu limite disponível e pague com saldo da conta.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-2xl">
              <Settings className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block font-bold">Configurações da Conta</strong>
                <span>Acesse o ícone de engrenagem ⚙️ para gerenciar seu saldo, simular depósitos ou atualizar dados cadastrais.</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenMasterPanel();
              }}
              className="w-full bg-[#820ad1] hover:bg-[#7208b8] active:scale-95 text-white font-bold py-2.5 rounded-full transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Abrir Configurações da Conta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
