import { BankState, Benefit, Transaction } from '../types/bank';

export const STORAGE_KEY = 'rpg_banco_nubank_v3_clean';

export const QUICK_PIX_CONTACTS = [
  {
    name: 'Fernanda Ribeiro Morelo',
    role: 'Transferência frequente',
    key: 'fernanda.morelo@email.com',
    avatar: '👩‍💼',
  },
  {
    name: 'GOOGLE BRASIL PAGAMENTOS LTDA.',
    role: 'Serviços de Tecnologia',
    key: '06.990.590/0001-23',
    avatar: '🏢',
  },
  {
    name: 'Das-Simples Nacional',
    role: 'Tributos e Impostos',
    key: 'receita.federal@fazenda.gov.br',
    avatar: '🏛️',
  },
  {
    name: 'ValueHost SA',
    role: 'Hospedagem & Nuvem',
    key: 'financeiro@valuehost.com.br',
    avatar: '💻',
  },
  {
    name: 'Mercado Silva',
    role: 'Alimentação & Mercado',
    key: 'pix@mercadosilva.com.br',
    avatar: '🛒',
  },
  {
    name: 'Posto Shell',
    role: 'Combustível & Serviços',
    key: 'financeiro@postoshell.com.br',
    avatar: '⛽',
  },
  {
    name: 'Padaria Central',
    role: 'Padaria & Confeitaria',
    key: 'contato@padariacentral.com.br',
    avatar: '☕',
  },
  {
    name: 'Ana Clara Silva',
    role: 'Transferência frequente',
    key: 'ana.clara@email.com',
    avatar: '👩',
  },
  {
    name: 'Carlos Eduardo Lima',
    role: 'Transferência frequente',
    key: 'carlos.eduardo@email.com',
    avatar: '👨‍💼',
  },
];

// O histórico do extrato DEVE conter exatamente estes lançamentos reais e nenhum outro:
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'ValueHost SA',
    subtitle: 'Pagamento de hospedagem · Débito em conta',
    amount: -567.78,
    date: '08 NOV às 20:45',
    timestamp: new Date('2026-11-08T20:45:00').getTime(),
    category: 'pix',
    icon: 'ArrowUpRight',
    recipientOrPayer: 'ValueHost SA',
    pixKey: 'financeiro@valuehost.com.br',
    authCode: 'E820AD1-08NOV-VHOST-2045',
    note: 'Pagamento de hospedagem ValueHost SA',
  },
  {
    id: 'tx-2',
    title: 'Das-Simples Nacional',
    subtitle: 'Pagamento de imposto · Guia Arrecadação',
    amount: -16267.78,
    date: '08 NOV às 20:40',
    timestamp: new Date('2026-11-08T20:40:00').getTime(),
    category: 'transfer',
    icon: 'FileText',
    recipientOrPayer: 'Das-Simples Nacional',
    authCode: 'E820AD1-08NOV-SIMPLES-2040',
    note: 'Pagamento de imposto Das-Simples Nacional',
  },
  {
    id: 'tx-3',
    title: 'GOOGLE BRASIL PAGAMENTOS LTDA.',
    subtitle: 'Transferência enviada · Serviços de nuvem',
    amount: -5039.90,
    date: '08 NOV às 20:37',
    timestamp: new Date('2026-11-08T20:37:00').getTime(),
    category: 'pix',
    icon: 'ArrowUpRight',
    recipientOrPayer: 'GOOGLE BRASIL PAGAMENTOS LTDA.',
    pixKey: '06.990.590/0001-23',
    authCode: 'E820AD1-08NOV-GOOG-2037',
    note: 'Transferência enviada para GOOGLE BRASIL PAGAMENTOS LTDA.',
  },
  {
    id: 'tx-4',
    title: 'Fernanda Ribeiro Morelo',
    subtitle: 'Envio Pix · Transferência enviada',
    amount: -5946.87,
    date: '08 NOV às 20:22',
    timestamp: new Date('2026-11-08T20:22:00').getTime(),
    category: 'pix',
    icon: 'ArrowUpRight',
    recipientOrPayer: 'Fernanda Ribeiro Morelo',
    pixKey: 'fernanda.morelo@email.com',
    authCode: 'E820AD1-08NOV-FERN-2022',
    note: 'Envio Pix para Fernanda Ribeiro Morelo',
  },
  {
    id: 'tx-5',
    title: 'Pagamento de Fatura',
    subtitle: 'Fatura de Cartão · Cartão Nu RPG Platinum',
    amount: -1746.87,
    date: '08 NOV às 19:10',
    timestamp: new Date('2026-11-08T19:10:00').getTime(),
    category: 'card',
    icon: 'CreditCard',
    recipientOrPayer: 'Nu RPG Cartões S.A.',
    authCode: 'E820AD1-08NOV-FAT-1910',
    note: 'Pagamento de fatura do cartão de crédito',
  },
  {
    id: 'tx-6',
    title: 'Recebimento Pix',
    subtitle: 'Depósito em conta · Transferência recebida',
    amount: 60000.00,
    date: '08 NOV às 15:00',
    timestamp: new Date('2026-11-08T15:00:00').getTime(),
    category: 'transfer',
    icon: 'ArrowDownLeft',
    recipientOrPayer: 'Depósito via Pix Recebido',
    authCode: 'E820AD1-08NOV-PIX-1500',
    note: 'Depósito em conta corrente recebido',
  },
];

