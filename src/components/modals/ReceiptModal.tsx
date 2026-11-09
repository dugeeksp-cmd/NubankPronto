import React, { useState } from 'react';
import { X, CheckCircle2, Share2, Copy, Trash2, Layers, AlertCircle, Calendar, Clock } from 'lucide-react';
import { Transaction } from '../../types/bank';
import { formatCurrency } from '../../utils/formatters';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onCopyAuthCode: (code: string) => void;
  onDeleteTransaction?: (txId: string) => void;
  onDuplicateTransaction?: (tx: Transaction, newAmount: number, newDate: string, newTime: string) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  onClose,
  onCopyAuthCode,
  onDeleteTransaction,
  onDuplicateTransaction,
}) => {
  if (!transaction) return null;

  const isPositive = transaction.amount > 0;
  const [showDuplicateForm, setShowDuplicateForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form states for duplication
  const initialAbsAmount = Math.abs(transaction.amount).toFixed(2);
  const [newAmountStr, setNewAmountStr] = useState(initialAbsAmount);

  // Extract initial date and time if available (e.g., "08 NOV às 20:45")
  const dateParts = transaction.date.split(' às ');
  const defaultDate = dateParts[0] || 'Hoje';
  const defaultTime = dateParts[1] || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const [newDate, setNewDate] = useState(defaultDate);
  const [newTime, setNewTime] = useState(defaultTime);
  const [formError, setFormError] = useState<string | null>(null);

  const handleConfirmDuplicate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(newAmountStr.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError('Informe um valor válido maior que zero.');
      return;
    }

    if (!newDate.trim()) {
      setFormError('Informe a data do lançamento.');
      return;
    }

    if (onDuplicateTransaction) {
      onDuplicateTransaction(transaction, parsedAmount, newDate.trim(), newTime.trim());
    }
  };

  const handleConfirmDelete = () => {
    if (onDeleteTransaction) {
      onDeleteTransaction(transaction.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#820ad1] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
              nu
            </div>
            <div>
              <h3 className="text-sm font-bold">Comprovante de Operação</h3>
              <span className="text-[10px] text-purple-200">Nu RPG Pagamentos S.A.</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-90 flex items-center justify-center text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-neutral-800 flex-1">
          {/* Status & Value */}
          <div className="text-center pb-3 border-b border-neutral-100">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-[#820ad1] mx-auto flex items-center justify-center mb-2">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
              {transaction.title}
            </span>
            <div
              className={`text-2xl sm:text-3xl font-black mt-1 tabular-nums ${
                isPositive ? 'text-emerald-600' : 'text-neutral-900'
              }`}
            >
              {isPositive ? `+ ${formatCurrency(transaction.amount)}` : formatCurrency(Math.abs(transaction.amount))}
            </div>
            <p className="text-xs text-neutral-400 mt-1">{transaction.date}</p>
          </div>

          {/* Details */}
          <div className="space-y-2.5 text-xs">
            {transaction.recipientOrPayer && (
              <div>
                <span className="text-neutral-400 text-[11px] block">
                  {isPositive ? 'Origem do Recurso' : 'Destinatário'}
                </span>
                <span className="font-bold text-neutral-900 text-sm">
                  {transaction.recipientOrPayer}
                </span>
              </div>
            )}

            {transaction.pixKey && (
              <div>
                <span className="text-neutral-400 text-[11px] block">Chave Pix</span>
                <span className="font-semibold text-neutral-800 break-all font-mono">
                  {transaction.pixKey}
                </span>
              </div>
            )}

            <div>
              <span className="text-neutral-400 text-[11px] block">Instituição Financeira</span>
              <span className="font-medium text-neutral-800">
                Nu RPG Pagamentos S.A. - Instituição de Pagamento (Banco 260)
              </span>
            </div>

            {transaction.note && (
              <div>
                <span className="text-neutral-400 text-[11px] block">Descrição</span>
                <span className="font-medium text-neutral-700 bg-neutral-50 p-2 rounded-xl block border border-neutral-100 mt-0.5">
                  "{transaction.note}"
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-dashed border-neutral-200">
              <span className="text-neutral-400 text-[10px] block uppercase tracking-wider">
                Autenticação Bancária
              </span>
              <div className="flex items-center justify-between mt-1 bg-neutral-50 p-2 rounded-xl border border-neutral-100">
                <span className="font-mono text-[10px] text-neutral-600 break-all font-bold">
                  {transaction.authCode}
                </span>
                <button
                  onClick={() => onCopyAuthCode(transaction.authCode)}
                  className="p-1 hover:bg-neutral-200 rounded-md text-neutral-500 transition-colors ml-2 shrink-0"
                  title="Copiar código de autenticação"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Inline Duplicate Form */}
          {showDuplicateForm && (
            <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#820ad1]">
                  <Layers className="w-4 h-4" />
                  <span>Duplicar Transação</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDuplicateForm(false)}
                  className="text-neutral-400 hover:text-neutral-600 text-xs"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConfirmDuplicate} className="space-y-2.5 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Novo Valor (R$)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-neutral-400">
                      R$
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={newAmountStr}
                      onChange={(e) => {
                        setNewAmountStr(e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.'));
                        setFormError(null);
                      }}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 outline-none focus:border-[#820ad1]"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      <span>Data</span>
                    </label>
                    <input
                      type="text"
                      value={newDate}
                      onChange={(e) => {
                        setNewDate(e.target.value);
                        setFormError(null);
                      }}
                      placeholder="Ex: 08 NOV"
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 outline-none focus:border-[#820ad1]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>Horário</span>
                    </label>
                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => {
                        setNewTime(e.target.value);
                        setFormError(null);
                      }}
                      placeholder="Ex: 20:45"
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 outline-none focus:border-[#820ad1]"
                    />
                  </div>
                </div>

                {formError && (
                  <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 bg-[#820ad1] hover:bg-[#7208b8] active:scale-95 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-2xs"
                  >
                    Confirmar Duplicação
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDuplicateForm(false)}
                    className="px-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold py-2 rounded-xl text-xs transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Delete Confirmation Card */}
          {showDeleteConfirm && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Confirmar Exclusão</span>
              </div>
              <p className="text-[11px] text-rose-900 leading-snug">
                Deseja realmente excluir este lançamento do extrato? O saldo da conta será recalculado automaticamente no sistema.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-2xs"
                >
                  Sim, Excluir Lançamento
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold py-2 rounded-xl text-xs transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 space-y-2">
          {/* Main share button */}
          <button
            onClick={() => onCopyAuthCode(`Comprovante Nu RPG: ${transaction.title} de ${formatCurrency(Math.abs(transaction.amount))} para ${transaction.recipientOrPayer || 'Nu RPG'}. Autenticação: ${transaction.authCode}`)}
            className="w-full bg-[#820ad1] hover:bg-[#7208b8] active:scale-95 text-white font-bold text-xs py-3 rounded-full flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar Comprovante</span>
          </button>

          {/* Discreet Action Buttons: Excluir e Duplicar */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setShowDuplicateForm((prev) => !prev);
                setShowDeleteConfirm(false);
              }}
              className="py-2 px-3 rounded-xl border border-neutral-200 hover:border-purple-300 hover:bg-purple-50/50 text-neutral-700 hover:text-[#820ad1] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Duplicar transação</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowDeleteConfirm((prev) => !prev);
                setShowDuplicateForm(false);
              }}
              className="py-2 px-3 rounded-xl border border-neutral-200 hover:border-rose-300 hover:bg-rose-50/50 text-neutral-700 hover:text-rose-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir lançamento</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
