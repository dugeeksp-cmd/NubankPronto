import React, { useState } from 'react';
import { X, Coins, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface LoanModalProps {
  maxLoanAmount?: number;
  onClose: () => void;
  onContractLoan: (amount: number, installments: number, totalWithInterest: number) => void;
}

export const LoanModal: React.FC<LoanModalProps> = ({
  maxLoanAmount = 25000,
  onClose,
  onContractLoan,
}) => {
  const [loanAmount, setLoanAmount] = useState(2000);
  const [installments, setInstallments] = useState(12);
  const [isSuccess, setIsSuccess] = useState(false);

  // 1.5% a.m. interest rate
  const monthlyRate = 0.015;
  const totalAmount = loanAmount * Math.pow(1 + monthlyRate, installments);
  const installmentValue = totalAmount / installments;

  const handleContract = () => {
    onContractLoan(loanAmount, installments, totalAmount);
    setIsSuccess(true);
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
              <h3 className="text-base font-bold">Empréstimo Pessoal Nu RPG</h3>
              <p className="text-[11px] text-purple-200">Crédito pré-aprovado com taxa reduzida</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-90 flex items-center justify-center text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-extrabold text-neutral-900">
              Valor Creditado na Conta!
            </h3>
            <p className="text-xs text-neutral-600">
              O montante de <strong className="text-[#820ad1] font-bold">{formatCurrency(loanAmount)}</strong> já está disponível no seu saldo da conta Nu RPG para usar como quiser.
            </p>
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs text-neutral-600">
              Parcelamento: {installments}x de {formatCurrency(installmentValue)}/mês com vencimento inicial em até 90 dias.
            </div>
            <button
              onClick={onClose}
              className="w-full bg-[#820ad1] hover:bg-[#7208b8] active:scale-95 text-white font-bold text-xs py-3 rounded-full transition-all shadow-sm"
            >
              Voltar ao Início
            </button>
          </div>
        ) : (
          <div className="p-5 overflow-y-auto space-y-5">
            {/* Value selector */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                De quanto você precisa?
              </label>
              <div className="text-3xl font-black text-neutral-900 tabular-nums">
                {formatCurrency(loanAmount)}
              </div>
              <input
                type="range"
                min="500"
                max={maxLoanAmount}
                step="500"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full mt-3 accent-[#820ad1] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                <span>Mínimo: R$ 500</span>
                <span>Limite disponível: {formatCurrency(maxLoanAmount)}</span>
              </div>
            </div>

            {/* Installments options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 block">
                Escolha o número de parcelas
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[6, 12, 24].map((n) => {
                  const simulatedInst = (loanAmount * Math.pow(1.015, n)) / n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setInstallments(n)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        installments === n
                          ? 'border-[#820ad1] bg-purple-50 text-[#820ad1] ring-1 ring-[#820ad1] font-bold'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span className="text-sm font-extrabold block">{n}x</span>
                      <span className="text-[11px] mt-0.5 block">{formatCurrency(simulatedInst)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary info box */}
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Valor do empréstimo:</span>
                <strong className="text-neutral-900">{formatCurrency(loanAmount)}</strong>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Taxa de juros:</span>
                <strong className="text-emerald-700">1,50% ao mês</strong>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Total a pagar:</span>
                <strong className="text-neutral-900">{formatCurrency(totalAmount)}</strong>
              </div>
              <div className="pt-2 border-t border-purple-100 text-[11px] text-neutral-600">
                Comece a pagar em até 90 dias com débito automático em conta.
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={handleContract}
              className="w-full bg-[#820ad1] hover:bg-[#7208b8] active:scale-95 text-white font-bold text-xs py-3.5 rounded-full transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Coins className="w-4 h-4" />
              <span>Contratar Empréstimo</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
