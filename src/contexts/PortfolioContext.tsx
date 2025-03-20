
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Portfolio, Transaction, Cryptocurrency } from '../types';

// Mock data for initial state
const mockPortfolios: Portfolio[] = [
  {
    id: 'portfolio1',
    name: 'Portfolio brabo 2.0',
    balance: 250452.97,
    change30d: {
      value: 3150.99,
      percentage: 12.10,
    },
    totalGain: 3150.99,
    bestPerformer: {
      id: 'tao',
      name: 'TAO',
      symbol: 'Bittensor',
      gain: 3150.99,
    },
    worstPerformer: {
      id: 'tao2',
      name: 'TAO',
      symbol: 'Bittensor',
      loss: -750.24,
    },
    assets: [
      {
        id: 'rio',
        name: 'RIO',
        symbol: 'Realio Network',
        logo: '/public/lovable-uploads/2582f532-952f-4ef6-85a9-e90916336631.png',
        price: 37880.84,
        change24h: 9999.99,
        change7d: 24.45,
        amount: 0.04,
        valueInBRL: 37880.84,
        percentOfPortfolio: 15.32,
      }
    ],
    allocationData: [
      { name: 'BTC', value: 50, percentage: 50, color: '#FF5B00' },
      { name: 'SOL', value: 20, percentage: 20, color: '#F7931A' },
      { name: 'ETH', value: 10, percentage: 10, color: '#3C64F3' },
      { name: 'Outros', value: 20, percentage: 20, color: '#999999' },
    ],
    transactions: [
      {
        id: 'tx1',
        type: 'buy',
        cryptoId: 'rio',
        cryptoName: 'RIO',
        cryptoSymbol: 'Realio Network',
        amount: 28.450,
        price: 0.35,
        fees: 0.23,
        total: 37880.84,
        date: '2025-02-18T09:35:00',
      },
      {
        id: 'tx2',
        type: 'sell',
        cryptoId: 'rio',
        cryptoName: 'RIO',
        cryptoSymbol: 'Realio Network',
        amount: 19.121,
        price: 0.35,
        fees: 0.23,
        total: 20591.45,
        date: '2025-02-18T09:35:00',
      },
      {
        id: 'tx3',
        type: 'buy',
        cryptoId: 'rio',
        cryptoName: 'RIO',
        cryptoSymbol: 'Realio Network',
        amount: 28.450,
        price: 0.35,
        fees: 0.23,
        total: 37880.84,
        date: '2025-02-18T09:35:00',
      },
    ],
  },
  {
    id: 'portfolio2',
    name: 'Portfolio principal',
    balance: 1740.00,
    change30d: {
      value: 140.00,
      percentage: 8.75,
    },
    totalGain: 140.00,
    bestPerformer: {
      id: 'btc',
      name: 'BTC',
      symbol: 'Bitcoin',
      gain: 100.00,
    },
    worstPerformer: {
      id: 'eth',
      name: 'ETH',
      symbol: 'Ethereum',
      loss: -50.00,
    },
    assets: [],
    allocationData: [
      { name: 'BTC', value: 70, percentage: 70, color: '#FF5B00' },
      { name: 'ETH', value: 30, percentage: 30, color: '#3C64F3' },
    ],
    transactions: [],
  },
];

// Mock chart data
export const generateChartData = (timeframe: string) => {
  const now = new Date();
  const data = [];
  let days = 1;
  
  switch(timeframe) {
    case '24h':
      days = 1;
      break;
    case '7d':
      days = 7;
      break;
    case '30d':
      days = 30;
      break;
    case '90d':
      days = 90;
      break;
    case 'all':
      days = 365;
      break;
    default:
      days = 30;
  }
  
  for (let i = 0; i < days * 24; i++) {
    const date = new Date(now.getTime() - (days * 24 - i) * 60 * 60 * 1000);
    const baseValue = 200000;
    const noise = Math.random() * 50000 - 25000;
    const trend = i / (days * 24) * 50000;
    const value = baseValue + noise + trend;
    
    data.push({
      time: date.toISOString(),
      value: value,
    });
  }
  
  return data;
};

interface PortfolioContextType {
  portfolios: Portfolio[];
  currentPortfolio: Portfolio;
  setCurrentPortfolio: (portfolio: Portfolio) => void;
  addPortfolio: (name: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  getChartData: (timeframe: string) => { time: string; value: number }[];
  getCryptocurrencyDetails: (id: string) => Cryptocurrency | undefined;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(mockPortfolios);
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio>(mockPortfolios[0]);

  const addPortfolio = (name: string) => {
    const newPortfolio: Portfolio = {
      id: `portfolio${portfolios.length + 1}`,
      name,
      balance: 0,
      change30d: {
        value: 0,
        percentage: 0,
      },
      totalGain: 0,
      bestPerformer: {
        id: '',
        name: '',
        symbol: '',
        gain: 0,
      },
      worstPerformer: {
        id: '',
        name: '',
        symbol: '',
        loss: 0,
      },
      assets: [],
      allocationData: [],
      transactions: [],
    };
    
    setPortfolios([...portfolios, newPortfolio]);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: `tx${currentPortfolio.transactions.length + 1}`,
    };
    
    const updatedPortfolio = {
      ...currentPortfolio,
      transactions: [...currentPortfolio.transactions, newTransaction],
    };
    
    setCurrentPortfolio(updatedPortfolio);
    setPortfolios(portfolios.map(p => p.id === currentPortfolio.id ? updatedPortfolio : p));
  };

  const updateTransaction = (transaction: Transaction) => {
    const updatedTransactions = currentPortfolio.transactions.map(t => 
      t.id === transaction.id ? transaction : t
    );
    
    const updatedPortfolio = {
      ...currentPortfolio,
      transactions: updatedTransactions,
    };
    
    setCurrentPortfolio(updatedPortfolio);
    setPortfolios(portfolios.map(p => p.id === currentPortfolio.id ? updatedPortfolio : p));
  };

  const deleteTransaction = (id: string) => {
    const updatedTransactions = currentPortfolio.transactions.filter(t => t.id !== id);
    
    const updatedPortfolio = {
      ...currentPortfolio,
      transactions: updatedTransactions,
    };
    
    setCurrentPortfolio(updatedPortfolio);
    setPortfolios(portfolios.map(p => p.id === currentPortfolio.id ? updatedPortfolio : p));
  };

  const getChartData = (timeframe: string) => {
    return generateChartData(timeframe);
  };

  const getCryptocurrencyDetails = (id: string) => {
    return currentPortfolio.assets.find(asset => asset.id === id);
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        currentPortfolio,
        setCurrentPortfolio,
        addPortfolio,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getChartData,
        getCryptocurrencyDetails,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
