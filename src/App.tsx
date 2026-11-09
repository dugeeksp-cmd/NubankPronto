import React, { useState, useEffect } from 'react';
import { PhoneFrame } from './components/PhoneFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { InvestmentsScreen } from './components/InvestmentsScreen';
import { RewardsScreen } from './components/RewardsScreen';
import { ServicesScreen } from './components/ServicesScreen';

import { PixModal } from './components/modals/PixModal';
import { HistoryModal } from './components/modals/HistoryModal';
import { CreditCardModal } from './components/modals/CreditCardModal';
import { LoanModal } from './components/modals/LoanModal';
import { BoxesModal } from './components/modals/BoxesModal';
import { MasterPanelModal } from './components/modals/MasterPanelModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { HelpModal } from './components/modals/HelpModal';
import { Toast } from './components/Toast';

import { BankState, Transaction, Caixinha } from './types/bank';
import { INITIAL_STATE, INITIAL_TRANSACTIONS, STORAGE_KEY, containsFantasyTerms } from './data/initialData';
import { getCurrentFormattedDate, generateAuthCode } from './utils/formatters';
import { generateStandaloneHTML } from './utils/exportHtml';

export default function App() {
  // Load state from localStorage or use initial state with fantasy terms sanitizer
  const [state, setState] = useState<BankState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // If saved localStorage has legacy fantasy terms from previous iterations, automatically sanitize to clean initial state
        if (containsFantasyTerms(saved)) {
          console.warn('Legacy fantasy terms detected in localStorage. Sanitizing state to clean banking data.');
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
          return INITIAL_STATE;
        }
        const parsed: BankState = JSON.parse(saved);
        // Ensure the 6 real banking transactions requested by the user are present in the history
        const hasSimples = parsed.transactions?.some((t) =>
          t.title?.toLowerCase().includes('das-simples nacional')
        );
        if (!hasSimples) {
          parsed.transactions = INITIAL_TRANSACTIONS;
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          } catch (e) {}
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    }
    return INITIAL_STATE;
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'home' | 'investments' | 'rewards' | 'services'>('home');

  // Modals visibility state
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isBoxesModalOpen, setIsBoxesModalOpen] = useState(false);
  const [isMasterPanelOpen, setIsMasterPanelOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Selected transaction for receipt view
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);

  // Floating feedback toast
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }, [state]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Toggle eye balance visibility
  const handleToggleHideBalance = () => {
    setState((prev) => ({
      ...prev,
      isBalanceHidden: !prev.isBalanceHidden,
    }));
  };

  // 1. Send Pix Transfer
  const handleSendPix = (amount: number, recipientName: string, pixKey: string, note: string): boolean => {
    if (state.balance < amount) return false;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: 'Transferência Pix enviada',
      subtitle: `${recipientName} · ${note || 'Pix enviado'}`,
      amount: -amount,
      date: getCurrentFormattedDate(),
      timestamp: Date.now(),
      category: 'pix',
      icon: 'ArrowUpRight',
      recipientOrPayer: recipientName,
      pixKey,
      authCode: generateAuthCode(),
      note,
    };

    setState((prev) => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [newTx, ...prev.transactions],
    }));

    showToast(`Pix de R$ ${amount.toFixed(2)} enviado para ${recipientName}!`);
    return true;
  };

  // 1.1 Delete Transaction from History & Recalculate Balance
  const handleDeleteTransaction = (txId: string) => {
    const tx = state.transactions.find((t) => t.id === txId);
    if (!tx) return;

    // Recalcula o saldo da conta em tempo real no localStorage:
    // Se o lançamento excluído era débito (amount < 0), o saldo é recomposto (+ |amount|).
    // Se era crédito (amount > 0), o saldo é reduzido (- amount).
    const newBalance = state.balance - tx.amount;

    setState((prev) => ({
      ...prev,
      balance: newBalance,
      transactions: prev.transactions.filter((t) => t.id !== txId),
    }));

    setSelectedReceiptTx(null);
    showToast('Lançamento excluído e saldo atualizado com sucesso!');
  };

  // 1.2 Duplicate Transaction with custom amount, date and time
  const handleDuplicateTransaction = (
    tx: Transaction,
    newAmount: number,
    newDate: string,
    newTime: string
  ) => {
    const finalAmount = tx.amount < 0 ? -Math.abs(newAmount) : Math.abs(newAmount);
    const newDateStr = newTime ? `${newDate} às ${newTime}` : newDate;

    const duplicatedTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      amount: finalAmount,
      date: newDateStr,
      timestamp: Date.now(),
      authCode: generateAuthCode(),
    };

    const newBalance = state.balance + finalAmount;

    setState((prev) => ({
      ...prev,
      balance: newBalance,
      transactions: [duplicatedTx, ...prev.transactions],
    }));

    setSelectedReceiptTx(null);
    showToast('Transação duplicada e saldo atualizado com sucesso!');
  };

  // 2. Pay Credit Card Invoice
  const handlePayInvoice = (amountToPay: number): boolean => {
    if (state.balance < amountToPay) return false;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: 'Pagamento de Fatura',
      subtitle: 'Cartão de Crédito Nu RPG Platinum',
      amount: -amountToPay,
      date: getCurrentFormattedDate(),
      timestamp: Date.now(),
      category: 'card',
      icon: 'CreditCard',
      recipientOrPayer: 'Nu RPG Cartões S.A.',
      authCode: generateAuthCode(),
      note: 'Pagamento efetuado via débito em conta corrente',
    };

    setState((prev) => ({
      ...prev,
      balance: prev.balance - amountToPay,
      creditCard: {
        ...prev.creditCard,
        currentInvoice: Math.max(0, prev.creditCard.currentInvoice - amountToPay),
      },
      transactions: [newTx, ...prev.transactions],
    }));

    showToast(`Fatura de R$ ${amountToPay.toFixed(2)} paga com sucesso!`);
    return true;
  };

  // 3. Toggle Card Block
  const handleToggleCardBlock = () => {
    setState((prev) => {
      const nextBlocked = !prev.creditCard.isCardBlocked;
      showToast(nextBlocked ? 'Cartão temporariamente bloqueado!' : 'Cartão desbloqueado para uso!');
      return {
        ...prev,
        creditCard: {
          ...prev.creditCard,
          isCardBlocked: nextBlocked,
        },
      };
    });
  };

  // 4. Contract Loan
  const handleContractLoan = (amount: number, installments: number, totalWithInterest: number) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: 'Empréstimo Pessoal Creditado',
      subtitle: `${installments}x de R$ ${(totalWithInterest / installments).toFixed(2)} · Carência até 90 dias`,
      amount: amount,
      date: getCurrentFormattedDate(),
      timestamp: Date.now(),
      category: 'loan',
      icon: 'Coins',
      recipientOrPayer: 'Nu RPG Financeira S.A.',
      authCode: generateAuthCode(),
      note: `Contrato de crédito pessoal nº ${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setState((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [newTx, ...prev.transactions],
    }));

    showToast(`Empréstimo de R$ ${amount.toFixed(2)} creditado na sua conta!`);
  };

  // 5. Caixinha Deposit
  const handleDepositBox = (boxId: string, amount: number): boolean => {
    if (state.balance < amount) return false;

    const box = state.investments.boxes.find((b) => b.id === boxId);
    if (!box) return false;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: 'Aplicação em Caixinha Nu RPG',
      subtitle: `Guardado em ${box.title}`,
      amount: -amount,
      date: getCurrentFormattedDate(),
      timestamp: Date.now(),
      category: 'box',
      icon: 'Shield',
      recipientOrPayer: box.title,
      authCode: generateAuthCode(),
      note: `Rendimento automático de 100% do CDI com garantia FGC`,
    };

    setState((prev) => ({
      ...prev,
      balance: prev.balance - amount,
      investments: {
        ...prev.investments,
        total: prev.investments.total + amount,
        boxes: prev.investments.boxes.map((b) =>
          b.id === boxId ? { ...b, amount: b.amount + amount } : b
        ),
      },
      transactions: [newTx, ...prev.transactions],
    }));

    showToast(`R$ ${amount.toFixed(2)} guardado em ${box.title}!`);
    return true;
  };

  // 6. Caixinha Withdraw
  const handleWithdrawBox = (boxId: string, amount: number): boolean => {
    const box = state.investments.boxes.find((b) => b.id === boxId);
    if (!box || box.amount < amount) return false;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: 'Resgate de Caixinha Nu RPG',
      subtitle: `Resgatado de ${box.title}`,
      amount: amount,
      date: getCurrentFormattedDate(),
      timestamp: Date.now(),
      category: 'box',
      icon: 'Shield',
      recipientOrPayer: box.title,
      authCode: generateAuthCode(),
      note: 'Resgate imediato creditado na conta corrente',
    };

    setState((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      investments: {
        ...prev.investments,
        total: Math.max(0, prev.investments.total - amount),
        boxes: prev.investments.boxes.map((b) =>
          b.id === boxId ? { ...b, amount: Math.max(0, b.amount - amount) } : b
        ),
      },
      transactions: [newTx, ...prev.transactions],
    }));

    showToast(`R$ ${amount.toFixed(2)} resgatado para a sua conta!`);
    return true;
  };

  // 7. Create New Box
  const handleCreateBox = (title: string, target: number, emoji: string) => {
    const newBox = {
      id: `box-${Date.now()}`,
      title,
      amount: 0,
      target,
      yieldRate: '100% do CDI',
      emoji,
    };

    setState((prev) => ({
      ...prev,
      investments: {
        ...prev.investments,
        boxes: [...prev.investments.boxes, newBox],
      },
    }));

    showToast(`Caixinha "${title}" criada com sucesso!`);
  };

  // 8. Buy Item in Store / Services
  const handleBuyItem = (name: string, price: number, description: string) => {
    if (state.balance < price) {
      showToast('Saldo insuficiente para realizar esta compra!', 'error');
      return;
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: 'Pagamento de Serviço / NuShopping',
      subtitle: name,
      amount: -price,
      date: getCurrentFormattedDate(),
      timestamp: Date.now(),
      category: 'store',
      icon: 'Store',
      recipientOrPayer: 'NuShopping Parceiros',
      authCode: generateAuthCode(),
      note: description,
    };

    setState((prev) => ({
      ...prev,
      balance: prev.balance - price,
      transactions: [newTx, ...prev.transactions],
    }));

    showToast(`Pagamento de "${name}" realizado com sucesso!`);
  };

  // 9. Claim Cashback / Benefit
  const handleClaimQuest = (questId: string) => {
    const benefit = state.quests.find((q) => q.id === questId);
    if (!benefit || benefit.claimed) return;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: 'Cashback Creditado na Conta',
      subtitle: benefit.title,
      amount: benefit.reward,
      date: getCurrentFormattedDate(),
      timestamp: Date.now(),
      category: 'transfer',
      icon: 'Sparkles',
      recipientOrPayer: 'Programa de Benefícios Nu RPG',
      authCode: generateAuthCode(),
      note: `Crédito promocional (${benefit.category})`,
    };

    setState((prev) => ({
      ...prev,
      balance: prev.balance + benefit.reward,
      quests: prev.quests.map((q) => (q.id === questId ? { ...q, claimed: true } : q)),
      transactions: [newTx, ...prev.transactions],
    }));

    showToast(`+R$ ${benefit.reward.toFixed(2)} de cashback creditados com sucesso!`);
  };

  // 10. Redeem Promotional Coupon
  const handleRedeemSecretCode = (code: string) => {
    const normalized = code.trim().toUpperCase();

    if (state.redeemedCodes.includes(normalized)) {
      return { success: false, message: 'Este cupom promocional já foi resgatado!' };
    }

    let reward = 0;
    let description = '';

    if (normalized === 'NURPG50' || normalized === 'NUBANK50') {
      reward = 50.00;
      description = 'Bônus de Boas-Vindas Nu RPG';
    } else if (normalized === 'CASHBACK') {
      reward = 100.00;
      description = 'Cashback Promocional NuShopping';
    } else if (normalized === 'VIP2026') {
      reward = 200.00;
      description = 'Crédito Exclusivo Cliente Ultravioleta Nu RPG';
    } else if (normalized === 'BEMVINDO') {
      reward = 150.00;
      description = 'Bônus de Portabilidade de Salário';
    } else {
      return { success: false, message: 'Cupom promocional inválido ou expirado.' };
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: 'Resgate de Cupom Promocional',
      subtitle: `${description} · Cupom ${normalized}`,
      amount: reward,
      date: getCurrentFormattedDate(),
      timestamp: Date.now(),
      category: 'admin',
      icon: 'Sparkles',
      recipientOrPayer: 'Nu RPG Promoções',
      authCode: generateAuthCode(),
      note: `Cupom resgatado: ${normalized}`,
    };

    setState((prev) => ({
      ...prev,
      balance: prev.balance + reward,
      redeemedCodes: [...prev.redeemedCodes, normalized],
      transactions: [newTx, ...prev.transactions],
    }));

    showToast(`Cupom ${normalized} resgatado! +R$ ${reward.toFixed(2)} na conta!`);
    return { success: true, message: `Cupom válido! +R$ ${reward.toFixed(2)} creditados.`, amount: reward };
  };

  // 11. Account Management Operations
  const handleMasterUpdateBalance = (newBalance: number) => {
    const diff = newBalance - state.balance;
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: 'Ajuste de Saldo em Conta',
      subtitle: diff >= 0 ? 'Crédito direto na conta corrente' : 'Débito direto na conta corrente',
      amount: diff,
      date: getCurrentFormattedDate(),
      timestamp: Date.now(),
      category: 'admin',
      icon: 'Settings',
      recipientOrPayer: 'Gestão da Conta Nu RPG',
      authCode: generateAuthCode(),
      note: `Saldo atualizado de R$ ${state.balance.toFixed(2)} para R$ ${newBalance.toFixed(2)}`,
    };

    setState((prev) => ({
      ...prev,
      balance: newBalance,
      transactions: [newTx, ...prev.transactions],
    }));

    showToast(`Saldo atualizado para R$ ${newBalance.toFixed(2)}!`);
  };

  const handleMasterAddReward = (amount: number, reason: string) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: 'Depósito em Conta Corrente',
      subtitle: reason,
      amount: amount,
      date: getCurrentFormattedDate(),
      timestamp: Date.now(),
      category: 'admin',
      icon: 'Sparkles',
      recipientOrPayer: 'Depósito / Transferência',
      authCode: generateAuthCode(),
      note: reason,
    };

    setState((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [newTx, ...prev.transactions],
    }));

    showToast(`Depósito de +R$ ${amount.toFixed(2)} creditado!`);
  };

  const handleMasterApplyPenalty = (amount: number, reason: string) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: 'Débito em Conta Corrente',
      subtitle: reason,
      amount: -amount,
      date: getCurrentFormattedDate(),
      timestamp: Date.now(),
      category: 'admin',
      icon: 'Settings',
      recipientOrPayer: 'Débito Automático',
      authCode: generateAuthCode(),
      note: reason,
    };

    setState((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
      transactions: [newTx, ...prev.transactions],
    }));

    showToast(`Débito de -R$ ${amount.toFixed(2)} lançado com sucesso!`);
  };

  const handleMasterUpdateCreditCard = (invoice: number, limit: number) => {
    setState((prev) => ({
      ...prev,
      creditCard: {
        ...prev.creditCard,
        currentInvoice: invoice,
        limit,
      },
    }));
    showToast('Fatura e limite do cartão atualizados!');
  };

  const handleMasterUpdateInvestments = (total: number, yield12m?: number, boxes?: Caixinha[]) => {
    setState((prev) => ({
      ...prev,
      investments: {
        ...prev.investments,
        total,
        ...(yield12m !== undefined ? { yield12m } : {}),
        ...(boxes ? { boxes } : {}),
      },
    }));
    showToast('Valores da tela de investimentos atualizados com sucesso!');
  };

  const handleMasterUpdatePlayerInfo = (name: string, title: string) => {
    setState((prev) => ({
      ...prev,
      playerName: name,
      playerTitle: title,
    }));
    showToast('Dados cadastrais salvos!');
  };

  const handleResetBank = () => {
    setState(INITIAL_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    showToast('Conta restaurada aos valores padrão!');
  };

  // 12. Single-File HTML Standalone Exporter
  const handleExportStandaloneHTML = () => {
    try {
      const htmlContent = generateStandaloneHTML(state);
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nu-rpg-app-${state.playerName.toLowerCase().replace(/\s+/g, '-')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Arquivo HTML do Nu RPG baixado com sucesso!');
    } catch (e) {
      console.error('Error exporting standalone HTML:', e);
      showToast('Erro ao exportar arquivo HTML!', 'error');
    }
  };

  // Count pending unclaimed benefits for tab badge
  const pendingBenefitsCount = state.quests.filter((q) => q.completed && !q.claimed).length;

  return (
    <PhoneFrame>
      {/* Toast Notification */}
      <Toast
        message={toast?.message || null}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* Fixed Nu RPG Purple Header */}
      <Header
        playerName={state.playerName}
        playerTitle={state.playerTitle}
        isBalanceHidden={state.isBalanceHidden}
        onToggleHideBalance={handleToggleHideBalance}
        onOpenMasterPanel={() => setIsMasterPanelOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
      />

      {/* Main Tab Content Screens */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeScreen
            state={state}
            onOpenPixModal={() => setIsPixModalOpen(true)}
            onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
            onOpenCardModal={() => setIsCardModalOpen(true)}
            onOpenLoanModal={() => setIsLoanModalOpen(true)}
            onOpenBoxesModal={() => setIsBoxesModalOpen(true)}
            onNavigateToTab={setActiveTab}
            onOpenMasterPanel={() => setIsMasterPanelOpen(true)}
          />
        )}

        {activeTab === 'investments' && (
          <InvestmentsScreen
            state={state}
            onOpenBoxesModal={() => setIsBoxesModalOpen(true)}
            onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
            onInvestMore={(boxId, amt) => handleDepositBox(boxId, amt)}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardsScreen
            state={state}
            onClaimQuest={handleClaimQuest}
            onRedeemSecretCode={handleRedeemSecretCode}
          />
        )}

        {activeTab === 'services' && (
          <ServicesScreen
            state={state}
            onOpenLoanModal={() => setIsLoanModalOpen(true)}
            onBuyItem={handleBuyItem}
          />
        )}
      </main>

      {/* Floating Curved Bottom Navigation Dock */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingRewardsCount={pendingBenefitsCount}
      />

      {/* Modals */}
      {isPixModalOpen && (
        <PixModal
          balance={state.balance}
          isBalanceHidden={state.isBalanceHidden}
          playerName={state.playerName}
          onClose={() => setIsPixModalOpen(false)}
          onSendPix={handleSendPix}
        />
      )}

      {isHistoryModalOpen && (
        <HistoryModal
          transactions={state.transactions}
          isBalanceHidden={state.isBalanceHidden}
          onClose={() => setIsHistoryModalOpen(false)}
          onSelectTransaction={(tx) => setSelectedReceiptTx(tx)}
        />
      )}

      {isCardModalOpen && (
        <CreditCardModal
          creditCard={state.creditCard}
          balance={state.balance}
          isBalanceHidden={state.isBalanceHidden}
          transactions={state.transactions}
          onClose={() => setIsCardModalOpen(false)}
          onPayInvoice={handlePayInvoice}
          onToggleCardBlock={handleToggleCardBlock}
        />
      )}

      {isLoanModalOpen && (
        <LoanModal
          maxLoanAmount={25000}
          onClose={() => setIsLoanModalOpen(false)}
          onContractLoan={handleContractLoan}
        />
      )}

      {isBoxesModalOpen && (
        <BoxesModal
          state={state}
          onClose={() => setIsBoxesModalOpen(false)}
          onDeposit={handleDepositBox}
          onWithdraw={handleWithdrawBox}
          onCreateBox={handleCreateBox}
        />
      )}

      {isMasterPanelOpen && (
        <MasterPanelModal
          state={state}
          onClose={() => setIsMasterPanelOpen(false)}
          onUpdateBalance={handleMasterUpdateBalance}
          onAddMasterReward={handleMasterAddReward}
          onApplyPenalty={handleMasterApplyPenalty}
          onUpdateCreditCard={handleMasterUpdateCreditCard}
          onUpdateInvestments={handleMasterUpdateInvestments}
          onUpdatePlayerInfo={handleMasterUpdatePlayerInfo}
          onResetBank={handleResetBank}
          onExportStandaloneHTML={handleExportStandaloneHTML}
        />
      )}

      {selectedReceiptTx && (
        <ReceiptModal
          transaction={selectedReceiptTx}
          onClose={() => setSelectedReceiptTx(null)}
          onCopyAuthCode={(code) => {
            navigator.clipboard?.writeText(code);
            showToast('Código de autenticação copiado!');
          }}
          onDeleteTransaction={handleDeleteTransaction}
          onDuplicateTransaction={handleDuplicateTransaction}
        />
      )}

      {isHelpModalOpen && (
        <HelpModal
          onClose={() => setIsHelpModalOpen(false)}
          onOpenMasterPanel={() => {
            setIsHelpModalOpen(false);
            setIsMasterPanelOpen(true);
          }}
        />
      )}
    </PhoneFrame>
  );
}
