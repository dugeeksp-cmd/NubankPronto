import React, { useState } from 'react';
import { Eye, EyeOff, HelpCircle, Settings, FileCheck, ShieldCheck, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  playerName: string;
  playerTitle: string;
  isBalanceHidden: boolean;
  onToggleHideBalance: () => void;
  onOpenMasterPanel: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  playerName,
  playerTitle,
  isBalanceHidden,
  onToggleHideBalance,
  onOpenMasterPanel,
  onOpenHelp,
}) => {
  const [activePromoIndex, setActivePromoIndex] = useState(0);

  // Initials for avatar
  const initials = playerName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const promoCards = [
    {
      id: 'promo-1',
      tag: 'COMPROVANTE DE RENDIMENTOS',
      title: 'Seu informe de rendimentos 2026 já está disponível no app.',
      subtitle: 'Acesse para a declaração de Imposto de Renda sem complicações.',
      icon: FileCheck,
      color: 'bg-[#7309b8]',
    },
    {
      id: 'promo-2',
      tag: 'SEGURO VIDA NU RPG',
      title: 'Proteção completa para você e sua família.',
      subtitle: 'Contratação digital a partir de R$ 9/mês sem carência para acidentes.',
      icon: ShieldCheck,
      color: 'bg-[#62079c]',
    },
    {
      id: 'promo-3',
      tag: 'MODO RUA',
      title: 'Sua conta protegida quando você estiver fora de casa.',
      subtitle: 'Defina limites de transação seguros para o seu dia a dia.',
      icon: ShieldAlert,
      color: 'bg-[#530585]',
    },
  ];

  return (
    <header className="bg-[#820ad1] text-white pt-6 pb-6 px-5 transition-all duration-200 select-none">
      {/* Top action row */}
      <div className="flex items-center justify-between">
        {/* User profile avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMasterPanel}
            title="Configurações da Conta"
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all flex items-center justify-center font-bold text-base tracking-wider border border-white/25 shadow-inner"
          >
            {initials || 'NU'}
          </button>
          <div className="flex flex-col">
            <span className="text-xs text-purple-200 font-medium">Conta Nu RPG</span>
            <span className="text-xs text-white/90 font-semibold truncate max-w-[130px]">
              {playerTitle || 'Agência 0001'}
            </span>
          </div>
        </div>

        {/* Top utility buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Hide/Show balance toggle */}
          <button
            onClick={onToggleHideBalance}
            className="w-10 h-10 rounded-full hover:bg-white/15 active:bg-white/25 active:scale-90 transition-all flex items-center justify-center text-white"
            title={isBalanceHidden ? 'Exibir saldo' : 'Ocultar saldo'}
            aria-label={isBalanceHidden ? 'Exibir saldo' : 'Ocultar saldo'}
          >
            {isBalanceHidden ? <EyeOff className="w-5 h-5 text-white/90" /> : <Eye className="w-5 h-5 text-white/90" />}
          </button>

          {/* Help & Support */}
          <button
            onClick={onOpenHelp}
            className="w-10 h-10 rounded-full hover:bg-white/15 active:bg-white/25 active:scale-90 transition-all flex items-center justify-center text-white"
            title="Me Ajuda · Dúvidas e Suporte"
            aria-label="Me Ajuda"
          >
            <HelpCircle className="w-5 h-5 text-white/90" />
          </button>

          {/* Account Settings */}
          <button
            onClick={onOpenMasterPanel}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-90 transition-all flex items-center justify-center text-white relative shadow-sm"
            title="Configurações da Conta"
            aria-label="Configurações da Conta"
          >
            <Settings className="w-5 h-5 text-amber-300" />
          </button>
        </div>
      </div>

      {/* Greeting row */}
      <div className="mt-6">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Olá, <span className="font-extrabold">{playerName}</span>
        </h1>
        <p className="text-xs text-purple-200 mt-0.5 truncate">
          {playerTitle}
        </p>
      </div>

      {/* Informative notification carousel */}
      <div className="mt-5 -mx-5 px-5 overflow-x-auto no-scrollbar flex gap-3 snap-x">
        {promoCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => setActivePromoIndex(idx)}
              className={`snap-start shrink-0 w-[285px] ${card.color} border border-white/10 rounded-2xl p-4 text-white shadow-sm hover:border-white/20 transition-all cursor-pointer`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 rounded-md bg-white/15 text-white">
                  <Icon className="w-3.5 h-3.5 text-amber-300" />
                </span>
                <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider">
                  {card.tag}
                </span>
              </div>
              <p className="text-xs font-bold leading-snug line-clamp-2">
                {card.title}
              </p>
              <p className="text-[11px] text-white/75 mt-1 leading-tight line-clamp-1">
                {card.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </header>
  );
};
