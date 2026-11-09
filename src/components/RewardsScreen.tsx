import React, { useState } from 'react';
import {
  Gift,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Coins,
  Award,
  Tag,
} from 'lucide-react';
import { BankState, Benefit } from '../types/bank';
import { formatCurrency } from '../utils/formatters';

interface RewardsScreenProps {
  state: BankState;
  onClaimQuest: (questId: string) => void;
  onRedeemSecretCode: (code: string) => { success: boolean; message: string; amount?: number };
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({
  state,
  onClaimQuest,
  onRedeemSecretCode,
}) => {
  const { quests, isBalanceHidden } = state;
  const [secretCode, setSecretCode] = useState('');
  const [redeemFeedback, setRedeemFeedback] = useState<{ message: string; success: boolean } | null>(null);

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretCode.trim()) return;

    const result = onRedeemSecretCode(secretCode.trim());
    setRedeemFeedback({ message: result.message, success: result.success });
    if (result.success) {
      setSecretCode('');
    }
  };

  const getCategoryColor = (cat: Benefit['category']) => {
    switch (cat) {
      case 'Cashback':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Nucoin':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Pontos':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Parceiros':
        return 'text-amber-700 bg-amber-50 border-amber-200';
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Header Benefícios & Nucoin */}
      <section className="bg-gradient-to-br from-[#820ad1] via-[#6d09af] to-[#510486] text-white p-5 rounded-b-3xl -mt-2 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider">
              <Gift className="w-4 h-4" />
              <span>Nucoin & Benefícios</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight mt-1">
              Programa de Recompensas
            </h2>
            <p className="text-xs text-purple-200 mt-0.5">
              Acumule Nucoins e receba cashback creditado diretamente na sua conta
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
            🟣
          </div>
        </div>

        {/* Level Banner */}
        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-300" />
            <span className="font-semibold text-white">Nível 4 no programa Nucoin</span>
          </div>
          <span className="text-purple-200 font-medium">Cashback a cada compra</span>
        </div>
      </section>

      {/* Resgate de Código Promocional / Cupom */}
      <section className="px-4">
        <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-[#820ad1]" />
            <h3 className="text-xs font-bold text-neutral-900">
              Resgatar Cupom Promocional ou Voucher
            </h3>
          </div>
          <p className="text-[11px] text-neutral-500 mb-3">
            Recebeu um código de promoção ou cupom de parceiro? Digite abaixo para resgatar na sua conta. (Ex: tente <code className="bg-purple-50 text-[#820ad1] px-1 rounded font-bold">NURPG50</code>, <code className="bg-purple-50 text-[#820ad1] px-1 rounded font-bold">CASHBACK</code> ou <code className="bg-purple-50 text-[#820ad1] px-1 rounded font-bold">VIP2026</code>).
          </p>

          <form onSubmit={handleRedeem} className="flex gap-2">
            <input
              type="text"
              value={secretCode}
              onChange={(e) => {
                setSecretCode(e.target.value.toUpperCase());
                if (redeemFeedback) setRedeemFeedback(null);
              }}
              placeholder="Ex: NURPG50"
              className="flex-1 bg-[#f0f1f5] focus:bg-white focus:ring-2 focus:ring-[#820ad1] border border-transparent rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-900 outline-none transition-all"
            />
            <button
              type="submit"
              className="bg-[#820ad1] hover:bg-[#7208b8] active:scale-95 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1"
            >
              <span>Resgatar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {redeemFeedback && (
            <div
              className={`mt-2.5 p-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                redeemFeedback.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {redeemFeedback.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : null}
              <span>{redeemFeedback.message}</span>
            </div>
          )}
        </div>
      </section>

      {/* Campanhas e Vantagens */}
      <section className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900">
            Campanhas de Cashback & Vantagens
          </h3>
          <span className="text-xs text-neutral-500 font-medium">
            Benefícios exclusivos
          </span>
        </div>

        <div className="space-y-3">
          {quests.map((benefit) => {
            return (
              <div
                key={benefit.id}
                className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-50 text-[#820ad1] shrink-0 mt-0.5">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(
                            benefit.category
                          )}`}
                        >
                          {benefit.category}
                        </span>
                        <span className="text-[11px] font-extrabold text-emerald-600 tabular-nums">
                          +{formatCurrency(benefit.reward, isBalanceHidden)}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-neutral-900 mt-1">
                        {benefit.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500">
                    Status:{' '}
                    {benefit.claimed ? (
                      <strong className="text-neutral-700 font-semibold">Creditado</strong>
                    ) : benefit.completed ? (
                      <strong className="text-emerald-600 font-bold">Disponível para resgate</strong>
                    ) : (
                      <strong className="text-neutral-500 font-medium">Em andamento</strong>
                    )}
                  </span>

                  {benefit.claimed ? (
                    <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-3 py-1.5 rounded-full">
                      ✓ Recebido
                    </span>
                  ) : benefit.completed ? (
                    <button
                      onClick={() => onClaimQuest(benefit.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold py-1.5 px-3 rounded-full transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Resgatar Cashback</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-neutral-400">
                      Disponível após faturamento
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