export const INITIAL_BENEFITS: Benefit[] = [
  {
    id: 'b-1',
    title: 'Portabilidade de Salário para o Nu RPG',
    description: 'Receba seu salário todo mês no Nu RPG e tenha limites flexíveis de cartão.',
    reward: 120.00,
    category: 'Cashback',
    completed: true,
    claimed: false,
    icon: 'Shield',
  },
  {
    id: 'b-2',
    title: 'Ativação do Débito Automático',
    description: 'Cadastre suas contas de consumo (energia, internet ou água) no débito automático.',
    reward: 50.00,
    category: 'Nucoin',
    completed: false,
    claimed: false,
    icon: 'Compass',
  },
  {
    id: 'b-3',
    title: 'Acelere suas Caixinhas do Mês',
    description: 'Deposite a partir de R$ 500 no Plano de Aposentadoria e receba bônus.',
    reward: 200.00,
    category: 'Pontos',
    completed: false,
    claimed: false,
    icon: 'Flame',
  },
];

export const INITIAL_STATE: BankState = {
  playerName: 'Lucas Silva Santos',
  playerTitle: 'Agência 0001 · Conta 1849201-4',
  balance: 30430.80,
  creditCard: {
    currentInvoice: 1420.50,
    limit: 15000.00,
    dueDate: '15 NOV',
    bestPurchaseDate: '08 NOV',
    isCardBlocked: false,
    virtualCardNumber: '5502 •••• •••• 8819',
    virtualCardCvv: '741',
  },
  investments: {
    total: 27163.85,
    yield12m: 3464.20,
    cdiYield: 112,
    boxes: [
      {
        id: 'box-1',
        title: 'Reserva de Emergência',
        amount: 20250.00,
        target: 25000.00,
        yieldRate: '100% do CDI',
        emoji: '💰',
      },
      {
        id: 'box-2',
        title: 'Reserva para Viagem',
        amount: 1800.00,
        target: 10000.00,
        yieldRate: '100% do CDI',
        emoji: '✈️',
      },
      {
        id: 'box-3',
        title: 'Plano de Aposentadoria',
        amount: 5113.85,
        target: 50000.00,
        yieldRate: '105% do CDI',
        emoji: '📈',
      },
    ],
  },
  transactions: INITIAL_TRANSACTIONS,
  isBalanceHidden: false,
  activeTab: 'home',
  quests: INITIAL_BENEFITS,
  redeemedCodes: [],
};

const FANTASY_KEYWORDS = [
  'taverna', 'gnomo', 'ferreiro', 'alquimista', 'espada', 'esgotos',
  'banquete', 'hidromel', 'cripta', 'mágico', 'magico', 'lua cheia',
  'arcano', 'aventureiro', 'mímico', 'mimico', 'poção', 'pocao',
  'pergaminho', 'élfica', 'elfica', 'tocha', 'guilda', 'missão', 'missao', 'mestre',
  'tabelião', 'baldur', 'forja', 'anões', 'armadura'
];

export function containsFantasyTerms(data: string | object): boolean {
  try {
    const text = typeof data === 'string' ? data.toLowerCase() : JSON.stringify(data).toLowerCase();
    return FANTASY_KEYWORDS.some((kw) => text.includes(kw));
  } catch {
    return false;
  }
}
