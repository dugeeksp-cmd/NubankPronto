import React, { useState } from 'react';
import {
  X,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Sparkles,
  Shield,
  FileText,
} from 'lucide-react';
import { Transaction } from '../../types/bank';
import { formatCurrency } from '../../utils/formatters';

interface HistoryModalProps {
  transactions: Transaction[];
  isBalanceHidden: boolean;
  onClose: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  transactions,
  isBalanceHidden,
  onClose,
  onSelectTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pix' | 'card' | 'quest' | 'box'>('all');

  const filterOptions = [
    { id: 'all' as const, label: 'Tudo' },
    { id: 'pix' as const, label: 'Pix' },
    { id: 'card' as const, label: 'Cartão' },
    { id: 'quest' as const, label: 'Entradas & Salário' },
    { id: 'box' as const, label: 'Caixinhas' },
  ];

  const filteredTransactions = transactions.filter((tx) => {
    // Search match
    const matchSearch =
      tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.recipientOrPayer && tx.recipientOrPayer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.note && tx.note.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchSearch) return false;

    // Category filter
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'pix') return tx.category === 'pix';
    if (selectedFilter === 'card') return tx.category === 'card';
    if (selectedFilter === 'quest') return tx.category === 'transfer' || tx.category === 'admin';
    if (selectedFilter === 'box') return tx.category === 'box';

    return true;
  });

  // Group by date text prefix
  const groupedTransactions: Record<string, Transaction[]> = {};
  filteredTransactions.forEach((tx) => {
    const dateGroup = tx.date.split(',')[0].trim();
    if (!groupedTransactions[dateGroup]) {
      groupedTransactions[dateGroup] = [];
    }
    groupedTransactions[dateGroup].push(tx);
  });

  const getTxIcon = (category: Transaction['category'], isPositive: boolean) => {
    switch (category) {
      case 'pix':
        return isPositive ? (
          <ArrowDownLeft className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
        ) : (
          <ArrowUpRight className="w-4 h-4 text-neutral-700 stroke-[2.5]" />
        );
      case 'card':
        return <CreditCard className="w-4 h-4 text-neutral-700" />;
      case 'transfer':
      case 'admin':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'box':
        return <Shield className="w-4 h-4 text-[#820ad1]" />;
      default:
        return <FileText className="w-4 h-4 text-neutral-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-[#820ad1] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
              nu
            </div>
            <div>
              <h3 className="text-base font-bold">Extrato da Conta · Nu RPG</h3>
              <p className="text-[11px] text-purple-200">
                {transactions.length} movimentações registradas
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

        {/* Search Bar & Filters */}
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por estabelecimento, nome, valor..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 focus:border-[#820ad1] rounded-full text-xs text-neutral-900 outline-none transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedFilter(opt.id)}
                className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap transition-all active:scale-95 ${
                  selectedFilter === opt.id
                    ? 'bg-[#820ad1] text-white shadow-xs'
                    : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {Object.keys(groupedTransactions).length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <p className="text-xs font-medium">Nenhuma movimentação encontrada com esses filtros.</p>
            </div>
          ) : (
            Object.entries(groupedTransactions).map(([dateLabel, groupItems]) => (
              <div key={dateLabel} className="space-y-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block px-1">
                  {dateLabel}
                </span>

                <div className="space-y-1.5">
                  {groupItems.map((tx) => {
                    const isPositive = tx.amount > 0;
                    return (
                      <div
                        key={tx.id}
                        onClick={() => onSelectTransaction(tx)}
                        className="bg-white p-3 rounded-2xl border border-neutral-100 hover:border-purple-200 hover:bg-purple-50/20 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-neutral-100 group-hover:bg-purple-100 flex items-center justify-center shrink-0 transition-colors">
                            {getTxIcon(tx.category, isPositive)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-neutral-900 group-hover:text-[#820ad1] transition-colors leading-tight">
                              {tx.title}
                            </h4>
                            <p className="text-[11px] text-neutral-500 leading-tight mt-0.5 line-clamp-1">
                              {tx.subtitle}
                            </p>
                            <span className="text-[10px] text-neutral-400 mt-0.5 block">
                              {tx.date}
                            </span>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right shrink-0 ml-3">
                          <div
                            className={`text-xs font-extrabold tabular-nums ${
                              isPositive ? 'text-emerald-600' : 'text-neutral-900'
                            }`}
                          >
                            {isPositive
                              ? `+ ${formatCurrency(tx.amount, isBalanceHidden)}`
                              : formatCurrency(Math.abs(tx.amount), isBalanceHidden)}
                          </div>
                          <span className="text-[10px] text-neutral-400 group-hover:text-[#820ad1] transition-colors">
                            Ver comprovante ›
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
