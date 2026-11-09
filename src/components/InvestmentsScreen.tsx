import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Plus,
  ChevronRight,
  BarChart3,
  Clock,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { BankState } from '../types/bank';
import { formatCurrency } from '../utils/formatters';

interface InvestmentsScreenProps {
  state: BankState;
  onOpenBoxesModal: () => void;
  onOpenHistoryModal: () => void;
  onInvestMore: (boxId: string, amount: number) => void;
}

export const InvestmentsScreen: React.FC<InvestmentsScreenProps> = ({
  state,
  onOpenBoxesModal,
  onOpenHistoryModal,
}) => {
  const { investments, isBalanceHidden } = state;
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reportPills = [
    { id: 'analises', label: 'Análises', icon: BarChart3 },
    { id: 'historico', label: 'Histórico', icon: Clock },
    { id: 'otimizar', label: 'Otimizar', icon: SlidersHorizontal },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
  ];

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* 1. Header Roxo Compacto com saldo investido */}
      <section className="bg-[#820ad1] text-white p-5 rounded-b-3xl -mt-2 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-purple-200 font-medium">Total investido em Caixinhas & CDB</span>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5 tabular-nums">
              {formatCurrency(investments.total, isBalanceHidden)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Rendimento a +112% do CDI (+{formatCurrency(investments.yield12m, isBalanceHidden)} no período)</span>
            </div>
          </div>

          <button
            onClick={onOpenBoxesModal}
            className="bg-white text-[#820ad1] hover:bg-purple-50 active:scale-95 font-bold text-xs py-2 px-4 rounded-full transition-all shadow-sm flex items-center gap-1 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Investir</span>
          </button>
        </div>
      </section>

      {/* 2. Banner de Alerta Claro */}
      <section className="px-4">
        <div className="bg-purple-50 border border-purple-200/80 rounded-2xl p-3.5 flex items-start gap-3 shadow-2xs">
          <Clock className="w-5 h-5 text-[#820ad1] shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-purple-950 leading-snug">
              Aplicação em processamento
            </h4>
            <p className="text-[11px] text-purple-900 mt-0.5 leading-normal">
              Sua aplicação em Tesouro Direto está em processamento e será liquidada em até 1 dia útil.
            </p>
          </div>
          <button
            onClick={onOpenHistoryModal}
            className="text-xs font-bold text-[#820ad1] hover:text-purple-950 underline shrink-0 mt-0.5"
          >
            Acompanhar
          </button>
        </div>
      </section>

      {/* 5. Carrossel de relatórios em bolinhas */}
      <section className="px-4">
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 flex items-center gap-2 py-1">
          {reportPills.map((pill) => {
            const Icon = pill.icon;
            const isSelected = selectedReport === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setSelectedReport(isSelected ? null : pill.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#820ad1] text-white shadow-sm'
                    : 'bg-[#f0f1f5] hover:bg-neutral-200 text-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Seção Caixinhas */}
      <section className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-neutral-900">
              Caixinhas
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Rendimento diário
            </span>
          </div>
          <button
            onClick={onOpenBoxesModal}
            className="text-xs font-bold text-[#820ad1] hover:underline flex items-center gap-1"
          >
            <span>+ Criar caixinha</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {investments.boxes.map((box) => (
            <div
              key={box.id}
              onClick={onOpenBoxesModal}
              className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm hover:border-purple-200 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 rounded-xl bg-purple-50 group-hover:scale-105 transition-transform">
                  {box.emoji}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 group-hover:text-[#820ad1] transition-colors">
                    {box.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-extrabold text-neutral-800 tabular-nums">
                      {formatCurrency(box.amount, isBalanceHidden)}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600">
                      Rende {box.yieldRate}
                    </span>
                  </div>
                  {/* Progress bar to target */}
                  <div className="w-36 bg-neutral-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-[#820ad1] h-full rounded-full"
                      style={{ width: `${Math.min(100, Math.round((box.amount / box.target) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 group-hover:text-[#820ad1] transition-all" />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Seção Minha Carteira & Mini Dashboard */}
      <section className="px-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Minha Carteira</h3>
              <p className="text-xs text-neutral-500">Distribuição por objetivo financeiro</p>
            </div>
            <span className="text-xs font-extrabold text-neutral-800 tabular-nums">
              {formatCurrency(investments.total, isBalanceHidden)}
            </span>
          </div>

          {/* Visual Bar Distribution */}
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-neutral-100">
            <div className="bg-[#820ad1] h-full" style={{ width: '27%' }} title="Reserva de Emergência: 27%" />
            <div className="bg-emerald-500 h-full" style={{ width: '19%' }} title="Reserva para Viagem: 19%" />
            <div className="bg-amber-500 h-full" style={{ width: '54%' }} title="Plano de Aposentadoria: 54%" />
          </div>

          {/* Visual Legend */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-neutral-100 text-[11px]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#820ad1]" />
                <span className="text-neutral-500 font-medium">Emergência</span>
              </div>
              <p className="font-bold text-neutral-900">27%</p>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-neutral-500 font-medium">Viagem</span>
              </div>
              <p className="font-bold text-neutral-900">19%</p>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-neutral-500 font-medium">Aposentadoria</span>
              </div>
              <p className="font-bold text-neutral-900">54%</p>
            </div>
          </div>

          {/* Monthly Yield Chart */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-neutral-600 block mb-2 uppercase tracking-wide">
              Evolução dos Rendimentos (Últimos 5 meses)
            </span>
            <div className="h-20 flex items-end justify-between gap-2 px-1">
              {[
                { month: 'Jun', value: 35, display: 'R$ 3,80' },
                { month: 'Jul', value: 48, display: 'R$ 5,20' },
                { month: 'Ago', value: 65, display: 'R$ 7,10' },
                { month: 'Set', value: 82, display: 'R$ 9,00' },
                { month: 'Out', value: 100, display: 'R$ 11,40' },
              ].map((item, idx) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <div
                    className={`w-full max-w-[28px] rounded-t-md transition-all ${
                      idx === 4 ? 'bg-[#820ad1]' : 'bg-purple-200 group-hover:bg-purple-300'
                    }`}
                    style={{ height: `${item.value}%` }}
                    title={`${item.month}: ${item.display}`}
                  />
                  <span className="text-[10px] font-medium text-neutral-500">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
