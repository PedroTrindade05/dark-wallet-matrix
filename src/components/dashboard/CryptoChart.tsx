
import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { formatCurrency } from '../../utils/formatters';

interface TimeFilter {
  label: string;
  value: string;
}

const timeFilters: TimeFilter[] = [
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '90d', value: '90d' },
  { label: 'Todos', value: 'all' },
];

const CryptoChart: React.FC = () => {
  const { getChartData } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState<string>('30d');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const data = getChartData(activeFilter);
    setChartData(data);
  }, [activeFilter, getChartData]);

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    
    if (activeFilter === '24h') {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (activeFilter === '7d' || activeFilter === '30d') {
      return `${date.getDate()} ${date.toLocaleString('pt-BR', { month: 'short' })}`;
    } else {
      return `${date.getDate()} ${date.toLocaleString('pt-BR', { month: 'short' })}`;
    }
  };

  const formatTooltipDate = (value: string) => {
    const date = new Date(value);
    if (activeFilter === '24h') {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-lg shadow-lg">
          <p className="text-sm text-crypto-mutedText">{formatTooltipDate(label)}</p>
          <p className="text-sm font-semibold text-crypto-lightText">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-gradient p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Histórico</h3>
        <div className="flex bg-crypto-darkBg rounded-md p-1">
          {timeFilters.map((filter) => (
            <button
              key={filter.value}
              className={`time-filter-button ${activeFilter === filter.value ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[250px] chart-gradient">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#25C26E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#25C26E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tickFormatter={formatXAxis}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#999999', fontSize: 12 }}
              minTickGap={20}
            />
            <YAxis
              domain={['auto', 'auto']}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#999999', fontSize: 12 }}
              tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#25C26E"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CryptoChart;
