
import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import CreatePortfolioModal from '../modals/CreatePortfolioModal';

const PortfolioSelector: React.FC = () => {
  const { portfolios, currentPortfolio, setCurrentPortfolio } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleSelect = (portfolio: typeof portfolios[0]) => {
    setCurrentPortfolio(portfolio);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative">
        <div
          className="flex items-center justify-between cursor-pointer border-b border-crypto-orange/50 pb-1 px-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-md bg-crypto-orange/20 flex items-center justify-center">
              <Plus size={12} className="text-crypto-orange" />
            </div>
            <span className="text-lg font-medium text-crypto-orange">{currentPortfolio.name}</span>
          </div>
          <ChevronDown
            size={18}
            className={`text-crypto-orange transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute left-0 top-full mt-1 w-full z-10 bg-crypto-darkCard border border-crypto-darkBorder rounded-md shadow-lg animate-fade-in">
            <div className="py-1 max-h-60 overflow-y-auto">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-crypto-darkBg/50 transition-colors"
                onClick={() => {
                  setCreateModalOpen(true);
                  setIsOpen(false);
                }}
              >
                <Plus size={16} className="text-crypto-orange" />
                <span className="text-sm font-medium">Criar novo portfólio</span>
              </button>
              
              <div className="border-t border-crypto-darkBorder my-1"></div>
              
              {portfolios.map((portfolio) => (
                <button
                  key={portfolio.id}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-crypto-darkBg/50 transition-colors ${
                    portfolio.id === currentPortfolio.id ? 'bg-crypto-darkBg/30' : ''
                  }`}
                  onClick={() => handleSelect(portfolio)}
                >
                  <div className={`h-2 w-2 rounded-full ${
                    portfolio.id === currentPortfolio.id ? 'bg-crypto-orange' : 'bg-crypto-mutedText'
                  }`}></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{portfolio.name}</span>
                    <span className="text-xs text-crypto-mutedText">R$ {portfolio.balance.toLocaleString('pt-BR')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <CreatePortfolioModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
};

export default PortfolioSelector;
