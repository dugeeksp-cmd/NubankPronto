/**
 * Format number as Brazilian Real currency (e.g. R$ 8.680,61)
 */
export function formatCurrency(value: number, isHidden: boolean = false): string {
  if (isHidden) {
    return 'R$ •••••';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format number as plain BRL value without currency symbol
 */
export function formatValueOnly(value: number, isHidden: boolean = false): string {
  if (isHidden) {
    return '•••••';
  }
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Generate a pseudo-random transaction auth code
 */
export function generateAuthCode(): string {
  const chars = '0123456789ABCDEF';
  let code = '';
  for (let i = 0; i < 24; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Format date for transactions
 */
export function getCurrentFormattedDate(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = now.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `Hoje, ${hours}:${minutes}`;
}
