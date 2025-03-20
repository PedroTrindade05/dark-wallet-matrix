
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { usePortfolio } from '../../contexts/PortfolioContext';

const CustomLegend = (props: any) => {
  const { payload } = props;
  
  return (
    <ul className="flex flex-col gap-2 mt-2">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm">{entry.value}</span>
          </div>
          <span className="text-sm font-medium">{entry.payload.percentage}%</span>
        </li>
      ))}
    </ul>
  );
};

const AssetAllocation: React.FC = () => {
  const { currentPortfolio } = usePortfolio();
  
  return (
    <div className="card-gradient p-4">
      <h3 className="text-lg font-medium mb-3">Alocações de criptomoedas</h3>

      <div className="h-[220px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={currentPortfolio.allocationData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {currentPortfolio.allocationData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Legend 
              content={<CustomLegend />} 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              wrapperStyle={{ right: 0 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetAllocation;
