
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { usePortfolio } from '../../contexts/PortfolioContext';

const AssetAllocation: React.FC = () => {
  const { currentPortfolio } = usePortfolio();
  
  // Calculate total assets
  const totalAssets = currentPortfolio.assets.length;
  
  return (
    <div className="card-gradient p-4">
      <h3 className="text-lg font-medium mb-4">Alocações de criptomoedas</h3>

      <div className="flex flex-col items-center">
        <div className="h-[200px] w-full relative mb-4">
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
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-crypto-mutedText">Total</p>
            <p className="text-sm text-crypto-mutedText">de ativos</p>
            <p className="text-xl font-bold">{totalAssets}</p>
          </div>
        </div>
        
        {/* Legend at the bottom */}
        <div className="w-full mt-2">
          {currentPortfolio.allocationData.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm">{entry.name}</span>
              </div>
              <span className="text-sm font-medium">{entry.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetAllocation;
