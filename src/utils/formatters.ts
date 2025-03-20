
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

export const formatCryptoAmount = (value: number, symbol: string): string => {
  return `${value.toFixed(value < 0.1 ? 8 : 4)} ${symbol}`;
};

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.substring(0, chars)}...${address.substring(
    address.length - chars
  )}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString(
    'pt-BR',
    { hour: '2-digit', minute: '2-digit' }
  )}`;
};

export const getTransactionTypeColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'buy':
      return 'text-crypto-green';
    case 'sell':
      return 'text-crypto-red';
    case 'transfer':
      return 'text-crypto-blue';
    default:
      return 'text-crypto-lightText';
  }
};

export const getPercentageColor = (value: number): string => {
  if (value > 0) return 'text-crypto-green';
  if (value < 0) return 'text-crypto-red';
  return 'text-crypto-mutedText';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
