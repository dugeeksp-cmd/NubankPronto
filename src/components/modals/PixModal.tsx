import React, { useState } from 'react';
import {
  X,
  ArrowUpDown,
  QrCode,
  Copy,
  Check,
  Send,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { QUICK_PIX_CONTACTS } from '../../data/initialData';
import { formatCurrency } from '../../utils/formatters';

interface PixModalProps {
  balance: number;
  isBalanceHidden: boolean;
  playerName: string;
  onClose: () => void;
  onSendPix: (amount: number, recipientName: string, pixKey: string, note: string) => boolean;
}

export const PixModal: React.FC<PixModalProps> = ({
  balance,
  isBalanceHidden,
  playerName,
  onClose,
  onSendPix,
}) => {
  const [activeTab, setActiveTab] = useState<'transfer' | 'qrcode'>('transfer');
  const [amountStr, setAmountStr] = useState('');
  const [recipient, setRecipient] = useState(QUICK_PIX_CONTACTS[0]);
  const [customKey, setCustomKey] = useState('');
  const [customName, setCustomName] = useState('');
  const [isUsingCustom, setIsUsingCustom] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ amount: number; recipient: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const cleanName = playerName.toLowerCase().replace(/\s+/g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const myPixKey = `${cleanName || 'lucas.santos'}@nurpg.com.br`;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
    setAmountStr(val);
    setError(null);
  };

  const handleQuickAmount = (val: number) => {
    setAmountStr(val.toFixed(2));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verificação de limite Pix excedido
    setError('Atenção: O seu limite de transferência Pix excedeu o teto mensal de R$ 30.000,00. O ajuste de limite estará disponível para alteração apenas no próximo mês.');
    return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      setError('Por favor, informe um valor válido maior que zero.');
      return;
    }

    if (amount > balance) {
      setError(`Saldo insuficiente! Você possui ${formatCurrency(balance)} disponíveis.`);
      return;
    }

    const finalRecipient = isUsingCustom
      ? customName.trim() || 'Destinatário'
      : recipient.name;
    const finalKey = isUsingCustom ? customKey.trim() || 'chave-aleatoria' : recipient.key;

    const ok = onSendPix(amount, finalRecipient, finalKey, note.trim() || 'Transferência Pix');
    if (ok) {
      setSuccessData({ amount, recipient: finalRecipient });
    }
  };

  const handleCopyMyKey = () => {
    navigator.clipboard?.writeText(myPixKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
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
              <h3 className="text-base font-bold">Área Pix · Nu RPG</h3>
              <p className="text-[11px] text-purple-200">
                Saldo: <strong className="text-white">{formatCurrency(balance, isBalanceHidden)}</strong>
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

        {/* Tab switchers */}
        <div className="flex border-b border-neutral-100 bg-neutral-50 px-4 pt-2">
          <button
            onClick={() => {
              setActiveTab('transfer');
              setSuccessData(null);
            }}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'transfer'
                ? 'border-[#820ad1] text-[#820ad1] bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>Transferir</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('qrcode');
              setSuccessData(null);
            }}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'qrcode'
                ? 'border-[#820ad1] text-[#820ad1] bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Cobrar / QR Code</span>
          </button>
        </div>

        {/* Success View */}
        {successData ? (
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-in zoom-in duration-200">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-extrabold text-neutral-900">
              Transferência Pix Realizada!
            </h3>
            <p className="text-xs text-neutral-600">
              Você enviou <strong className="text-neutral-900 font-bold">{formatCurrency(successData.amount)}</strong> para{' '}
              <strong className="text-[#820ad1] font-bold">{successData.recipient}</strong>.
            </p>
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-purple-900 font-medium">
              O valor foi debitado da sua conta Nu RPG e já está disponível para o destinatário.
            </div>
            <button
              onClick={() => {
                setSuccessData(null);
                setAmountStr('');
                setNote('');
                onClose();
              }}
              className="w-full bg-[#820ad1] hover:bg-[#7208b8] active:scale-95 text-white font-bold text-xs py-3 rounded-full transition-all shadow-sm"
            >
              Concluir
            </button>
          </div>
        ) : activeTab === 'transfer' ? (
          /* Transfer Form */
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
            {/* Banner de Aviso de Limite Mensal Excedido (Estilo Notificação Nubank) */}
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 shadow-2xs animate-in fade-in duration-200">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-950 leading-tight">
                    Limite Pix Mensal Atingido
                  </h4>
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded-md">
                    Bloqueado
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 mt-1 leading-snug">
                  <strong>Atenção:</strong> O seu limite de transferência Pix excedeu o teto mensal de <strong>R$ 30.000,00</strong>. O ajuste de limite estará disponível para alteração apenas no próximo mês.
                </p>
                <div className="mt-2 pt-2 border-t border-amber-200/80 text-[10px] text-amber-800">
                  Diretriz de Segurança do Banco Central · Renovação no 1º dia útil do mês
                </div>
              </div>
            </div>

            {/* Amount input */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Qual é o valor da transferência?
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">
                  R$
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amountStr}
                  onChange={handleAmountChange}
                  placeholder="0,00"
                  className="w-full pl-10 pr-4 py-3 bg-[#f0f1f5] focus:bg-white focus:ring-2 focus:ring-[#820ad1] border border-transparent rounded-2xl text-lg font-black text-neutral-900 outline-none transition-all tabular-nums"
                  autoFocus
                />
              </div>

              {/* Quick amount shortcuts */}
              <div className="flex gap-1.5 mt-2 overflow-x-auto no-scrollbar py-0.5">
                {[10, 50, 100, 250, 500].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAmount(val)}
                    className="text-xs font-bold px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full shrink-0 transition-colors"
                  >
                    +R$ {val}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleQuickAmount(balance)}
                  className="text-xs font-bold px-2.5 py-1 bg-purple-100 text-[#820ad1] hover:bg-purple-200 rounded-full shrink-0 transition-colors"
                >
                  Saldo Total ({formatCurrency(balance, isBalanceHidden)})
                </button>
              </div>
            </div>

            {/* Recipient Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  Para quem deseja transferir?
                </label>
                <button
                  type="button"
                  onClick={() => setIsUsingCustom(!isUsingCustom)}
                  className="text-xs text-[#820ad1] hover:underline font-bold"
                >
                  {isUsingCustom ? 'Ver contatos frequentes' : '+ Outra chave Pix'}
                </button>
              </div>

              {!isUsingCustom ? (
                /* Quick Contacts List */
                <div className="space-y-1.5 max-h-44 overflow-y-auto no-scrollbar pr-1">
                  {QUICK_PIX_CONTACTS.map((contact) => (
                    <div
                      key={contact.key}
                      onClick={() => setRecipient(contact)}
                      className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        recipient.key === contact.key
                          ? 'border-[#820ad1] bg-purple-50/60 shadow-2xs ring-1 ring-[#820ad1]'
                          : 'border-neutral-100 bg-white hover:border-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl p-1.5 bg-neutral-100 rounded-xl">
                          {contact.avatar}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                            {contact.name}
                          </h4>
                          <span className="text-[10px] text-neutral-500 font-medium">
                            {contact.role} · <code className="text-neutral-400">{contact.key}</code>
                          </span>
                        </div>
                      </div>
                      {recipient.key === contact.key && (
                        <div className="w-5 h-5 rounded-full bg-[#820ad1] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Custom Key Inputs */
                <div className="space-y-2 p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Nome do Destinatário ou Empresa
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo Lima ou Mercado Silva"
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 outline-none focus:border-[#820ad1]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Chave Pix (CPF/CNPJ, E-mail, Celular ou Aleatória)
                    </label>
                    <input
                      type="text"
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value)}
                      placeholder="pix@mercadosilva.com.br"
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 outline-none focus:border-[#820ad1]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Note / Description */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Descrição ou identificador (Opcional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex: Pagamento de conta, Churrasco, Aluguel..."
                className="w-full px-3 py-2 bg-[#f0f1f5] focus:bg-white focus:ring-1 focus:ring-[#820ad1] rounded-xl text-xs text-neutral-900 outline-none"
              />
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {['Pagamento de conta', 'Churrasco', 'Aluguel', 'Mercado'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setNote(tag)}
                    className="text-[10px] font-medium px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 font-semibold flex items-center gap-2 animate-in fade-in duration-150">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full font-bold text-xs py-3.5 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 mt-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-600 border border-neutral-300 cursor-not-allowed"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Transferência Indisponível (Limite Excedido)</span>
            </button>
          </form>
        ) : (
          /* Receive / QR Code View */
          <div className="p-6 text-center space-y-4">
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                Seu QR Code Pix Nu RPG
              </h4>
              <p className="text-xs text-neutral-500">
                Apresente este código para receber pagamentos instantâneos na sua conta
              </p>
            </div>

            {/* QR Code SVG Representation */}
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border-2 border-dashed border-[#820ad1] shadow-inner flex flex-col items-center justify-center relative">
              <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-900">
                <rect width="100" height="100" fill="white" />
                <rect x="5" y="5" width="26" height="26" fill="#820ad1" rx="4" />
                <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
                <rect x="13" y="13" width="10" height="10" fill="#820ad1" rx="1" />

                <rect x="69" y="5" width="26" height="26" fill="#820ad1" rx="4" />
                <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
                <rect x="77" y="13" width="10" height="10" fill="#820ad1" rx="1" />

                <rect x="5" y="69" width="26" height="26" fill="#820ad1" rx="4" />
                <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
                <rect x="13" y="77" width="10" height="10" fill="#820ad1" rx="1" />

                <rect x="36" y="8" width="6" height="6" fill="#171717" />
                <rect x="46" y="8" width="6" height="6" fill="#171717" />
                <rect x="56" y="8" width="6" height="6" fill="#171717" />
                <rect x="36" y="18" width="6" height="6" fill="#171717" />
                <rect x="48" y="22" width="6" height="6" fill="#171717" />

                <rect x="8" y="38" width="6" height="6" fill="#171717" />
                <rect x="18" y="44" width="6" height="6" fill="#171717" />
                <rect x="36" y="38" width="10" height="10" fill="#820ad1" rx="2" />
                <rect x="52" y="38" width="8" height="8" fill="#171717" />
                <rect x="68" y="38" width="8" height="8" fill="#171717" />
                <rect x="82" y="44" width="8" height="8" fill="#171717" />

                <rect x="38" y="56" width="8" height="8" fill="#171717" />
                <rect x="54" y="56" width="12" height="12" fill="#820ad1" rx="2" />
                <rect x="74" y="56" width="8" height="8" fill="#171717" />

                <rect x="36" y="76" width="6" height="6" fill="#171717" />
                <rect x="48" y="72" width="6" height="6" fill="#171717" />
                <rect x="60" y="80" width="8" height="8" fill="#171717" />
                <rect x="76" y="74" width="8" height="8" fill="#171717" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-[#820ad1] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md">
                  nu
                </span>
              </div>
            </div>

            {/* Pix Key Box */}
            <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-100 flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                  Chave Pix Vinculada à Conta
                </span>
                <span className="text-xs font-mono font-bold text-neutral-800 break-all">
                  {myPixKey}
                </span>
              </div>
              <button
                onClick={handleCopyMyKey}
                className="p-2 hover:bg-neutral-200 active:scale-90 rounded-xl text-[#820ad1] transition-all ml-2 shrink-0"
                title="Copiar Chave Pix"
              >
                {copiedKey ? <Check className="w-5 h-5 text-emerald-600 stroke-[3]" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {copiedKey && (
              <p className="text-xs font-bold text-emerald-600 animate-in fade-in duration-100">
                ✓ Chave Pix copiada com sucesso!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
