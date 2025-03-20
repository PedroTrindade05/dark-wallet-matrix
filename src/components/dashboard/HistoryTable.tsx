
import React, { useState } from 'react';
import { ChevronDown, Search, RefreshCw } from 'lucide-react';
import { formatDateTime, formatCurrency, formatCryptoAmount } from '../../utils/formatters';
import { Transaction, TransactionType } from '../../types';

interface HistoryTableProps {
  transactions: Transaction[];
  onTransactionClick: (transaction: Transaction) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ 
  transactions, 
  onTransactionClick 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesSearch = 
      tx.cryptoName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tx.cryptoSymbol.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  const getTypeColor = (type: TransactionType) => {
    switch (type) {
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

  const getTypeBackground = (type: TransactionType) => {
    switch (type) {
      case 'buy':
        return 'bg-crypto-green';
      case 'sell':
        return 'bg-crypto-red';
      case 'transfer':
        return 'bg-crypto-blue';
      default:
        return 'bg-crypto-mutedText';
    }
  };

  const getTypeLabel = (type: TransactionType) => {
    switch (type) {
      case 'buy':
        return 'Compra';
      case 'sell':
        return 'Venda';
      case 'transfer':
        return 'Transferência';
      default:
        return 'Desconhecido';
    }
  };

  const typeOptions: { label: string; value: TransactionType | 'all' }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Compra', value: 'buy' },
    { label: 'Venda', value: 'sell' },
    { label: 'Transferência', value: 'transfer' },
  ];

  return (
    <div className="bg-crypto-darkBg border border-crypto-darkBorder rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-crypto-darkBorder">
        <div className="relative">
          <div
            className="flex items-center justify-between gap-2 px-3 py-2 bg-crypto-darkCard border border-crypto-darkBorder rounded-lg cursor-pointer min-w-[180px]"
            onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
          >
            <span className="text-sm">
              {typeFilter === 'all' ? 'Selecionar tipo' : getTypeLabel(typeFilter)}
            </span>
            <ChevronDown
              size={16}
              className={`text-crypto-mutedText transition-transform duration-200 ${
                isTypeFilterOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
          
          {isTypeFilterOpen && (
            <div className="absolute left-0 top-full mt-1 w-full z-10 bg-crypto-darkCard border border-crypto-darkBorder rounded-md shadow-lg animate-fade-in">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  className={`w-full text-left px-3 py-2 hover:bg-crypto-darkBg/50 transition-colors ${
                    typeFilter === option.value ? 'bg-crypto-darkBg/30' : ''
                  }`}
                  onClick={() => {
                    setTypeFilter(option.value);
                    setIsTypeFilterOpen(false);
                  }}
                >
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-crypto-mutedText" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar criptomoeda"
              className="pl-10 pr-4 py-2 bg-crypto-darkCard border border-crypto-darkBorder rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-crypto-orange/30 input-crypto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="flex items-center justify-center h-10 w-10 rounded-lg bg-crypto-darkCard border border-crypto-darkBorder hover:bg-crypto-darkCard/70 transition-colors">
            <RefreshCw size={18} className="text-crypto-lightText" />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-crypto-mutedText text-xs font-medium uppercase">
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Criptomoeda</th>
              <th className="px-4 py-3 text-right">Preço do token</th>
              <th className="px-4 py-3 text-right">Valor transacionado<br/><span className="text-[10px] normal-case">Valor em Token</span></th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr 
                  key={tx.id}
                  className="border-t border-crypto-darkBorder hover:bg-crypto-darkBg/40 cursor-pointer transition-colors"
                  onClick={() => onTransactionClick(tx)}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 ${getTypeBackground(tx.type)} rounded-full flex items-center justify-center text-white`}>
                        {tx.type === 'buy' && 'C'}
                        {tx.type === 'sell' && 'V'}
                        {tx.type === 'transfer' && 'T'}
                      </div>
                      <div>
                        <div className={`font-medium ${getTypeColor(tx.type)}`}>
                          {getTypeLabel(tx.type)} realizada
                        </div>
                        <div className="text-xs text-crypto-mutedText">
                          {formatDateTime(tx.date)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-crypto-darkCard rounded-full flex items-center justify-center">
                        <div className="text-xs font-bold">{tx.cryptoSymbol.substring(0, 2)}</div>
                      </div>
                      <div>
                        <div className="font-medium">{tx.cryptoName}</div>
                        <div className="text-xs text-crypto-mutedText">{tx.cryptoSymbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {formatCurrency(tx.price)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className={`font-medium ${getTypeColor(tx.type)}`}>
                      {tx.type === 'buy' ? '+' : '-'}{formatCryptoAmount(tx.amount, tx.cryptoSymbol.split(' ')[0])}
                    </div>
                    <div className="text-xs text-crypto-mutedText">
                      {formatCurrency(tx.total)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-crypto-mutedText">
                  Nenhuma transação encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
