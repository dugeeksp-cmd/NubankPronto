import React from 'react';
import {
  ChevronRight,
  Pencil,
  ArrowUpDown,
  Barcode,
  Coins,
  Smartphone,
  ShieldCheck,
  CreditCard,
  Users,
} from 'lucide-react';
import { BankState } from '../types/bank';
import { formatCurrency } from '../utils/formatters';
import { PWAInstallBanner } from './PWAInstallBanner';

interface HomeScreenProps {
  state: BankState;
  onOpenPixModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenCardModal: () => void;
  onOpenLoanModal: () => void;
  onOpenBoxesModal: () => void;
  onNavigateToTab: (tab: 'home' | 'investments' | 'rewards' | 'services') => void;
  onOpenMasterPanel: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  state,
  onOpenPixModal,
  onOpenHistoryModal,
  onOpenCardModal,
  onOpenLoanModal,
  onOpenBoxesModal,
  onNavigateToTab,
  onOpenMasterPanel,
}) => {
  const { balance, isBalanceHidden, creditCard } = state;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* PWA Install Banner */}
      <PWAInstallBanner variant="banner" />

      {/* 1. Saldo em Conta Card */}
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 mx-4 mt-2">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={onOpenHistoryModal}
            className="group flex items-center gap-1.5 text-neutral-800 font-semibold text-sm hover:text-[#820ad1] transition-colors"
          >
            <span>Conta</span>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 group-hover:text-[#820ad1] transition-all" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMasterPanel}
              title="Ajustar saldo e configurações"
              className="text-xs bg-[#f0f1f5] hover:bg-neutral-200 text-neutral-700 font-medium px-2 py-1 rounded-full flex items-center gap-1 transition-colors"
            >
              <Pencil className="w-3 h-3 text-neutral-500" />
              <span>Ajustar</span>
            </button>
            <span className="text-[11px] bg-purple-100 text-[#820ad1] font-semibold px-2 py-0.5 rounded-full">
              Principal
            </span>
          </div>
        </div>

        {/* Big Balance Number */}
        <div
          onClick={onOpenHistoryModal}
          className="cursor-pointer py-1 group"
          title="Clique para ver o extrato completo"
        >
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 tabular-nums">
            {formatCurrency(balance, isBalanceHidden)}
          </div>
          <p className="text-[11px] text-neutral-500 font-medium mt-1 flex items-center gap-1">
            <span>Disponível em conta corrente</span>
            <span className="text-[#820ad1] font-semibold group-hover:underline">· Ver extrato</span>
          </p>
        </div>
      </section>

      {/* 2. Carrossel Horizontal de Ações Rápidas (Bolinhas) */}
      <section className="px-4">
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 flex items-start gap-3 sm:gap-4 py-1">
          {/* Ação 1: Área Pix */}
          <button
            onClick={onOpenPixModal}
            className="flex flex-col items-center min-w-[76px] max-w-[80px] group active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 rounded-full bg-[#f0f1f5] group-hover:bg-[#e4e6eb] flex items-center justify-center text-neutral-800 transition-colors shadow-sm">
              <ArrowUpDown className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-neutral-800 text-center mt-2 leading-tight">
              Área Pix
            </span>
          </button>

          {/* Ação 2: Pagar */}
          <button
            onClick={onOpenCardModal}
            className="flex flex-col items-center min-w-[76px] max-w-[80px] group active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 rounded-full bg-[#f0f1f5] group-hover:bg-[#e4e6eb] flex items-center justify-center text-neutral-800 transition-colors shadow-sm">
              <Barcode className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-neutral-800 text-center mt-2 leading-tight">
              Pagar
            </span>
          </button>

          {/* Ação 3: Pegar emprestado */}
          <button
            onClick={onOpenLoanModal}
            className="flex flex-col items-center min-w-[76px] max-w-[80px] group active:scale-95 transition-transform relative"
          >
            <span className="absolute -top-1 right-1 bg-[#820ad1] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white shadow-xs z-10">
              Novo
            </span>
            <div className="w-16 h-16 rounded-full bg-[#f0f1f5] group-hover:bg-[#e4e6eb] flex items-center justify-center text-neutral-800 transition-colors shadow-sm">
              <Coins className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-neutral-800 text-center mt-2 leading-tight">
              Pegar emprestado
            </span>
          </button>

          {/* Ação 4: Recarga de celular */}
          <button
            onClick={() => onNavigateToTab('services')}
            className="flex flex-col items-center min-w-[76px] max-w-[80px] group active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 rounded-full bg-[#f0f1f5] group-hover:bg-[#e4e6eb] flex items-center justify-center text-neutral-800 transition-colors shadow-sm">
              <Smartphone className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-neutral-800 text-center mt-2 leading-tight">
              Recarga de celular
            </span>
          </button>

          {/* Ação 5: Caixinhas e Investir */}
          <button
            onClick={onOpenBoxesModal}
            className="flex flex-col items-center min-w-[76px] max-w-[80px] group active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 rounded-full bg-[#f0f1f5] group-hover:bg-[#e4e6eb] flex items-center justify-center text-neutral-800 transition-colors shadow-sm">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-neutral-800 text-center mt-2 leading-tight">
              Caixinhas
            </span>
          </button>
        </div>
      </section>

      {/* Meus Cartões Button */}
      <section className="px-4">
        <button
          onClick={onOpenCardModal}
          className="w-full bg-[#f0f1f5] hover:bg-[#e6e8ee] p-4 rounded-2xl flex items-center justify-between text-neutral-800 transition-colors active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-neutral-700" />
            <span className="text-sm font-semibold">Meus cartões Nu RPG</span>
          </div>
          <span className="text-xs text-neutral-500 font-medium">1 físico · 1 virtual</span>
        </button>
      </section>

      {/* 3. Cards Informativos Internos */}
      <section className="px-4 space-y-3">
        {/* Card: Dinheiro adicional - Empréstimo Pessoal pré-aprovado */}
        <div
          onClick={onOpenLoanModal}
          className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm hover:border-purple-200 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#820ad1] uppercase tracking-wide">
                  Dinheiro adicional
                </span>
                <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">
                  Pré-aprovado
                </span>
              </div>
              <h3 className="text-sm font-bold text-neutral-900 group-hover:text-[#820ad1] transition-colors">
                Empréstimo Pessoal pré-aprovado
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Crédito com taxa reduzida e carência de até 90 dias.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-[#820ad1] shrink-0 ml-3">
              <Coins className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card: Cartão de Crédito Nu RPG */}
        <div
          onClick={onOpenCardModal}
          className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm hover:border-neutral-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-neutral-800" />
              <span className="text-sm font-bold text-neutral-900">Cartão de Crédito Nu RPG</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          <p className="text-xs text-neutral-500">Fatura atual</p>
          <div className="text-xl font-extrabold text-neutral-900 tracking-tight mt-0.5 tabular-nums">
            {formatCurrency(creditCard.currentInvoice, isBalanceHidden)}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 text-xs">
            <span className="text-neutral-500 font-medium">
              Limite disponível: <strong className="text-neutral-800 font-semibold">{formatCurrency(creditCard.limit - creditCard.currentInvoice, isBalanceHidden)}</strong>
            </span>
            <span className="text-neutral-500">
              Vence em <strong className="text-neutral-800 font-bold">{creditCard.dueDate}</strong>
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenCardModal();
              }}
              className="flex-1 bg-[#820ad1] hover:bg-[#7208b8] active:scale-95 text-white text-xs font-bold py-2 px-3 rounded-full transition-all"
            >
              Pagar fatura
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenCardModal();
              }}
              className="bg-[#f0f1f5] hover:bg-[#e4e6eb] active:scale-95 text-neutral-800 text-xs font-semibold py-2 px-4 rounded-full transition-all"
            >
              Ver detalhes
            </button>
          </div>
        </div>

        {/* Card: Indique o Nu RPG */}
        <div
          onClick={() => onNavigateToTab('rewards')}
          className="bg-gradient-to-r from-purple-50 via-purple-100/50 to-white p-5 rounded-2xl border border-purple-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-purple-200 transition-all"
        >
          <div className="space-y-1 pr-3">
            <div className="flex items-center gap-1.5 text-[#820ad1] font-bold text-xs">
              <Users className="w-4 h-4" />
              <span>Indique seus amigos</span>
            </div>
            <h4 className="text-xs font-bold text-neutral-900 leading-snug">
              Chame seus amigos para o Nu RPG e compartilhe convites
            </h4>
            <p className="text-[11px] text-neutral-500">
              Conheça as vantagens e benefícios do programa Nucoin.
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#820ad1] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            🎁
          </div>
        </div>
      </section>
    </div>
  );
};
