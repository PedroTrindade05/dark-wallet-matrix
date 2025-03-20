
export type TransactionType = 'buy' | 'sell' | 'transfer';

export interface Transaction {
  id: string;
  type: TransactionType;
  cryptoId: string;
  cryptoName: string;
  cryptoSymbol: string;
  amount: number;
  price: number;
  fees: number;
  total: number;
  date: string;
}

export interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  price: number;
  change24h: number;
  change7d: number;
  amount: number;
  valueInBRL: number;
  percentOfPortfolio: number;
}

export interface Portfolio {
  id: string;
  name: string;
  balance: number;
  change30d: {
    value: number;
    percentage: number;
  };
  totalGain: number;
  bestPerformer: {
    id: string;
    name: string;
    symbol: string;
    gain: number;
  };
  worstPerformer: {
    id: string;
    name: string;
    symbol: string;
    loss: number;
  };
  assets: Cryptocurrency[];
  allocationData: {
    name: string;
    value: number;
    percentage: number;
    color: string;
  }[];
  transactions: Transaction[];
}

export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface TimeFilterOption {
  label: string;
  value: string;
}
