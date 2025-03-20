
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { toast } from "sonner";

interface CreatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePortfolioModal: React.FC<CreatePortfolioModalProps> = ({ isOpen, onClose }) => {
  const [portfolioName, setPortfolioName] = useState('');
  const { addPortfolio } = usePortfolio();

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!portfolioName.trim()) {
      toast.error("Por favor, insira um nome para o portfólio");
      return;
    }
    
    addPortfolio(portfolioName);
    toast.success(`Portfólio "${portfolioName}" criado com sucesso`);
    setPortfolioName('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in bg-black/50 backdrop-blur-sm">
      <div className="relative bg-crypto-darkCard border border-crypto-darkBorder rounded-lg shadow-xl w-full max-w-md mx-4 animate-scale-in">
        <div className="p-6">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-crypto-mutedText hover:text-crypto-lightText transition-colors"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-xl font-semibold mb-1">Criar portfólio</h2>
          <p className="text-crypto-mutedText mb-6">Insira um nome para seu novo portfólio</p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="portfolioName" className="block text-sm font-medium mb-2">
                Nome do Portfólio
              </label>
              <input
                id="portfolioName"
                type="text"
                placeholder="Digite o nome do seu portfólio"
                className="w-full px-4 py-3 rounded-lg input-crypto"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
            
            <button
              className="w-full py-3 rounded-lg btn-primary font-medium text-white"
              onClick={handleSubmit}
            >
              Criar portfólio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePortfolioModal;
