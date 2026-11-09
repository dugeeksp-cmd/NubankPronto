import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Lock,
  Unlock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { CreditCardData, Transaction } from '../../types/bank';
import { formatCurrency } from '../../utils/formatters';

interface CreditCardModalProps {
  creditCard: CreditCardData;
  balance: number;
  isBalanceHidden: boolean;
  transactions: Transaction[];
  onClose: () => void;
  onPayInvoice: (amount: number) => boolean;
  onToggleCardBlock: () => void;
}

export const CreditCardModal: React.FC<CreditCardModalProps> = ({
  creditCard,
  balance,
  isBalanceHidden,
  transactions,
  onClose,
  onPayInvoice,
  onToggleCardBlock,
}) => {
  const [payAmountStr, setPayAmountStr] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedCard, setCopiedCard] = useState(false);

  const cardTransactions = transactions.filter((t) => t.category === 'card');
  const availableLimit = Math.max(0, creditCard.limit - creditCard.currentInvoice);

  const handlePay = (isFull: boolean) => {
    setError(null);
    const amountToPay = isFull ? creditCard.currentInvoice : parseFloat(payAmountStr);

    if (isNaN(amountToPay) || amountToPay <= 0) {
      setError('Informe um valor de pagamento válido.');
      return;
    }

    if (amountToPay > balance) {
      setError(`Saldo em conta insuficiente! Você possui ${formatCurrency(balance)}.`);
      return;
    }

    const success = onPayInvoice(amountToPay);
    if (success) {
      setPaymentSuccess(`Fatura de ${formatCurrency(amountToPay)} paga com sucesso!`);
      setPayAmountStr('');
      setTimeout(() => setPaymentSuccess(null), 3500);
    }
  };

  const copyCardNumber = () => {
    navigator.clipboard?.writeText('5502 8841 9923 8819');
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
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
              <h3 className="text-base font-bold">Cartão de Crédito Nu RPG</h3>
              <p className="text-[11px] text-purple-200">Bandeira Mastercard Platinum</p>
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
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Virtual Card Graphic */}
          <div className="bg-gradient-to-tr from-[#520083] via-[#7507bb] to-[#8d10df] p-5 rounded-2xl text-white shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <span className="text-lg font-black tracking-tight">nu</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 uppercase tracking-wider">
                  {creditCard.isCardBlocked ? 'Bloqueado' : 'Virtual Ativo'}
                </span>
                <button
                  onClick={onToggleCardBlock}
                  className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                  title={creditCard.isCardBlocked ? 'Desbloquear cartão' : 'Bloquear temporariamente'}
                >
                  {creditCard.isCardBlocked ? <Lock className="w-3.5 h-3.5 text-amber-300" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-purple-200 block uppercase tracking-wider">Número do Cartão</span>
              <div className="flex items-center gap-2 font-mono text-sm tracking-widest font-bold">
                <span>{creditCard.isCardBlocked ? '•••• •••• •••• ••••' : creditCard.virtualCardNumber}</span>
                <button
                  onClick={copyCardNumber}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Copiar dados do cartão"
                >
                  {copiedCard ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-white/70" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-end mt-4 pt-3 border-t border-white/20 text-xs">
              <div>
                <span className="text-[10px] text-purple-200 block">CVV</span>
                <span className="font-mono font-bold">{creditCard.isCardBlocked ? '•••' : creditCard.virtualCardCvv}</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-200 block">Validade</span>
                <span className="font-mono font-bold">12/32</span>
              </div>
              <div className="w-8 h-5 rounded bg-amber-400/80 flex items-center justify-center font-bold text-[9px] text-purple-900 shadow-xs">
                MC
              </div>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-neutral-500 font-medium">Fatura Atual</span>
                <div className="text-2xl font-black text-neutral-900 tabular-nums">
                  {formatCurrency(creditCard.currentInvoice, isBalanceHidden)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-500 font-medium">Vencimento</span>
                <div className="text-sm font-bold text-neutral-800 flex items-center gap-1 justify-end">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{creditCard.dueDate}</span>
                </div>
              </div>
            </div>

            {/* Limit Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">
                  Limite disponível: <strong className="text-neutral-900">{formatCurrency(availableLimit, isBalanceHidden)}</strong>
                </span>
                <span className="text-neutral-400">Total: {formatCurrency(creditCard.limit, isBalanceHidden)}</span>
              </div>
              <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#820ad1] h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.round((creditCard.currentInvoice / creditCard.limit) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Pay Invoice Form */}
          {creditCard.currentInvoice > 0 ? (
            <div className="space-y-3 p-4 bg-white rounded-2xl border border-purple-100 shadow-2xs">
              <h4 className="text-xs font-bold text-neutral-900">
                Pagar Fatura com Saldo da Conta
              </h4>
              <p className="text-[11px] text-neutral-500">
                Seu saldo disponível: <strong className="text-neutral-900">{formatCurrency(balance, isBalanceHidden)}</strong>
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handlePay(true)}
                  className="flex-1 bg-[#820ad1] hover:bg-[#7208b8] active:scale-95 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-sm"
                >
                  Pagar Total ({formatCurrency(creditCard.currentInvoice)})
                </button>
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Ou outro valor..."
                  value={payAmountStr}
                  onChange={(e) => setPayAmountStr(e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.'))}
                  className="flex-1 px-3 py-2 bg-[#f0f1f5] rounded-xl text-xs font-bold text-neutral-900 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handlePay(false)}
                  className="bg-neutral-800 hover:bg-neutral-900 active:scale-95 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all"
                >
                  Pagar Parcial
                </button>
              </div>

              {error && (
                <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded-xl font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {paymentSuccess && (
                <div className="p-2 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{paymentSuccess}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
              <h5 className="text-xs font-bold text-emerald-900">Fatura em dia!</h5>
              <p className="text-[11px] text-emerald-700">Você não possui pendências de fatura no momento.</p>
            </div>
          )}

          {/* Card Purchases History */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-neutral-800 block">
              Lançamentos Recentes na Fatura
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {cardTransactions.length === 0 ? (
                <p className="text-xs text-neutral-400 py-2">Nenhum lançamento recente no cartão.</p>
              ) : (
                cardTransactions.map((tx) => (
                  <div key={tx.id} className="p-2.5 rounded-xl bg-neutral-50 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-neutral-900 leading-tight">{tx.title}</p>
                      <p className="text-[10px] text-neutral-400">{tx.subtitle} · {tx.date}</p>
                    </div>
                    <span className="font-extrabold text-neutral-900 tabular-nums">
                      {formatCurrency(Math.abs(tx.amount), isBalanceHidden)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
