export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number; // positive for incoming, negative for outgoing
  date: string;
  timestamp: number;
  category: 'pix' | 'card' | 'transfer' | 'store' | 'admin' | 'loan' | 'box';
  icon: string;
  recipientOrPayer?: string;
  pixKey?: string;
  authCode: string;
  note?: string;
}

export interface Caixinha {
  id: string;
  title: string;
  amount: number;
  target: number;
  yieldRate: string;
  emoji: string;
}

export interface CreditCardData {
  currentInvoice: number;
  limit: number;
  dueDate: string;
  bestPurchaseDate: string;
  isCardBlocked: boolean;
  virtualCardNumber: string;
  virtualCardCvv: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: 'Cashback' | 'Nucoin' | 'Pontos' | 'Parceiros';
  completed: boolean;
  claimed: boolean;
  icon: string;
}

export interface BankState {
  playerName: string;
  playerTitle: string;
  balance: number;
  creditCard: CreditCardData;
  investments: {
    total: number;
    yield12m: number;
    cdiYield: number;
    boxes: Caixinha[];
  };
  transactions: Transaction[];
  isBalanceHidden: boolean;
  activeTab: 'home' | 'investments' | 'rewards' | 'services';
  quests: Benefit[]; // kept as 'quests' in storage to preserve saved localStorage state structure!
  redeemedCodes: string[];
}
