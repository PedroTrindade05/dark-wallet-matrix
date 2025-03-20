
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '../components/layout/Header';
import PortfolioSelector from '../components/dashboard/PortfolioSelector';
import BalanceCard from '../components/dashboard/BalanceCard';
import MetricCard from '../components/dashboard/MetricCard';
import CryptoChart from '../components/dashboard/CryptoChart';
import AssetAllocation from '../components/dashboard/AssetAllocation';
import PortfolioTable from '../components/dashboard/PortfolioTable';
import HistoryTable from '../components/dashboard/HistoryTable';
import TransactionModal from '../components/modals/TransactionModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import { usePortfolio } from '../contexts/PortfolioContext';
import { Transaction } from '../types';

const Dashboard: React.FC = () => {
  const { currentPortfolio } = usePortfolio();
  const [activeTab, setActiveTab] = useState('carteira');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionModalMode, setTransactionModalMode] = useState<'add' | 'edit'>('add');

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
    setTransactionModalMode('edit');
  };

  const handleDeleteTransaction = () => {
    if (selectedTransaction) {
      setShowDeleteModal(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-crypto-darkBg text-crypto-lightText">
      <Header />
      
      <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <PortfolioSelector />
            <div className="mt-4">
              <BalanceCard 
                balance={currentPortfolio.balance} 
                change={currentPortfolio.change30d} 
              />
            </div>
          </div>
          
          <div className="md:col-span-1">
            <MetricCard 
              title="Ganhos totais" 
              subtitle="Desde o início"
              value={currentPortfolio.totalGain}
              percentage={currentPortfolio.change30d.percentage}
              variant="gain"
            />
          </div>
          
          <div className="md:col-span-1 grid grid-cols-1 gap-3">
            <MetricCard 
              title="Moeda com Maior Lucro"
              value={currentPortfolio.bestPerformer.gain}
              cryptoName={currentPortfolio.bestPerformer.name}
              cryptoSymbol={currentPortfolio.bestPerformer.symbol}
              variant="gain"
              className="h-[calc(50%-0.375rem)]"
            />
            
            <MetricCard 
              title="Moeda com Pior Lucro"
              value={currentPortfolio.worstPerformer.loss}
              cryptoName={currentPortfolio.worstPerformer.name}
              cryptoSymbol={currentPortfolio.worstPerformer.symbol}
              variant="loss"
              className="h-[calc(50%-0.375rem)]"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <CryptoChart />
          </div>
          
          <div className="lg:col-span-1">
            <AssetAllocation />
          </div>
        </div>
        
        <Tabs defaultValue="carteira" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 max-w-[400px]">
            <TabsTrigger 
              value="carteira"
              className="data-[state=active]:bg-crypto-orange data-[state=active]:text-white"
            >
              Carteira
            </TabsTrigger>
            <TabsTrigger 
              value="historico"
              className="data-[state=active]:bg-crypto-orange data-[state=active]:text-white"
            >
              Histórico
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="carteira" className="mt-4">
            <PortfolioTable assets={currentPortfolio.assets} />
          </TabsContent>
          
          <TabsContent value="historico" className="mt-4">
            <HistoryTable 
              transactions={currentPortfolio.transactions}
              onTransactionClick={handleTransactionClick}
            />
          </TabsContent>
        </Tabs>
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
      
      {activeTab === 'carteira' && (
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
      )}
    </div>
  );
};

export default Dashboard;
