
import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { Transaction, TransactionType } from '../../types';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { toast } from "sonner";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction;
  cryptoId?: string;
  mode: 'add' | 'edit';
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
  cryptoId,
  mode,
}) => {
  const { addTransaction, updateTransaction } = usePortfolio();
  
  const [type, setType] = useState<TransactionType>('buy');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [fees, setFees] = useState('');
  const [total, setTotal] = useState('');

  useEffect(() => {
    if (mode === 'edit' && transaction) {
      setType(transaction.type);
      setDate(new Date(transaction.date).toISOString().split('T')[0]);
      setPrice(transaction.price.toString());
      setAmount(transaction.amount.toString());
      setFees(transaction.fees.toString());
      setTotal(transaction.total.toString());
    } else {
      // Set default values for add mode
      setType('buy');
      setDate(new Date().toISOString().split('T')[0]);
      setPrice('');
      setAmount('');
      setFees('0');
      setTotal('');
    }
  }, [mode, transaction, isOpen]);

  if (!isOpen) return null;

  const calculateTotal = () => {
    const priceValue = parseFloat(price) || 0;
    const amountValue = parseFloat(amount) || 0;
    const feesValue = parseFloat(fees) || 0;
    
    const calculatedTotal = priceValue * amountValue + feesValue;
    setTotal(calculatedTotal.toFixed(2));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
    setTimeout(calculateTotal, 100);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setTimeout(calculateTotal, 100);
  };

  const handleFeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFees(e.target.value);
    setTimeout(calculateTotal, 100);
  };

  const handleSubmit = () => {
    if (!price || !amount || !date) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    const transactionData = {
      type,
      date: new Date(date).toISOString(),
      cryptoId: transaction?.cryptoId || cryptoId || 'unknown',
      cryptoName: transaction?.cryptoName || 'RIO',
      cryptoSymbol: transaction?.cryptoSymbol || 'Realio Network',
      price: parseFloat(price),
      amount: parseFloat(amount),
      fees: parseFloat(fees) || 0,
      total: parseFloat(total),
    };
    
    if (mode === 'edit' && transaction) {
      updateTransaction({ ...transactionData, id: transaction.id });
      toast.success("Transação atualizada com sucesso");
    } else {
      addTransaction(transactionData);
      toast.success("Transação adicionada com sucesso");
    }
    
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
          
          <h2 className="text-xl font-semibold mb-6">
            {mode === 'add' ? 'Adicionar Transação' : 'Editar transação'}
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-crypto-orange">
                Tipo
              </label>
              <div className="flex gap-2">
                {(['buy', 'sell', 'transfer'] as TransactionType[]).map((t) => (
                  <button
                    key={t}
                    className={`px-4 py-2 rounded-lg font-medium text-sm border ${
                      type === t
                        ? 'bg-crypto-darkBg border-crypto-orange text-crypto-orange'
                        : 'border-crypto-darkBorder text-crypto-lightText hover:bg-crypto-darkBg/50'
                    } transition-colors flex-1`}
                    onClick={() => setType(t)}
                  >
                    {t === 'buy' && 'Compra'}
                    {t === 'sell' && 'Venda'}
                    {t === 'transfer' && 'Transferência'}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-crypto-orange">
                Data
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-lg input-crypto"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-crypto-mutedText">
                  <Calendar size={18} />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-crypto-orange">
                Preço da Cripto
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crypto-mutedText">
                  R$
                </span>
                <input
                  type="number"
                  className="w-full pl-10 pr-4 py-3 rounded-lg input-crypto"
                  placeholder="0,00"
                  value={price}
                  onChange={handlePriceChange}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-crypto-orange">
                Quantidade
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="h-5 w-5 rounded-full bg-crypto-orange/20 flex items-center justify-center text-crypto-orange">
                    <span className="text-xs">₿</span>
                  </div>
                </div>
                <input
                  type="number"
                  className="w-full pl-10 pr-4 py-3 rounded-lg input-crypto"
                  placeholder="0,00"
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-crypto-orange">
                Taxas
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crypto-mutedText">
                  R$
                </span>
                <input
                  type="number"
                  className="w-full pl-10 pr-4 py-3 rounded-lg input-crypto"
                  placeholder="0,00"
                  value={fees}
                  onChange={handleFeesChange}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-crypto-orange">
                Total gasto
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crypto-mutedText">
                  R$
                </span>
                <input
                  type="number"
                  className="w-full pl-10 pr-4 py-3 rounded-lg input-crypto"
                  placeholder="0,00"
                  value={total}
                  readOnly
                />
              </div>
            </div>
            
            <button
              className="w-full py-3 rounded-lg btn-primary font-medium text-white"
              onClick={handleSubmit}
            >
              {mode === 'add' ? 'Adicionar Transação' : 'Salvar alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
