import { BankState } from '../types/bank';

/**
 * Generates a complete, single-file HTML application using HTML5, Tailwind CSS via CDN and Vanilla JavaScript
 * configured as an authentic, 100% realistic Nu RPG digital banking Progressive Web App (PWA).
 */
export function generateStandaloneHTML(state: BankState): string {
  const jsonState = JSON.stringify(state, null, 2);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Nu RPG · Conta Digital, Cartão e Investimentos</title>
  
  <!-- 1. PWA Meta Tags (Mobile, Android & iOS Safari) -->
  <meta name="theme-color" content="#820ad1">
  <meta name="msapplication-navbutton-color" content="#820ad1">
  <meta name="msapplication-TileColor" content="#820ad1">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="application-name" content="Nu RPG">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Nu RPG">
  <link rel="apple-touch-icon" href="icon.png">

  <!-- 2. PWA Web App Manifest Inline via Data URI (RFC 2397) -->
  <link rel="manifest" href="data:application/manifest+json,%7B%22id%22%3A%22.%2F%22%2C%22name%22%3A%22Nu%20RPG%22%2C%22short_name%22%3A%22Nu%20RPG%22%2C%22start_url%22%3A%22.%2F%22%2C%22scope%22%3A%22.%2F%22%2C%22display%22%3A%22standalone%22%2C%22orientation%22%3A%22portrait%22%2C%22background_color%22%3A%22%23820ad1%22%2C%22theme_color%22%3A%22%23820ad1%22%2C%22icons%22%3A%5B%7B%22src%22%3A%22icon.png%22%2C%22sizes%22%3A%22192x192%22%2C%22type%22%3A%22image%2Fpng%22%2C%22purpose%22%3A%22any%22%7D%2C%7B%22src%22%3A%22icon.png%22%2C%22sizes%22%3A%22512x512%22%2C%22type%22%3A%22image%2Fpng%22%2C%22purpose%22%3A%22any%20maskable%22%7D%5D%7D">

  <!-- Tailwind CSS & Tipografia Oficial -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <style>
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-tap-highlight-color: transparent;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="bg-neutral-950 min-h-screen flex items-center justify-center p-0 sm:p-4 text-neutral-900">
  
  <!-- Mobile Emulator Frame -->
  <div class="w-full max-w-md h-[100dvh] sm:h-[844px] bg-[#f5f5f7] sm:rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative border-0 sm:border-[8px] sm:border-neutral-800">
    
    <!-- Mobile Status Bar -->
    <div class="bg-[#820ad1] text-white px-6 pt-3 pb-1 flex items-center justify-between text-xs font-bold shrink-0 select-none">
      <span id="statusBarTime">09:41</span>
      <div class="flex items-center gap-2">
        <span class="text-[10px] text-purple-200">5G NU RPG</span>
        <span class="text-[10px] text-purple-200">98% 🔋</span>
      </div>
    </div>

    <!-- PWA Install Banner Container -->
    <div id="pwaBannerContainer"></div>

    <!-- Scrollable Content -->
    <div id="appContainer" class="flex-1 overflow-y-auto no-scrollbar relative flex flex-col pb-24"></div>

    <!-- Floating Curved Bottom Dock -->
    <div class="absolute bottom-4 left-0 right-0 px-6 z-30 pointer-events-none flex justify-center">
      <nav class="pointer-events-auto bg-white/95 backdrop-blur-md rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.18)] border border-neutral-200/80 px-4 py-2 flex items-center gap-2">
        <button onclick="setTab('home')" id="nav-home" class="nav-btn py-1 px-3 rounded-full text-xs font-bold text-[#820ad1] bg-purple-50 flex flex-col items-center">
          <span class="text-base">↕</span>
          <span class="text-[10px]">Início</span>
        </button>
        <button onclick="setTab('investments')" id="nav-investments" class="nav-btn py-1 px-3 rounded-full text-xs font-medium text-neutral-500 flex flex-col items-center">
          <span class="text-base">$</span>
          <span class="text-[10px]">Investir</span>
        </button>
        <button onclick="setTab('rewards')" id="nav-rewards" class="nav-btn py-1 px-3 rounded-full text-xs font-medium text-neutral-500 flex flex-col items-center">
          <span class="text-base">🎁</span>
          <span class="text-[10px]">Benefícios</span>
        </button>
        <button onclick="setTab('services')" id="nav-services" class="nav-btn py-1 px-3 rounded-full text-xs font-medium text-neutral-500 flex flex-col items-center">
          <span class="text-base">📱</span>
          <span class="text-[10px]">Serviços</span>
        </button>
      </nav>
    </div>

    <!-- Modal Overlay -->
    <div id="modalOverlay" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div id="modalContent" class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"></div>
    </div>

  </div>

  <script>
    const STORAGE_KEY = 'rpg_banco_nubank_v3_clean';
    const DEFAULT_STATE = ${jsonState};
    let state = DEFAULT_STATE;
    let deferredInstallPrompt = null;
    let isPwaInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    let isPixLimitExceeded = true;

    // Purga forçada de chaves legadas
    try {
      localStorage.removeItem('rpg_banco_nubank');
      localStorage.removeItem('rpg_banco_nubank_v1');
      localStorage.removeItem('rpg_banco_nubank_v2');

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        state = JSON.parse(saved);
        if (!state.transactions || state.transactions.length < 6 || !state.transactions.some(t => t.title === 'Das-Simples Nacional')) {
          state.transactions = DEFAULT_STATE.transactions;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
      }
    } catch(e) {
      state = DEFAULT_STATE;
    }

    function saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch(e) {}
      renderApp();
    }

    function formatBRL(val) {
      if (state.isBalanceHidden) return 'R$ •••••';
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    }

    function toggleHideBalance() {
      state.isBalanceHidden = !state.isBalanceHidden;
      saveState();
    }

    let activeTab = 'home';
    function setTab(tab) {
      activeTab = tab;
      document.querySelectorAll('.nav-btn').forEach(b => {
        b.className = 'nav-btn py-1 px-3 rounded-full text-xs font-medium text-neutral-500 flex flex-col items-center';
      });
      const activeBtn = document.getElementById('nav-' + tab);
      if (activeBtn) activeBtn.className = 'nav-btn py-1 px-3 rounded-full text-xs font-bold text-[#820ad1] bg-purple-50 flex flex-col items-center';
      renderApp();
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      renderPWABanner();
    });

    window.addEventListener('appinstalled', () => {
      isPwaInstalled = true;
      deferredInstallPrompt = null;
      renderPWABanner();
    });

    function triggerPWAInstall() {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then((res) => {
          if (res.outcome === 'accepted') {
            isPwaInstalled = true;
            deferredInstallPrompt = null;
          }
          renderPWABanner();
        });
      } else {
        alert('Para instalar o Nu RPG no iPhone/Safari:\\n1. Toque no ícone Compartilhar (quadrado com seta).\\n2. Toque em "Adicionar à Tela de Início".');
      }
    }

    function renderPWABanner() {
      const banner = document.getElementById('pwaBannerContainer');
      if (!banner) return;
      if (isPwaInstalled) {
        banner.innerHTML = '';
        return;
      }
      banner.innerHTML = \`
        <div class="mx-4 mt-2 bg-gradient-to-r from-purple-900 to-[#820ad1] text-white p-3 rounded-2xl flex items-center justify-between border border-purple-400/30 shadow-xs">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-white/20 font-black text-xs flex items-center justify-center">nu</span>
            <div>
              <p class="text-xs font-bold">Instalar o app Nu RPG</p>
              <span class="text-[10px] text-purple-200">Acesso rápido com segurança em tela cheia</span>
            </div>
          </div>
          <button onclick="triggerPWAInstall()" class="bg-white text-[#820ad1] hover:bg-purple-50 font-extrabold text-[11px] py-1 px-2.5 rounded-full transition-all shadow-xs">
            Instalar
          </button>
        </div>
      \`;
    }

    function renderApp() {
      renderPWABanner();
      const container = document.getElementById('appContainer');
      let html = '';

      const initials = state.playerName.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() || 'NU';
      html += \`
        <header class="bg-[#820ad1] text-white pt-5 pb-5 px-5 select-none space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <button onclick="openMasterModal()" class="w-11 h-11 rounded-full bg-white/20 font-bold text-sm flex items-center justify-center border border-white/20">
                \${initials}
              </button>
              <div>
                <span class="text-[11px] text-purple-200 font-medium">Conta Nu RPG</span>
                <p class="text-xs font-semibold text-white truncate max-w-[150px]">\${state.playerName}</p>
              </div>
            </div>
            <div class="flex items-center gap-1.5">
              <button onclick="toggleHideBalance()" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm" title="Ocultar/Exibir Saldo">
                \${state.isBalanceHidden ? '🙈' : '👁️'}
              </button>
              <button onclick="triggerPWAInstall()" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm" title="Instalar Aplicativo">
                📲
              </button>
              <button onclick="openMasterModal()" class="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-sm text-amber-300" title="Configurações da Conta">
                ⚙️
              </button>
            </div>
          </div>

          <!-- Cards superiores informativos -->
          <div class="overflow-x-auto no-scrollbar -mx-5 px-5 flex gap-2.5 pt-1">
            <div class="bg-white/15 border border-white/20 rounded-2xl p-3 min-w-[240px] max-w-[260px] flex items-start gap-2.5 shrink-0">
              <span class="text-base">📄</span>
              <div>
                <p class="text-[11px] font-extrabold uppercase tracking-wide text-purple-100">COMPROVANTE DE RENDIMENTOS</p>
                <p class="text-[11px] text-white/90 leading-tight mt-0.5">Seu informe de rendimentos 2026 já está disponível no app.</p>
              </div>
            </div>
            <div class="bg-white/15 border border-white/20 rounded-2xl p-3 min-w-[240px] max-w-[260px] flex items-start gap-2.5 shrink-0">
              <span class="text-base">🛡️</span>
              <div>
                <p class="text-[11px] font-extrabold uppercase tracking-wide text-purple-100">SEGURO VIDA NU RPG</p>
                <p class="text-[11px] text-white/90 leading-tight mt-0.5">Proteção completa para você e sua família.</p>
              </div>
            </div>
            <div class="bg-white/15 border border-white/20 rounded-2xl p-3 min-w-[220px] max-w-[240px] flex items-start gap-2.5 shrink-0">
              <span class="text-base">📍</span>
              <div>
                <p class="text-[11px] font-extrabold uppercase tracking-wide text-purple-100">MODO RUA</p>
                <p class="text-[11px] text-white/90 leading-tight mt-0.5">Ative a proteção inteligente fora de casa.</p>
              </div>
            </div>
          </div>

          <div>
            <h1 class="text-xl font-bold">Olá, \${state.playerName}</h1>
            <p class="text-xs text-purple-200">\${state.playerTitle}</p>
          </div>
        </header>
      \`;

      if (activeTab === 'home') {
        html += \`
          <div class="p-4 space-y-4">
            <!-- Saldo da Conta -->
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-semibold text-neutral-800">Conta ›</span>
                <span class="text-[11px] bg-purple-100 text-[#820ad1] font-semibold px-2 py-0.5 rounded-full">Principal</span>
              </div>
              <div class="text-3xl font-extrabold text-neutral-900 mt-1 tabular-nums">\${formatBRL(state.balance)}</div>
              <p class="text-xs text-neutral-500 mt-1">Disponível em conta corrente</p>
            </div>

            <!-- Botões de Ação Rápida -->
            <div class="overflow-x-auto no-scrollbar flex gap-3 py-1">
              <button onclick="openPixModal()" class="flex flex-col items-center min-w-[76px]">
                <div class="w-16 h-16 rounded-full bg-[#f0f1f5] flex items-center justify-center text-xl font-bold">↕</div>
                <span class="text-xs font-semibold text-center mt-2 leading-tight">Área Pix</span>
              </button>
              <button onclick="openCardModal()" class="flex flex-col items-center min-w-[76px]">
                <div class="w-16 h-16 rounded-full bg-[#f0f1f5] flex items-center justify-center text-xl">💳</div>
                <span class="text-xs font-semibold text-center mt-2 leading-tight">Pagar</span>
              </button>
              <button onclick="openLoanModal()" class="flex flex-col items-center min-w-[76px] relative">
                <span class="absolute -top-1 right-1 bg-[#820ad1] text-white text-[9px] font-bold px-1.5 rounded-full">Novo</span>
                <div class="w-16 h-16 rounded-full bg-[#f0f1f5] flex items-center justify-center text-xl">🪙</div>
                <span class="text-xs font-semibold text-center mt-2 leading-tight">Empréstimo</span>
              </button>
              <button onclick="setTab('investments')" class="flex flex-col items-center min-w-[76px]">
                <div class="w-16 h-16 rounded-full bg-[#f0f1f5] flex items-center justify-center text-xl">🛡️</div>
                <span class="text-xs font-semibold text-center mt-2 leading-tight">Caixinhas</span>
              </button>
            </div>

            <!-- Dinheiro Adicional (Empréstimo Pessoal) -->
            <div class="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between cursor-pointer" onclick="openLoanModal()">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-purple-50 text-[#820ad1] flex items-center justify-center font-bold text-lg">
                  🪙
                </div>
                <div>
                  <h4 class="text-xs font-bold text-neutral-900">Empréstimo Pessoal pré-aprovado</h4>
                  <p class="text-[11px] text-neutral-500 mt-0.5">Crédito com taxa reduzida e carência de até 90 dias.</p>
                </div>
              </div>
              <span class="text-neutral-400 text-sm">›</span>
            </div>

            <!-- Cartão de Crédito -->
            <div class="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm cursor-pointer" onclick="openCardModal()">
              <div class="flex justify-between items-center">
                <span class="text-sm font-bold text-neutral-900">Cartão de Crédito ›</span>
                <span class="text-xs text-neutral-400">Platinum</span>
              </div>
              <p class="text-xs text-neutral-500 mt-1">Fatura atual</p>
              <div class="text-2xl font-black text-neutral-900 mt-0.5">\${formatBRL(state.creditCard.currentInvoice)}</div>
              <div class="flex justify-between text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-100">
                <span>Limite disponível: \${formatBRL(state.creditCard.limit - state.creditCard.currentInvoice)}</span>
                <span>Vence em \${state.creditCard.dueDate}</span>
              </div>
            </div>

            <!-- Extrato de Transações (Clique para ver comprovante, duplicar ou excluir) -->
            <div class="bg-white p-4 rounded-2xl border border-neutral-100 space-y-2">
              <div class="flex justify-between items-center mb-1">
                <div>
                  <span class="text-xs font-bold text-neutral-900">Histórico de Transações</span>
                  <p class="text-[10px] text-neutral-400">Toque em qualquer item para ver o comprovante</p>
                </div>
                <span class="text-[11px] text-[#820ad1] font-semibold">Extrato oficial</span>
              </div>
              \${state.transactions.map(tx => \`
                <div onclick="openReceiptModal('\${tx.id}')" class="flex justify-between items-center py-2.5 border-b border-neutral-50 text-xs cursor-pointer hover:bg-neutral-50/80 px-1 rounded-xl transition-colors">
                  <div>
                    <p class="font-bold text-neutral-900">\${tx.title}</p>
                    <span class="text-[10px] text-neutral-500">\${tx.subtitle} · \${tx.date}</span>
                  </div>
                  <span class="font-bold tabular-nums \${tx.amount > 0 ? 'text-emerald-600' : 'text-neutral-900'}">
                    \${tx.amount > 0 ? '+ ' : ''}\${formatBRL(tx.amount)}
                  </span>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
      } else if (activeTab === 'investments') {
        html += \`
          <div class="p-4 space-y-4">
            <div class="bg-[#820ad1] text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
              <div>
                <span class="text-xs text-purple-200 font-medium">Total investido em Caixinhas & CDB</span>
                <div class="text-3xl font-extrabold mt-1">\${formatBRL(state.investments.total)}</div>
                <span class="text-xs text-emerald-300 font-semibold mt-1 block">Rendimento a +112% do CDI (+R$ \${(state.investments.yield12m || 3464.20).toFixed(2)} no período)</span>
              </div>
              <button onclick="openMasterModal()" class="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full" title="Editar valores de investimento">
                Editar ⚙️
              </button>
            </div>

            <div class="bg-purple-50 p-3.5 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-start gap-2.5">
              <span class="text-base">🕒</span>
              <div>
                <h4 class="font-bold text-xs">Aplicação em processamento</h4>
                <p class="text-[11px] mt-0.5 leading-snug">Sua aplicação em Tesouro Direto está em processamento e será liquidada em até 1 dia útil.</p>
              </div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-neutral-100 space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold text-neutral-900">Caixinhas · Rendimento Diário</span>
                <button onclick="openMasterModal()" class="text-[11px] font-bold text-[#820ad1]">Gerenciar valores</button>
              </div>
              \${state.investments.boxes.map(b => \`
                <div class="p-3 bg-neutral-50 rounded-xl flex justify-between items-center text-xs">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">\${b.emoji}</span>
                    <div>
                      <p class="font-bold text-neutral-900">\${b.title}</p>
                      <span class="text-[10px] text-emerald-600 font-semibold">Rende \${b.yieldRate}</span>
                    </div>
                  </div>
                  <span class="font-extrabold">\${formatBRL(b.amount)}</span>
                </div>
              \`).join('')}
            </div>

            <div class="bg-white p-4 rounded-2xl border border-neutral-100 space-y-3">
              <span class="text-xs font-bold text-neutral-900 block">Minha Carteira</span>
              <div class="h-3 w-full rounded-full overflow-hidden flex bg-neutral-100">
                <div class="bg-[#820ad1] h-full" style="width: 27%" title="Reserva de Emergência: 27%"></div>
                <div class="bg-emerald-500 h-full" style="width: 19%" title="Reserva para Viagem: 19%"></div>
                <div class="bg-amber-500 h-full" style="width: 54%" title="Plano de Aposentadoria: 54%"></div>
              </div>
              <div class="grid grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span class="text-neutral-500">Emergência</span>
                  <p class="font-bold">27%</p>
                </div>
                <div>
                  <span class="text-neutral-500">Viagem</span>
                  <p class="font-bold">19%</p>
                </div>
                <div>
                  <span class="text-neutral-500">Aposentadoria</span>
                  <p class="font-bold">54%</p>
                </div>
              </div>
            </div>
          </div>
        \`;
      } else if (activeTab === 'rewards') {
        html += \`
          <div class="p-4 space-y-4">
            <div class="bg-gradient-to-r from-[#820ad1] to-purple-900 text-white p-5 rounded-2xl">
              <h3 class="text-lg font-bold">Nucoin & Benefícios 🎁</h3>
              <p class="text-xs text-purple-200">Programas de cashback e vantagens ativas</p>
            </div>
            <div class="space-y-2">
              \${state.quests.map(q => \`
                <div class="bg-white p-4 rounded-2xl border border-neutral-100 text-xs space-y-2">
                  <div class="flex justify-between">
                    <span class="font-bold text-neutral-900">\${q.title}</span>
                    <span class="font-extrabold text-emerald-600">+\${formatBRL(q.reward)}</span>
                  </div>
                  <p class="text-neutral-500 text-[11px]">\${q.description}</p>
                  <button onclick="claimQuest('\${q.id}')" class="w-full bg-emerald-600 text-white py-1.5 rounded-xl font-bold text-xs \${q.claimed ? 'opacity-50 pointer-events-none' : ''}">
                    \${q.claimed ? '✓ Creditado' : 'Resgatar Cashback'}
                  </button>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
      } else {
        html += \`
          <div class="p-4 space-y-4">
            <div class="bg-white p-5 rounded-2xl text-xs space-y-3 border border-neutral-100">
              <span class="font-bold text-sm text-neutral-900 block">Recarga de Celular</span>
              <div class="grid grid-cols-3 gap-2">
                <button onclick="buyItem('Recarga Claro 5G', 30)" class="bg-[#f0f1f5] p-2.5 rounded-xl font-bold text-center">Claro</button>
                <button onclick="buyItem('Recarga Vivo 5G', 30)" class="bg-[#820ad1] text-white p-2.5 rounded-xl font-bold text-center">Vivo</button>
                <button onclick="buyItem('Recarga TIM 5G', 30)" class="bg-[#f0f1f5] p-2.5 rounded-xl font-bold text-center">TIM</button>
              </div>
            </div>

            <div class="bg-gradient-to-r from-purple-900 to-[#820ad1] text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold text-amber-300">SEGURO DE VIDA NU RPG</span>
                <h4 class="text-xs font-bold">Proteção para acidentes e imprevistos</h4>
                <p class="text-[10px] text-purple-200">A partir de R$ 9,00/mês</p>
              </div>
              <button onclick="alert('Seguro de Vida Nu RPG simulado com sucesso!')" class="bg-white text-[#820ad1] px-3 py-1.5 rounded-xl font-bold text-xs">Simular</button>
            </div>

            <div class="bg-white p-5 rounded-2xl text-xs space-y-2 border border-neutral-100">
              <span class="font-bold text-sm text-neutral-900">Serviços & Mobilidade</span>
              <button onclick="buyItem('Recarga de Cartão de Transporte', 44)" class="w-full bg-[#f0f1f5] p-3 rounded-xl flex justify-between items-center text-xs font-bold text-neutral-800">
                <span>🚌 Recarga de Cartão de Transporte</span>
                <span>R$ 44,00</span>
              </button>
              <button onclick="buyItem('Gift Cards (Spotify / Uber)', 50)" class="w-full bg-[#f0f1f5] p-3 rounded-xl flex justify-between items-center text-xs font-bold text-neutral-800">
                <span>🎵 Gift Cards (Spotify / Uber)</span>
                <span>R$ 50,00</span>
              </button>
              <button onclick="buyItem('Tag de Pedágio Nu RPG', 20)" class="w-full bg-[#f0f1f5] p-3 rounded-xl flex justify-between items-center text-xs font-bold text-neutral-800">
                <span>🚗 Tag de Pedágio Nu RPG</span>
                <span>R$ 20,00</span>
              </button>
            </div>
          </div>
        \`;
      }

      container.innerHTML = html;
    }

    // Modal de Comprovante Oficial com Excluir e Duplicar
    function openReceiptModal(txId) {
      const tx = state.transactions.find(t => t.id === txId);
      if (!tx) return;

      const overlay = document.getElementById('modalOverlay');
      const content = document.getElementById('modalContent');
      if (!overlay || !content) return;

      const isPositive = tx.amount > 0;
      const dateParts = tx.date.split(' às ');
      const defaultDate = dateParts[0] || 'Hoje';
      const defaultTime = dateParts[1] || '20:45';

      content.innerHTML = \`
        <div class="bg-[#820ad1] text-white p-5 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">nu</div>
            <div>
              <h3 class="text-sm font-bold">Comprovante de Operação</h3>
              <span class="text-[10px] text-purple-200">Nu RPG Pagamentos S.A.</span>
            </div>
          </div>
          <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white">✕</button>
        </div>

        <div class="p-5 overflow-y-auto space-y-4 text-xs text-neutral-800 flex-1">
          <div class="text-center pb-3 border-b border-neutral-100">
            <div class="w-12 h-12 rounded-full bg-purple-100 text-[#820ad1] mx-auto flex items-center justify-center mb-1 text-xl">✓</div>
            <span class="text-[11px] text-neutral-500 font-bold uppercase tracking-wider block">\${tx.title}</span>
            <div class="text-2xl font-black mt-1 tabular-nums \${isPositive ? 'text-emerald-600' : 'text-neutral-900'}">
              \${isPositive ? '+ ' : ''}\${formatBRL(Math.abs(tx.amount))}
            </div>
            <p class="text-neutral-400 mt-0.5">\${tx.date}</p>
          </div>

          <div class="space-y-2">
            \${tx.recipientOrPayer ? \`
              <div>
                <span class="text-neutral-400 text-[10px] block">\${isPositive ? 'Origem do Recurso' : 'Destinatário'}</span>
                <span class="font-bold text-neutral-900 text-xs">\${tx.recipientOrPayer}</span>
              </div>
            \` : ''}
            <div>
              <span class="text-neutral-400 text-[10px] block">Instituição Financeira</span>
              <span class="font-medium">Nu RPG Pagamentos S.A. - Instituição de Pagamento (Banco 260)</span>
            </div>
            <div>
              <span class="text-neutral-400 text-[10px] block">Autenticação Bancária</span>
              <span class="font-mono text-[10px] text-neutral-600 font-bold bg-neutral-50 p-2 rounded-xl block mt-0.5 border border-neutral-100 break-all">\${tx.authCode || 'E820AD1-08NOV-NURPG-OFFICIAL'}</span>
            </div>
          </div>

          <!-- Container dinâmico para formulário inline de duplicação -->
          <div id="duplicateFormContainer" class="hidden p-3 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
            <span class="font-bold text-xs text-[#820ad1] block">Duplicar Transação</span>
            <div>
              <label class="text-[10px] text-neutral-600 block">Novo Valor (R$)</label>
              <input id="dup-val" type="text" value="\${Math.abs(tx.amount).toFixed(2)}" class="w-full px-2 py-1 bg-white border border-neutral-300 rounded-lg text-xs font-bold outline-none" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[10px] text-neutral-600 block">Data</label>
                <input id="dup-date" type="text" value="\${defaultDate}" class="w-full px-2 py-1 bg-white border border-neutral-300 rounded-lg text-xs outline-none" />
              </div>
              <div>
                <label class="text-[10px] text-neutral-600 block">Horário</label>
                <input id="dup-time" type="text" value="\${defaultTime}" class="w-full px-2 py-1 bg-white border border-neutral-300 rounded-lg text-xs outline-none" />
              </div>
            </div>
            <div class="flex gap-2 pt-1">
              <button onclick="confirmDuplicateTransaction('\${tx.id}')" class="flex-1 bg-[#820ad1] text-white py-1.5 rounded-lg font-bold text-xs">Confirmar</button>
              <button onclick="document.getElementById('duplicateFormContainer').classList.add('hidden')" class="px-2.5 bg-neutral-200 text-neutral-700 py-1.5 rounded-lg text-xs font-bold">Cancelar</button>
            </div>
          </div>
        </div>

        <div class="p-4 bg-neutral-50 border-t border-neutral-100 space-y-2">
          <button onclick="copyReceiptText('\${tx.id}')" class="w-full bg-[#820ad1] text-white font-bold text-xs py-3 rounded-full shadow-xs">
            Compartilhar Comprovante
          </button>
          <div class="grid grid-cols-2 gap-2 pt-0.5">
            <button onclick="document.getElementById('duplicateFormContainer').classList.toggle('hidden')" class="py-2 px-3 rounded-xl border border-neutral-200 bg-white hover:bg-purple-50 text-neutral-700 hover:text-[#820ad1] font-bold text-xs">
              Duplicar transação
            </button>
            <button onclick="confirmDeleteTransaction('\${tx.id}')" class="py-2 px-3 rounded-xl border border-neutral-200 bg-white hover:bg-rose-50 text-neutral-700 hover:text-rose-600 font-bold text-xs">
              Excluir lançamento
            </button>
          </div>
        </div>
      \`;

      overlay.classList.remove('hidden');
    }

    function confirmDeleteTransaction(txId) {
      const tx = state.transactions.find(t => t.id === txId);
      if (!tx) return;

      const confirmDel = confirm('Deseja realmente excluir este lançamento do extrato?\\nO saldo da conta será recalculado automaticamente.');
      if (!confirmDel) return;

      // Recalcular saldo da conta
      state.balance -= tx.amount;
      state.transactions = state.transactions.filter(t => t.id !== txId);
      saveState();
      closeModal();
      alert('Lançamento excluído e saldo atualizado com sucesso!');
    }

    function confirmDuplicateTransaction(txId) {
      const tx = state.transactions.find(t => t.id === txId);
      if (!tx) return;

      const valInput = parseFloat(document.getElementById('dup-val')?.value || '');
      const dateInput = document.getElementById('dup-date')?.value?.trim() || 'Hoje';
      const timeInput = document.getElementById('dup-time')?.value?.trim() || '20:45';

      if (isNaN(valInput) || valInput <= 0) {
        return alert('Informe um valor válido maior que zero.');
      }

      const finalAmount = tx.amount < 0 ? -Math.abs(valInput) : Math.abs(valInput);
      const newDateStr = timeInput ? (dateInput + ' às ' + timeInput) : dateInput;

      const newTx = {
        ...tx,
        id: 'tx-' + Date.now(),
        amount: finalAmount,
        date: newDateStr,
        authCode: 'E820AD1-' + Math.random().toString(36).substring(2, 9).toUpperCase()
      };

      state.balance += finalAmount;
      state.transactions.unshift(newTx);
      saveState();
      closeModal();
      alert('Transação duplicada e saldo atualizado com sucesso!');
    }

    function copyReceiptText(txId) {
      const tx = state.transactions.find(t => t.id === txId);
      if (tx) {
        navigator.clipboard?.writeText('Comprovante Nu RPG: ' + tx.title + ' de ' + formatBRL(Math.abs(tx.amount)) + '. Autenticação: ' + (tx.authCode || 'OFICIAL'));
        alert('Comprovante copiado para a área de transferência!');
      }
    }

    // Modal de Área Pix com Alerta de Limite Excedido em Destaque
    function openPixModal() {
      const overlay = document.getElementById('modalOverlay');
      const content = document.getElementById('modalContent');
      if (!overlay || !content) return;

      const contacts = ['Fernanda Ribeiro Morelo', 'GOOGLE BRASIL PAGAMENTOS LTDA.', 'Das-Simples Nacional', 'ValueHost SA', 'Mercado Silva', 'Posto Shell', 'Padaria Central', 'Ana Clara Silva', 'Carlos Eduardo Lima'];

      content.innerHTML = \`
        <div class="bg-[#820ad1] text-white p-5 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">nu</div>
            <div>
              <h3 class="text-sm font-bold">Área Pix · Nu RPG</h3>
              <p class="text-[10px] text-purple-200">Saldo: \${formatBRL(state.balance)}</p>
            </div>
          </div>
          <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white">✕</button>
        </div>

        <div class="p-5 overflow-y-auto space-y-4 text-xs">
          <!-- Alerta em Destaque: Limite Pix Diário Excedido -->
          <div id="pixLimitAlertBanner" class="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-2.5 shadow-2xs">
            <span class="text-lg">⚠️</span>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-bold text-amber-950">Limite Pix Diário Atingido</h4>
                <span id="limitBadge" class="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded-md">\${isPixLimitExceeded ? 'Bloqueado' : 'Liberado'}</span>
              </div>
              <p class="text-[11px] text-amber-900 mt-1 leading-snug">
                <strong>Atenção:</strong> O seu limite diário de transferência Pix é de <strong>R$ 30.000,00</strong> e já foi excedido para o dia de hoje.
              </p>
              <div class="mt-2 pt-2 border-t border-amber-200 flex justify-between items-center text-[10px]">
                <span class="text-amber-800">Restabelecimento diário às 06:00</span>
                <button onclick="togglePixLimitRelease()" class="text-[#820ad1] font-bold underline">
                  \${isPixLimitExceeded ? 'Liberar limite de teste' : 'Restaurar limite excedido'}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label class="font-bold text-neutral-700 block mb-1">Qual é o valor da transferência (R$)?</label>
            <input id="pix-val" type="text" placeholder="0,00" class="w-full px-3 py-2 bg-[#f0f1f5] rounded-xl text-base font-black text-neutral-900 outline-none" />
          </div>

          <div>
            <label class="font-bold text-neutral-700 block mb-1">Destinatário ou Chave Pix</label>
            <select id="pix-dest" class="w-full px-3 py-2 bg-[#f0f1f5] rounded-xl text-xs font-semibold text-neutral-800 outline-none">
              \${contacts.map(c => \`<option value="\${c}">\${c}</option>\`).join('')}
            </select>
          </div>

          <div>
            <label class="font-bold text-neutral-700 block mb-1">Descrição (Opcional)</label>
            <input id="pix-note" type="text" placeholder="Pagamento de conta, Churrasco, Aluguel" class="w-full px-3 py-2 bg-[#f0f1f5] rounded-xl text-xs outline-none" />
          </div>

          <button id="pixSubmitBtn" onclick="attemptPixTransfer()" class="w-full py-3.5 rounded-full font-bold text-xs transition-all \${
            isPixLimitExceeded
              ? 'bg-neutral-200 text-neutral-600 border border-neutral-300 cursor-not-allowed'
              : 'bg-[#820ad1] text-white shadow-sm'
          }">
            \${isPixLimitExceeded ? '🛡️ Transferência Indisponível (Limite Excedido)' : 'Transferir Agora'}
          </button>
        </div>
      \`;

      overlay.classList.remove('hidden');
    }

    function togglePixLimitRelease() {
      isPixLimitExceeded = !isPixLimitExceeded;
      openPixModal();
    }

    function attemptPixTransfer() {
      if (isPixLimitExceeded) {
        alert('Atenção: O seu limite diário de transferência Pix é de R$ 30.000,00 e já foi excedido para o dia de hoje.');
        return;
      }

      const valInput = parseFloat(document.getElementById('pix-val')?.value?.replace(',', '.') || '');
      const dest = document.getElementById('pix-dest')?.value || 'Fernanda Ribeiro Morelo';
      const note = document.getElementById('pix-note')?.value || 'Transferência Pix';

      if (isNaN(valInput) || valInput <= 0) return alert('Por favor, informe um valor válido maior que zero.');
      if (valInput > state.balance) return alert('Saldo insuficiente na conta corrente.');

      state.balance -= valInput;
      state.transactions.unshift({
        id: 'tx-' + Date.now(),
        title: dest,
        subtitle: 'Envio Pix · ' + note,
        amount: -valInput,
        date: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        category: 'pix',
        recipientOrPayer: dest,
        note: note,
        authCode: 'E820AD1-' + Math.random().toString(36).substring(2, 9).toUpperCase()
      });

      saveState();
      closeModal();
      alert('Transferência Pix de ' + formatBRL(valInput) + ' para ' + dest + ' realizada com sucesso!');
    }

    function openLoanModal() {
      const valStr = prompt('Empréstimo Pessoal Nu RPG\\nDe quanto você precisa?\\n(Limite pré-aprovado até R$ 25.000,00):', '2000');
      if (!valStr) return;
      const val = parseFloat(valStr.replace(',', '.'));
      if (isNaN(val) || val <= 0 || val > 25000) return alert('Valor de empréstimo inválido.');
      const instStr = prompt('Escolha o número de parcelas (6, 12 ou 24):', '12');
      const installments = parseInt(instStr) || 12;
      const totalAmount = val * Math.pow(1.015, installments);
      
      state.balance += val;
      state.transactions.unshift({
        id: 'tx-' + Date.now(),
        title: 'Empréstimo Pessoal Creditado',
        subtitle: installments + 'x de R$ ' + (totalAmount / installments).toFixed(2) + ' · Comece a pagar em até 90 dias',
        amount: val,
        date: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        category: 'transfer',
        recipientOrPayer: 'Nu RPG Financeira S.A.',
        note: 'Taxa de juros 1,50% a.m.',
        authCode: 'E820AD1-' + Math.random().toString(36).substring(2, 9).toUpperCase()
      });
      saveState();
      alert('Empréstimo Pessoal Nu RPG de R$ ' + val.toFixed(2) + ' contratado e creditado na sua conta com sucesso!');
    }

    function openCardModal() {
      if (state.creditCard.currentInvoice <= 0) {
        return alert('Sua fatura do Cartão de Crédito Nu RPG está em dia! Valor atual: R$ 0,00.');
      }
      const confirmPay = confirm('Fatura Atual: ' + formatBRL(state.creditCard.currentInvoice) + '\\nDeseja pagar a fatura com o saldo da conta corrente?');
      if (!confirmPay) return;
      if (state.balance < state.creditCard.currentInvoice) {
        return alert('Saldo insuficiente para quitar o total da fatura!');
      }
      const paid = state.creditCard.currentInvoice;
      state.balance -= paid;
      state.creditCard.currentInvoice = 0;
      state.transactions.unshift({
        id: 'tx-' + Date.now(),
        title: 'Pagamento de Fatura',
        subtitle: 'Fatura de Cartão · Cartão Nu RPG Platinum',
        amount: -paid,
        date: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        category: 'card',
        recipientOrPayer: 'Nu RPG Cartões S.A.',
        authCode: 'E820AD1-' + Math.random().toString(36).substring(2, 9).toUpperCase()
      });
      saveState();
      alert('Fatura de R$ ' + paid.toFixed(2) + ' paga com sucesso!');
    }

    function openMasterModal() {
      const overlay = document.getElementById('modalOverlay');
      const content = document.getElementById('modalContent');
      if (!overlay || !content) return;

      let boxesInputsHtml = state.investments.boxes.map((b, i) => \`
        <div class="p-2 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1 text-xs">
          <div class="flex justify-between items-center font-bold">
            <span>\${b.emoji} \${b.title}</span>
            <span class="text-[10px] text-emerald-700">\${b.yieldRate}</span>
          </div>
          <div class="flex gap-2">
            <div class="flex-1">
              <label class="text-[9px] text-neutral-500 font-semibold block">Saldo (R$)</label>
              <input id="box-amt-\${i}" type="text" value="\${b.amount.toFixed(2)}" class="w-full px-2 py-1 bg-white border border-neutral-300 rounded-lg text-xs font-bold text-neutral-900 outline-none tabular-nums" />
            </div>
            <div class="flex-1">
              <label class="text-[9px] text-neutral-500 font-semibold block">Meta (R$)</label>
              <input id="box-tgt-\${i}" type="text" value="\${b.target.toFixed(2)}" class="w-full px-2 py-1 bg-white border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 outline-none tabular-nums" />
            </div>
          </div>
        </div>
      \`).join('');

      content.innerHTML = \`
        <div class="bg-[#820ad1] text-white p-4 flex justify-between items-center">
          <div>
            <h3 class="text-sm font-bold">Configurações da Conta · Nu RPG</h3>
            <p class="text-[10px] text-purple-200">Ajuste de saldo, fatura e caixinhas</p>
          </div>
          <button onclick="closeModal()" class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">✕</button>
        </div>
        <div class="p-4 overflow-y-auto space-y-3 text-xs flex-1">
          <div>
            <label class="font-bold text-neutral-700 block mb-1">1. Saldo em Conta Corrente (R$)</label>
            <input id="master-bal" type="text" value="\${state.balance.toFixed(2)}" class="w-full px-3 py-2 bg-[#f0f1f5] rounded-xl font-black text-sm text-neutral-900 outline-none" />
          </div>

          <div>
            <label class="font-bold text-neutral-700 block mb-1">2. Fatura do Cartão de Crédito (R$)</label>
            <input id="master-inv-card" type="text" value="\${state.creditCard.currentInvoice.toFixed(2)}" class="w-full px-3 py-2 bg-[#f0f1f5] rounded-xl font-bold text-xs text-neutral-900 outline-none" />
          </div>

          <div class="border-t border-neutral-200 pt-2 space-y-2">
            <div class="flex justify-between items-center">
              <label class="font-bold text-neutral-800">3. Valores de Investimentos</label>
              <span class="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Manual</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[10px] text-neutral-500 font-semibold block mb-0.5">Total Investido (R$)</label>
                <input id="master-inv-tot" type="text" value="\${state.investments.total.toFixed(2)}" class="w-full px-2 py-1.5 bg-[#f0f1f5] rounded-xl font-bold text-xs text-neutral-900 outline-none tabular-nums" />
              </div>
              <div>
                <label class="text-[10px] text-neutral-500 font-semibold block mb-0.5">Rendimento 12m (R$)</label>
                <input id="master-inv-yld" type="text" value="\${(state.investments.yield12m || 3464.20).toFixed(2)}" class="w-full px-2 py-1.5 bg-[#f0f1f5] rounded-xl font-bold text-xs text-neutral-900 outline-none tabular-nums" />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] text-neutral-600 font-bold block">Saldos de Cada Caixinha:</label>
              \${boxesInputsHtml}
            </div>
          </div>

          <div class="border-t border-neutral-200 pt-2">
            <button onclick="saveMasterSettings()" class="w-full bg-[#820ad1] text-white py-2.5 rounded-xl font-bold text-xs shadow-sm hover:bg-[#7208b8]">
              Salvar Todas as Alterações
            </button>
          </div>
        </div>
      \`;
      overlay.classList.remove('hidden');
    }

    function closeModal() {
      const overlay = document.getElementById('modalOverlay');
      if (overlay) overlay.classList.add('hidden');
    }

    function saveMasterSettings() {
      const balVal = parseFloat(document.getElementById('master-bal')?.value || '');
      if (!isNaN(balVal) && balVal >= 0) state.balance = balVal;

      const cardVal = parseFloat(document.getElementById('master-inv-card')?.value || '');
      if (!isNaN(cardVal) && cardVal >= 0) state.creditCard.currentInvoice = cardVal;

      const invTot = parseFloat(document.getElementById('master-inv-tot')?.value || '');
      const invYld = parseFloat(document.getElementById('master-inv-yld')?.value || '');

      state.investments.boxes.forEach((b, i) => {
        const amtInput = parseFloat(document.getElementById('box-amt-' + i)?.value || '');
        const tgtInput = parseFloat(document.getElementById('box-tgt-' + i)?.value || '');
        if (!isNaN(amtInput)) b.amount = amtInput;
        if (!isNaN(tgtInput)) b.target = tgtInput;
      });

      const sumBoxes = state.investments.boxes.reduce((a, c) => a + c.amount, 0);
      state.investments.total = !isNaN(invTot) && invTot > 0 ? invTot : sumBoxes;
      if (!isNaN(invYld)) state.investments.yield12m = invYld;

      saveState();
      closeModal();
      alert('Valores de saldo, cartão e investimentos atualizados com sucesso!');
    }

    function claimQuest(id) {
      const q = state.quests.find(x => x.id === id);
      if (q && !q.claimed) {
        q.claimed = true;
        state.balance += q.reward;
        state.transactions.unshift({
          id: 'tx-' + Date.now(),
          title: 'Cashback Creditado na Conta',
          subtitle: q.title,
          amount: q.reward,
          date: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          category: 'transfer',
          authCode: 'E820AD1-' + Math.random().toString(36).substring(2, 9).toUpperCase()
        });
        saveState();
        alert('Você recebeu +' + formatBRL(q.reward) + ' de cashback!');
      }
    }

    function buyItem(name, price) {
      if (state.balance < price) return alert('Saldo insuficiente!');
      state.balance -= price;
      state.transactions.unshift({
        id: 'tx-' + Date.now(),
        title: name,
        subtitle: 'Pagamento de Serviço · Débito em conta',
        amount: -price,
        date: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        category: 'store',
        authCode: 'E820AD1-' + Math.random().toString(36).substring(2, 9).toUpperCase()
      });
      saveState();
      alert('Pagamento de: ' + name + ' (' + formatBRL(price) + ') efetuado com sucesso!');
    }

    // Service Worker Inline
    if ('serviceWorker' in navigator) {
      const swCode = \`
        const CACHE = 'nurpg-pwa-cache-v3';
        const ASSETS = [
          'https://cdn.tailwindcss.com',
          'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
        ];
        self.addEventListener('install', (e) => {
          e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(()=>{})));
          self.skipWaiting();
        });
        self.addEventListener('activate', (e) => {
          self.clients.claim();
        });
        self.addEventListener('fetch', (e) => {
          if (e.request.method !== 'GET') return;
          e.respondWith(
            caches.match(e.request).then((res) => res || fetch(e.request).then((netRes) => {
              if (netRes && netRes.status === 200) {
                const clone = netRes.clone();
                caches.open(CACHE).then((c) => c.put(e.request, clone));
              }
              return netRes;
            }).catch(() => caches.match(e.request)))
          );
        });
      \`;
      try {
        const blob = new Blob([swCode], { type: 'application/javascript' });
        navigator.serviceWorker.register(URL.createObjectURL(blob)).catch(console.warn);
      } catch(e) {}
    }

    renderApp();
  </script>
</body>
</html>`;
}
