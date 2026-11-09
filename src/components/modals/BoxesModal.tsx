import React, { useState } from 'react';
import { X, Plus, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';
import { BankState } from '../../types/bank';
import { formatCurrency } from '../../utils/formatters';

interface BoxesModalProps {
  state: BankState;
  onClose: () => void;
  onDeposit: (boxId: string, amount: number) => boolean;
  onWithdraw: (boxId: string, amount: number) => boolean;
  onCreateBox: (title: string, target: number, emoji: string) => void;
}

export const BoxesModal: React.FC<BoxesModalProps> = ({
  state,
  onClose,
  onDeposit,
  onWithdraw,
  onCreateBox,
}) => {
  const { investments, balance, isBalanceHidden } = state;
  const [selectedBoxId, setSelectedBoxId] = useState<string>(investments.boxes[0]?.id || '');
  const [actionType, setActionType] = useState<'deposit' | 'withdraw' | 'create'>('deposit');
  const [amountStr, setAmountStr] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // New box form state
  const [newTitle, setNewTitle] = useState('');
  const [newTargetStr, setNewTargetStr] = useState('');
  const [newEmoji, setNewEmoji] = useState('💰');

  const selectedBox = investments.boxes.find((b) => b.id === selectedBoxId);

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (actionType === 'create') {
      if (!newTitle.trim()) {
        setFeedback('Dê um nome para a sua nova caixinha.');
        return;
      }
      const target = parseFloat(newTargetStr) || 1000;
      onCreateBox(newTitle.trim(), target, newEmoji);
      setFeedback(`Caixinha "${newTitle}" criada com sucesso!`);
      setActionType('deposit');
      return;
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      setFeedback('Informe um valor válido.');
      return;
    }

    if (actionType === 'deposit') {
      if (amount > balance) {
        setFeedback(`Saldo insuficiente em conta! Você tem ${formatCurrency(balance)}.`);
        return;
      }
      const ok = onDeposit(selectedBoxId, amount);
      if (ok) {
        setFeedback(`${formatCurrency(amount)} guardado com sucesso na caixinha!`);
        setAmountStr('');
      }
    } else {
      if (!selectedBox || amount > selectedBox.amount) {
        setFeedback(`Valor maior que o saldo guardado na caixinha!`);
        return;
      }
      const ok = onWithdraw(selectedBoxId, amount);
      if (ok) {
        setFeedback(`${formatCurrency(amount)} resgatado para a sua conta principal!`);
        setAmountStr('');
      }
    }
  };

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
              <h3 className="text-base font-bold">Caixinhas Nu RPG</h3>
              <p className="text-[11px] text-purple-200">
                Guarde dinheiro com rendimento a 100% do CDI e garantia do FGC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-90 flex items-center justify-center text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action tabs */}
        <div className="flex border-b border-neutral-100 bg-neutral-50 px-4 pt-2">
          <button
            onClick={() => {
              setActionType('deposit');
              setFeedback(null);
            }}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all ${
              actionType === 'deposit'
                ? 'border-[#820ad1] text-[#820ad1] bg-white rounded-t-xl'
                : 'border-transparent text-neutral-500'
            }`}
          >
            Guardar
          </button>
          <button
            onClick={() => {
              setActionType('withdraw');
              setFeedback(null);
            }}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all ${
              actionType === 'withdraw'
                ? 'border-[#820ad1] text-[#820ad1] bg-white rounded-t-xl'
                : 'border-transparent text-neutral-500'
            }`}
          >
            Resgatar
          </button>
          <button
            onClick={() => {
              setActionType('create');
              setFeedback(null);
            }}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all ${
              actionType === 'create'
                ? 'border-[#820ad1] text-[#820ad1] bg-white rounded-t-xl'
                : 'border-transparent text-neutral-500'
            }`}
          >
            + Nova Caixinha
          </button>
        </div>

        <form onSubmit={handleAction} className="p-5 overflow-y-auto space-y-4">
          {actionType === 'create' ? (
            /* Create new Box view */
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Ícone da Caixinha
                </label>
                <div className="flex gap-2">
                  {['💰', '✈️', '🚗', '🏠', '📈', '🎓', '💻'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewEmoji(emoji)}
                      className={`text-xl p-2 rounded-xl border transition-all ${
                        newEmoji === emoji
                          ? 'border-[#820ad1] bg-purple-50 scale-105'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Objetivo / Nome da Caixinha
                </label>
                <input
                  type="text"
                  placeholder="Ex: Reforma da Casa, Reserva de Férias..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#f0f1f5] rounded-xl text-xs font-bold text-neutral-900 outline-none focus:bg-white focus:ring-1 focus:ring-[#820ad1]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Meta Financeira (R$)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex: 5000,00"
                  value={newTargetStr}
                  onChange={(e) => setNewTargetStr(e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.'))}
                  className="w-full px-3 py-2.5 bg-[#f0f1f5] rounded-xl text-xs font-bold text-neutral-900 outline-none focus:bg-white focus:ring-1 focus:ring-[#820ad1]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#820ad1] hover:bg-[#7208b8] active:scale-95 text-white font-bold text-xs py-3 rounded-full transition-all shadow-sm flex items-center justify-center gap-1.5 mt-4"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Caixinha com Rendimento</span>
              </button>
            </div>
          ) : (
            /* Deposit or Withdraw View */
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                  Selecione a Caixinha
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {investments.boxes.map((box) => (
                    <div
                      key={box.id}
                      onClick={() => setSelectedBoxId(box.id)}
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        selectedBoxId === box.id
                          ? 'border-[#820ad1] bg-purple-50 ring-1 ring-[#820ad1]'
                          : 'border-neutral-100 bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{box.emoji}</span>
                        <div>
                          <p className="text-xs font-bold text-neutral-900">{box.title}</p>
                          <span className="text-[10px] text-emerald-600 font-semibold">
                            Rendimento: {box.yieldRate}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-neutral-900 tabular-nums">
                        {formatCurrency(box.amount, isBalanceHidden)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amount input */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  {actionType === 'deposit'
                    ? `Quanto deseja guardar? (Saldo em conta: ${formatCurrency(balance, isBalanceHidden)})`
                    : `Quanto deseja resgatar para a conta principal?`}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">
                    R$
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.'))}
                    className="w-full pl-10 pr-4 py-3 bg-[#f0f1f5] rounded-2xl text-lg font-black text-neutral-900 outline-none focus:bg-white focus:ring-2 focus:ring-[#820ad1] tabular-nums"
                  />
                </div>
              </div>

              {feedback && (
                <div className="p-2.5 bg-neutral-100 rounded-xl text-xs font-semibold text-neutral-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#820ad1] shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#820ad1] hover:bg-[#7208b8] active:scale-95 text-white font-bold text-xs py-3.5 rounded-full transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {actionType === 'deposit' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                <span>
                  {actionType === 'deposit' ? 'Confirmar Aplicação na Caixinha' : 'Resgatar para a Conta'}
                </span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
