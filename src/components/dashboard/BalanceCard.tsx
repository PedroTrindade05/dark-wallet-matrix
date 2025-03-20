
import React from 'react';
import { formatCurrency, formatPercentage, getPercentageColor } from '../../utils/formatters';

interface BalanceCardProps {
  balance: number;
  change: {
    value: number;
    percentage: number;
  };
  period?: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ 
  balance, 
  change, 
  period = '30d' 
}) => {
  const changeColor = getPercentageColor(change.percentage);

  return (
    <div className="animate-slide-up">
      <h2 className="text-lg font-medium mb-1">Saldo atual da carteira</h2>
      <div className="flex flex-col">
        <div className="text-4xl font-bold">{formatCurrency(balance)}</div>
        <div className="flex items-center mt-1 gap-2">
          <span className={`${changeColor} font-medium`}>
            {formatCurrency(change.value)}
          </span>
          <span className={`${changeColor} font-medium`}>
            {formatPercentage(change.percentage)} ({period})
          </span>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
