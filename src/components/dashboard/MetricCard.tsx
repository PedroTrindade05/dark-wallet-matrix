
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface MetricCardProps {
  title: string;
  subtitle?: string;
  value: number;
  percentage?: number;
  icon?: React.ReactNode;
  iconColor?: string;
  cryptoName?: string;
  cryptoSymbol?: string;
  variant?: 'default' | 'gain' | 'loss';
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  subtitle,
  value,
  percentage,
  icon,
  iconColor,
  cryptoName,
  cryptoSymbol,
  variant = 'default',
  className = '',
}) => {
  const cardStyles = {
    default: '',
    gain: 'border-l-4 border-l-crypto-green',
    loss: 'border-l-4 border-l-crypto-red',
  };

  const valueColor = {
    default: 'text-crypto-orange',
    gain: 'text-crypto-green',
    loss: 'text-crypto-red',
  };

  return (
    <div className={`card-gradient p-4 ${cardStyles[variant]} ${className} animate-slide-up`}>
      <h3 className="text-sm font-medium text-crypto-lightText mb-1">{title}</h3>
      {subtitle && <p className="text-xs text-crypto-mutedText mb-2">{subtitle}</p>}
      
      {cryptoName && (
        <div className="flex items-center gap-2 mb-3">
          {icon ? (
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
              {icon}
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
              {cryptoName[0]}
            </div>
          )}
          <div>
            <div className="font-medium">{cryptoName}</div>
            <div className="text-xs text-crypto-mutedText">{cryptoSymbol}</div>
          </div>
        </div>
      )}
      
      <div className="flex items-baseline justify-between">
        <span className={`text-xl font-bold ${valueColor[variant]}`}>
          {formatCurrency(value)}
        </span>
        
        {percentage !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${valueColor[variant]}`}>
            {variant === 'gain' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span>{percentage.toFixed(2)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
