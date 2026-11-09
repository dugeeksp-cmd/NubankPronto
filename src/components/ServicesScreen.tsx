import React, { useState } from 'react';
import {
  Smartphone,
  ShieldCheck,
  ChevronRight,
  Zap,
  CheckCircle2,
  ShoppingBag,
} from 'lucide-react';
import { BankState } from '../types/bank';
import { formatCurrency } from '../utils/formatters';

interface ServicesScreenProps {
  state: BankState;
  onOpenLoanModal: () => void;
  onBuyItem: (name: string, price: number, description: string) => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({
  state,
  onOpenLoanModal,
  onBuyItem,
}) => {
  const { balance, isBalanceHidden } = state;
  const [selectedCarrier, setSelectedCarrier] = useState('Vivo');
  const [rechargeAmount, setRechargeAmount] = useState(30);
  const [rechargeStatus, setRechargeStatus] = useState<string | null>(null);

  const shopItems = [
    {
      id: 'item-1',
      name: 'Recarga de Cartão de Transporte',
      category: 'Mobilidade',
      price: 44.00,
      description: 'Créditos para Bilhete Único e transporte público metropolitano.',
      emoji: '🚌',
    },
    {
      id: 'item-2',
      name: 'Gift Cards (Spotify / Uber)',
      category: 'Entretenimento',
      price: 50.00,
      description: 'Voucher digital com ativação imediata e 5% de cashback.',
      emoji: '🎵',
    },
    {
      id: 'item-3',
      name: 'Tag de Pedágio Nu RPG',
      category: 'Mobilidade',
      price: 20.00,
      description: 'Passe direto em praças de pedágios e estacionamentos sem mensalidade.',
      emoji: '🚗',
    },
    {
      id: 'item-4',
      name: 'Farmácia & Cuidados Pessoais',
      category: 'Saúde',
      price: 65.00,
      description: 'Convênio com redes de farmácias com 10% de cashback direto na conta.',
      emoji: '💊',
    },
  ];

  const handleRecharge = () => {
    if (balance < rechargeAmount) {
      setRechargeStatus('Saldo insuficiente para a recarga!');
      return;
    }
    onBuyItem(
      `Recarga de Celular · ${selectedCarrier}`,
      rechargeAmount,
      `Recarga de celular pré-pago no valor de ${formatCurrency(rechargeAmount)}`
    );
    setRechargeStatus(`Recarga de ${formatCurrency(rechargeAmount)} realizada com sucesso na operadora ${selectedCarrier}!`);
    setTimeout(() => setRechargeStatus(null), 4000);
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Header Serviços */}
      <section className="bg-[#820ad1] text-white p-5 rounded-b-3xl -mt-2 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-purple-200 font-medium">Serviços & Conveniência</span>
            <h2 className="text-xl font-extrabold tracking-tight mt-0.5">
              NuShopping & Serviços
            </h2>
            <p className="text-xs text-purple-200 mt-0.5">
              Recargas de celular, seguros, Tag de pedágio e gift cards
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-xl">
            📱
          </div>
        </div>
      </section>

      {/* 1. Recarga de Celular */}
      <section className="px-4">
        <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#820ad1]" />
            <h3 className="text-xs font-bold text-neutral-900">
              Recarga de Celular
            </h3>
          </div>
          <p className="text-[11px] text-neutral-500">
            Adicione créditos para seu número pré-pago ou controle instantaneamente sem taxas.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {['Claro', 'Vivo', 'TIM'].map((carrier) => (
              <button
                key={carrier}
                onClick={() => setSelectedCarrier(carrier)}
                className={`text-xs py-2 px-2 rounded-xl border text-center font-semibold transition-all ${
                  selectedCarrier === carrier
                    ? 'border-[#820ad1] bg-purple-50 text-[#820ad1] ring-1 ring-[#820ad1]'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {carrier}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {[20, 30, 50, 100].map((amt) => (
              <button
                key={amt}
                onClick={() => setRechargeAmount(amt)}
                className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  rechargeAmount === amt
                    ? 'border-[#820ad1] bg-[#820ad1] text-white shadow-xs'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-purple-300'
                }`}
              >
                R$ {amt}
              </button>
            ))}
          </div>

          <button
            onClick={handleRecharge}
            className="w-full bg-[#820ad1] hover:bg-[#7208b8] active:scale-98 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <Zap className="w-4 h-4" />
            <span>Confirmar Recarga de R$ {rechargeAmount},00 ({selectedCarrier})</span>
          </button>

          {rechargeStatus && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{rechargeStatus}</span>
            </div>
          )}
        </div>
      </section>

      {/* 2. Seguro de Vida Nu RPG */}
      <section className="px-4">
        <div className="bg-gradient-to-r from-purple-900 to-[#820ad1] text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1 pr-3">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
              Seguro de Vida Nu RPG
            </span>
            <h4 className="text-xs font-bold leading-snug">
              Proteção para acidentes e emergências
            </h4>
            <p className="text-[11px] text-purple-200">
              A partir de R$ 9,00/mês com assistência 24h completa e contratação 100% digital.
            </p>
          </div>
          <button
            onClick={() => alert('Simulação do Seguro de Vida Nu RPG realizada com sucesso!')}
            className="bg-white text-[#820ad1] hover:bg-purple-50 active:scale-95 text-xs font-bold py-2 px-3 rounded-xl transition-all shadow-sm shrink-0"
          >
            Simular
          </button>
        </div>
      </section>

      {/* 3. NuShopping */}
      <section className="px-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#820ad1]" />
            <h3 className="text-sm font-bold text-neutral-900">
              Serviços & Conveniência
            </h3>
          </div>
          <span className="text-xs text-neutral-500 font-medium">Débito em conta</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {shopItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3.5 rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between hover:border-purple-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 rounded-xl bg-purple-50">{item.emoji}</span>
                <div>
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wide">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 leading-tight mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                  <span className="text-xs font-extrabold text-neutral-900 mt-1 block tabular-nums">
                    {formatCurrency(item.price, isBalanceHidden)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onBuyItem(item.name, item.price, item.description)}
                className="bg-[#f0f1f5] hover:bg-[#820ad1] hover:text-white active:scale-95 text-neutral-800 text-xs font-bold py-1.5 px-3 rounded-full transition-all shrink-0 ml-2 shadow-2xs"
              >
                Contratar
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
