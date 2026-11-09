import React from 'react';
import { ArrowUpDown, DollarSign, Gift, Smartphone } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'investments' | 'rewards' | 'services';
  onTabChange: (tab: 'home' | 'investments' | 'rewards' | 'services') => void;
  pendingRewardsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  pendingRewardsCount = 0,
}) => {
  const tabs = [
    {
      id: 'home' as const,
      label: 'Início',
      sublabel: 'Conta & Pix',
      icon: ArrowUpDown,
    },
    {
      id: 'investments' as const,
      label: 'Investir',
      sublabel: 'Caixinhas',
      icon: DollarSign,
    },
    {
      id: 'rewards' as const,
      label: 'Benefícios',
      sublabel: 'Nucoin',
      icon: Gift,
      badge: pendingRewardsCount > 0 ? pendingRewardsCount : undefined,
    },
    {
      id: 'services' as const,
      label: 'Serviços',
      sublabel: 'Recarga & Seguros',
      icon: Smartphone,
    },
  ];

  return (
    <div className="sticky bottom-4 left-0 right-0 px-6 z-30 pointer-events-none flex justify-center">
      <nav
        aria-label="Navegação principal"
        className="pointer-events-auto bg-white/92 backdrop-blur-md rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.18)] border border-neutral-200/80 px-3 py-2 flex items-center gap-1 sm:gap-2 transition-all duration-200"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[62px] sm:min-w-[70px] py-1.5 px-2 rounded-full transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-[#820ad1] font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70 font-medium'
              }`}
              title={`${tab.label} (${tab.sublabel})`}
            >
              {/* Active pill background */}
              {isActive && (
                <span className="absolute inset-0 bg-purple-50 rounded-full -z-10 animate-in fade-in duration-200" />
              )}

              {/* Icon container */}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 bg-[#820ad1] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse-subtle">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Tab label */}
              <span className="text-[10px] mt-1 leading-none tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
