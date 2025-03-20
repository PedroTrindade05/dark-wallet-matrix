
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, MoreHorizontal, Plus } from 'lucide-react';
import Header from '../components/layout/Header';
import HistoryTable from '../components/dashboard/HistoryTable';
import TransactionModal from '../components/modals/TransactionModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import { usePortfolio } from '../contexts/PortfolioContext';
import { formatCurrency, formatCryptoAmount } from '../utils/formatters';
import { Transaction } from '../types';

const CryptoDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentPortfolio, getCryptocurrencyDetails } = usePortfolio();
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionModalMode, setTransactionModalMode] = useState<'add' | 'edit'>('add');
  const [showPasswordVisibility, setShowPasswordVisibility] = useState(false);

  const cryptoDetails = getCryptocurrencyDetails(id || '');
  
  if (!cryptoDetails) {
    return (
      <div className="flex flex-col min-h-screen bg-crypto-darkBg text-crypto-lightText">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Criptomoeda não encontrada</h1>
            <button 
              onClick={() => navigate('/')}
              className="btn-primary px-6 py-2 rounded-lg"
            >
              Voltar para Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cryptoTransactions = currentPortfolio.transactions.filter(
    tx => tx.cryptoId === cryptoDetails.id
  );

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
    setTransactionModalMode('edit');
  };

  return (
    <div className="flex flex-col min-h-screen bg-crypto-darkBg text-crypto-lightText">
      <Header />
      
      <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-crypto-darkCard rounded-full flex items-center justify-center overflow-hidden">
              {cryptoDetails.logo ? (
                <img src={cryptoDetails.logo} alt={cryptoDetails.name} className="h-8 w-8" />
              ) : (
                <div className="text-lg font-bold">{cryptoDetails.symbol.substring(0, 2)}</div>
              )}
            </div>
            
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {cryptoDetails.name}
                <div className="text-crypto-mutedText relative">
                  {showPasswordVisibility ? (
                    <span className="text-xl">•••</span>
                  ) : (
                    <span className="text-xl">{formatCurrency(cryptoDetails.valueInBRL)}</span>
                  )}
                  <button 
                    className="ml-2 text-crypto-mutedText hover:text-crypto-lightText transition-colors"
                    onClick={() => setShowPasswordVisibility(!showPasswordVisibility)}
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </h1>
              <p className="text-crypto-mutedText">{cryptoDetails.symbol}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={() => {
                setSelectedTransaction(null);
                setTransactionModalMode('add');
                setShowTransactionModal(true);
              }}
            >
              <Plus size={16} />
              <span>Adicionar transação</span>
            </button>
            
            <button className="h-10 w-10 rounded-lg flex items-center justify-center bg-crypto-darkCard border border-crypto-darkBorder hover:bg-crypto-darkCard/70 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card-gradient p-4">
            <h3 className="text-sm text-crypto-mutedText mb-1">Quantidade</h3>
            <div className="text-2xl font-bold">{formatCryptoAmount(cryptoDetails.amount, cryptoDetails.symbol.split(' ')[0])}</div>
          </div>
          
          <div className="card-gradient p-4">
            <h3 className="text-sm text-crypto-mutedText mb-1">Preço médio</h3>
            <div className="text-2xl font-bold">R$ {(cryptoDetails.price / cryptoDetails.amount).toFixed(2)}</div>
          </div>
          
          <div className="card-gradient p-4">
            <h3 className="text-sm text-crypto-mutedText mb-1">Pnl total</h3>
            <div className="text-2xl font-bold text-crypto-red">
              {/* Assuming a loss for demo purposes */}
              -R$ 135.000,00
              <span className="block text-sm text-crypto-mutedText">
                ≈ {formatCryptoAmount(0.04, cryptoDetails.symbol.split(' ')[0])}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">Histórico de transações</h2>
          <HistoryTable 
            transactions={cryptoTransactions}
            onTransactionClick={handleTransactionClick}
          />
        </div>
      </main>
      
      {/* Modals */}
      {selectedTransaction ? (
        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          transaction={selectedTransaction}
          mode={transactionModalMode}
        />
      ) : (
        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          cryptoId={cryptoDetails.id}
          mode="add"
        />
      )}
      
      {selectedTransaction && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          transactionId={selectedTransaction.id}
        />
      )}
      
      <div className="fixed bottom-6 right-6">
        <button
          className="bg-crypto-orange hover:bg-crypto-orange/90 text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => {
            setSelectedTransaction(null);
            setTransactionModalMode('add');
            setShowTransactionModal(true);
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CryptoDetails;
