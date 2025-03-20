
import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { toast } from "sonner";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  transactionId,
}) => {
  const { deleteTransaction } = usePortfolio();

  if (!isOpen) return null;

  const handleDelete = () => {
    deleteTransaction(transactionId);
    toast.success("Transação removida com sucesso");
    onClose();
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
          
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-12 w-12 rounded-full flex items-center justify-center text-crypto-orange mb-4">
              <AlertTriangle size={28} />
            </div>
            <h2 className="text-xl font-semibold">Remover transação</h2>
            <p className="text-crypto-mutedText mt-2">
              Tem certeza que deseja remover está transação?
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              className="flex-1 py-3 px-4 rounded-lg bg-crypto-darkBg border border-crypto-darkBorder hover:bg-crypto-darkBg/80 transition-colors font-medium"
              onClick={onClose}
            >
              <span className="flex items-center justify-center gap-2">
                <X size={16} />
                Cancelar
              </span>
            </button>
            
            <button
              className="flex-1 py-3 px-4 rounded-lg bg-crypto-orange hover:bg-crypto-orange/90 text-white transition-colors font-medium"
              onClick={handleDelete}
            >
              <span className="flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20L18.42 20.22C18.2839 21.2401 17.431 22 16.4 22H7.6C6.56902 22 5.71606 21.2401 5.58 20.22L4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.345 3.147C7.50675 2.59955 8.0037 2.19401 8.569 2.145L15.431 2.145C15.9963 2.19401 16.4932 2.59955 16.655 3.147L17 4H7L7.345 3.147Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 6H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 11V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Remover Transação
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
