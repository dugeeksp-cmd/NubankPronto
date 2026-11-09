import React, { useState } from 'react';
import {
  X,
  Settings,
  Shield,
  Coins,
  Sparkles,
  CreditCard,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  Download,
  Plus,
  Minus,
  User,
  Sliders,
} from 'lucide-react';
import { BankState, Caixinha } from '../../types/bank';
import { formatCurrency } from '../../utils/formatters';
import { PWAInstallBanner } from '../PWAInstallBanner';

interface MasterPanelModalProps {
  state: BankState;
  onClose: () => void;
  onUpdateBalance: (newBalance: number) => void;
  onAddMasterReward: (amount: number, reason: string) => void;
  onApplyPenalty: (amount: number, reason: string) => void;
  onUpdateCreditCard: (invoice: number, limit: number) => void;
  onUpdateInvestments: (total: number, yield12m?: number, boxes?: Caixinha[]) => void;
  onUpdatePlayerInfo: (name: string, title: string) => void;
  onResetBank: () => void;
  onExportStandaloneHTML: () => void;
}

export const MasterPanelModal: React.FC<MasterPanelModalProps> = ({
  state,
  onClose,
  onUpdateBalance,
  onAddMasterReward,
  onApplyPenalty,
  onUpdateCreditCard,
  onUpdateInvestments,
  onUpdatePlayerInfo,
  onResetBank,
  onExportStandaloneHTML,
}) => {
  const [balanceInput, setBalanceInput] = useState(state.balance.toFixed(2));
  const [rewardAmount, setRewardAmount] = useState('250.00');
  const [rewardReason, setRewardReason] = useState('Depósito via Pix · Transferência Recebida');
  const [penaltyAmount, setPenaltyAmount] = useState('50.00');
  const [penaltyReason, setPenaltyReason] = useState('Pagamento de Conta de Consumo · Débito');
  const [invoiceInput, setInvoiceInput] = useState(state.creditCard.currentInvoice.toFixed(2));
  const [limitInput, setLimitInput] = useState(state.creditCard.limit.toFixed(2));

  // Investment values state
  const [investedInput, setInvestedInput] = useState(state.investments.total.toFixed(2));
  const [yield12mInput, setYield12mInput] = useState(state.investments.yield12m.toFixed(2));
  const [boxesState, setBoxesState] = useState<Caixinha[]>(state.investments.boxes);

  const [nameInput, setNameInput] = useState(state.playerName);
  const [titleInput, setTitleInput] = useState(state.playerTitle);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const showSuccess = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleApplyBalance = () => {
    const val = parseFloat(balanceInput);
    if (!isNaN(val) && val >= 0) {
      onUpdateBalance(val);
      showSuccess(`Saldo atualizado diretamente para ${formatCurrency(val)}!`);
    }
  };

  const handleSendReward = () => {
    const val = parseFloat(rewardAmount);
    if (!isNaN(val) && val > 0) {
      onAddMasterReward(val, rewardReason.trim() || 'Depósito via Pix');
      showSuccess(`+${formatCurrency(val)} creditado na conta com sucesso!`);
    }
  };

  const handleSendPenalty = () => {
    const val = parseFloat(penaltyAmount);
    if (!isNaN(val) && val > 0) {
      onApplyPenalty(val, penaltyReason.trim() || 'Débito em Conta');
      showSuccess(`-${formatCurrency(val)} debitado da conta com sucesso!`);
    }
  };

  const handleApplyCreditCard = () => {
    const inv = parseFloat(invoiceInput);
    const lim = parseFloat(limitInput);
    if (!isNaN(inv) && !isNaN(lim)) {
      onUpdateCreditCard(inv, lim);
      showSuccess('Fatura e limite do cartão atualizados!');
    }
  };

  const handleUpdateBoxField = (boxId: string, field: 'title' | 'amount' | 'target' | 'yieldRate', value: any) => {
    setBoxesState((prev) =>
      prev.map((b) => (b.id === boxId ? { ...b, [field]: value } : b))
    );
  };

  const handleApplyInvestments = () => {
    const tot = parseFloat(investedInput);
    const yld = parseFloat(yield12mInput);

    // Calculate sum of boxes or use inputted total
    const sumBoxes = boxesState.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const finalTotal = !isNaN(tot) && tot > 0 ? tot : sumBoxes;
    const finalYield = !isNaN(yld) ? yld : state.investments.yield12m;

    onUpdateInvestments(finalTotal, finalYield, boxesState);
    showSuccess(`Valores da tela de investimentos e caixinhas atualizados!`);
  };

  const handleRecalculateTotalFromBoxes = () => {
    const sum = boxesState.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    setInvestedInput(sum.toFixed(2));
  };

  const handleApplyPlayerInfo = () => {
    if (nameInput.trim()) {
      onUpdatePlayerInfo(nameInput.trim(), titleInput.trim());
      showSuccess('Dados cadastrais da conta salvos!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border-2 border-purple-400">
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-900 via-purple-950 to-neutral-900 text-white p-5 flex items-center justify-between border-b border-purple-400/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-sm">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Configurações da Conta
                </h3>
                <span className="text-[10px] bg-purple-400/20 text-purple-300 border border-purple-400/40 px-2 py-0.5 rounded-full font-bold">
                  Modo Gestão
                </span>
              </div>
              <p className="text-[11px] text-neutral-300">
                Ajuste de saldo, faturas, limites e valores da tela de investimentos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Admin Body Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-neutral-800">
          {/* 1. Alterar Saldo em Conta Diretamente */}
          <section className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#820ad1]" />
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                  1. Saldo em Conta Corrente
                </h4>
              </div>
              <span className="text-[11px] text-neutral-500">
                Atual: <strong className="text-neutral-900">{formatCurrency(state.balance)}</strong>
              </span>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                  R$
                </span>
                <input
                  type="text"
                  value={balanceInput}
                  onChange={(e) => setBalanceInput(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-300 focus:border-[#820ad1] rounded-xl text-sm font-black text-neutral-900 outline-none tabular-nums"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyBalance}
                className="bg-[#820ad1] hover:bg-[#7208b8] active:scale-95 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
              >
                Atualizar Saldo
              </button>
            </div>
          </section>

          {/* 2. Edição Manual dos Valores da Tela de Investimentos */}
          <section className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-700" />
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                  2. Valores da Tela de Investimentos & Caixinhas
                </h4>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                Editável
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 leading-snug">
              Edite diretamente o total investido, o rendimento acumulado ou os valores guardados em cada caixinha individual.
            </p>

            {/* Totais Gerais */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">
                  Total Investido Geral (R$)
                </label>
                <input
                  type="text"
                  value={investedInput}
                  onChange={(e) => setInvestedInput(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="35543.85"
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-black text-neutral-900 outline-none tabular-nums"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">
                  Rendimento 12 Meses (R$)
                </label>
                <input
                  type="text"
                  value={yield12mInput}
                  onChange={(e) => setYield12mInput(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="3464.20"
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-black text-neutral-900 outline-none tabular-nums"
                />
              </div>
            </div>

            {/* Caixinhas Individuais */}
            <div className="space-y-2 pt-1 border-t border-amber-200/80">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-700">
                  Saldos por Caixinha:
                </span>
                <button
                  type="button"
                  onClick={handleRecalculateTotalFromBoxes}
                  className="text-[10px] text-amber-800 hover:underline font-semibold"
                >
                  Somar caixinhas ao total
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {boxesState.map((b) => (
                  <div key={b.id} className="p-2.5 bg-white rounded-xl border border-amber-200/80 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{b.emoji}</span>
                        <input
                          type="text"
                          value={b.title}
                          onChange={(e) => handleUpdateBoxField(b.id, 'title', e.target.value)}
                          className="text-xs font-bold text-neutral-900 border-b border-transparent hover:border-neutral-300 focus:border-[#820ad1] outline-none px-1"
                        />
                      </div>
                      <input
                        type="text"
                        value={b.yieldRate}
                        onChange={(e) => handleUpdateBoxField(b.id, 'yieldRate', e.target.value)}
                        placeholder="100% do CDI"
                        className="text-[10px] font-semibold text-emerald-700 text-right w-24 border-b border-transparent hover:border-neutral-300 focus:border-[#820ad1] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-neutral-400 block font-semibold">Saldo Atual (R$)</label>
                        <input
                          type="text"
                          value={b.amount.toString()}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                            handleUpdateBoxField(b.id, 'amount', val);
                          }}
                          className="w-full px-2 py-1 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-bold text-neutral-900 outline-none tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-neutral-400 block font-semibold">Meta Alvo (R$)</label>
                        <input
                          type="text"
                          value={b.target.toString()}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                            handleUpdateBoxField(b.id, 'target', val);
                          }}
                          className="w-full px-2 py-1 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-700 outline-none tabular-nums"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyInvestments}
              className="w-full bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar Alterações de Investimentos</span>
            </button>
          </section>

          {/* 3. Adicionar Depósito ou Lançar Débito Rápido */}
          <section className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                3. Adicionar Crédito / Depósito na Conta
              </h4>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                  Valor (R$)
                </label>
                <input
                  type="text"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="250.00"
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-neutral-900 outline-none tabular-nums"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                  Motivo / Descrição do Depósito
                </label>
                <input
                  type="text"
                  value={rewardReason}
                  onChange={(e) => setRewardReason(e.target.value)}
                  placeholder="Ex: Depósito via Pix, Salário, etc."
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs text-neutral-900 outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSendReward}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Creditar na Conta (+ {formatCurrency(parseFloat(rewardAmount) || 0)})</span>
            </button>
          </section>

          {/* 3.1 Débito / Pagamento Rápido */}
          <section className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 space-y-3">
            <div className="flex items-center gap-2">
              <Minus className="w-4 h-4 text-rose-700" />
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                3.1 Lançar Débito / Pagamento Rápido
              </h4>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <input
                  type="text"
                  value={penaltyAmount}
                  onChange={(e) => setPenaltyAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="50.00"
                  className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl text-xs font-bold text-neutral-900 outline-none tabular-nums"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  value={penaltyReason}
                  onChange={(e) => setPenaltyReason(e.target.value)}
                  placeholder="Ex: Pagamento de Conta de Luz / Água"
                  className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl text-xs text-neutral-900 outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSendPenalty}
              className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Minus className="w-4 h-4" />
              <span>Debitar da Conta (- {formatCurrency(parseFloat(penaltyAmount) || 0)})</span>
            </button>
          </section>

          {/* 4. Cartão de Crédito */}
          <section className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-neutral-700" />
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                4. Cartão de Crédito Nu RPG
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                  Fatura Atual (R$)
                </label>
                <input
                  type="text"
                  value={invoiceInput}
                  onChange={(e) => setInvoiceInput(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 outline-none tabular-nums"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                  Limite Total (R$)
                </label>
                <input
                  type="text"
                  value={limitInput}
                  onChange={(e) => setLimitInput(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 outline-none tabular-nums"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyCreditCard}
              className="w-full bg-neutral-800 hover:bg-neutral-900 active:scale-95 text-white font-bold text-xs py-2 rounded-xl transition-all"
            >
              Atualizar Cartão de Crédito
            </button>
          </section>

          {/* 5. Dados Cadastrais */}
          <section className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-neutral-700" />
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                5. Dados Cadastrais do Titular
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                  Agência e Conta
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyPlayerInfo}
              className="w-full bg-neutral-800 hover:bg-neutral-900 active:scale-95 text-white font-bold text-xs py-2 rounded-xl transition-all"
            >
              Salvar Dados Cadastrais
            </button>
          </section>

          {/* 6. Ações Globais: PWA, Exportar Standalone HTML e Resetar */}
          <section className="pt-2 border-t border-neutral-200 space-y-3">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
              Instalação PWA & Opções Avançadas
            </h4>

            {/* PWA Install Button / Status */}
            <PWAInstallBanner variant="master" />

            {/* Standalone HTML Exporter */}
            <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-purple-950">
                  Exportar Aplicativo em Arquivo Único HTML
                </h5>
                <p className="text-[11px] text-purple-800">
                  Baixe um arquivo .html único com PWA integrado para abrir em qualquer navegador offline.
                </p>
              </div>
              <button
                type="button"
                onClick={onExportStandaloneHTML}
                className="bg-[#820ad1] hover:bg-[#7208b8] active:scale-95 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 ml-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar HTML</span>
              </button>
            </div>

            {/* Reset Button */}
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full bg-neutral-100 hover:bg-rose-50 hover:text-rose-700 active:scale-95 text-neutral-600 font-bold text-xs py-2.5 rounded-xl transition-all border border-neutral-200 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Valores Padrão da Conta</span>
              </button>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-rose-800">
                  ⚠️ Deseja restaurar os saldos, faturas e movimentações padrão?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetBank();
                      setConfirmReset(false);
                      showSuccess('Conta restaurada aos valores padrão!');
                    }}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 rounded-xl"
                  >
                    Sim, Restaurar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs py-2 rounded-xl"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
