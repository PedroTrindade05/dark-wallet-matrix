
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw } from 'lucide-react';
import { formatCurrency, formatPercentage, formatCryptoAmount, getPercentageColor } from '../../utils/formatters';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { Cryptocurrency } from '../../types';

interface PortfolioTableProps {
  assets: Cryptocurrency[];
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ assets }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const navigate = useNavigate();

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleRowClick = (assetId: string) => {
    navigate(`/crypto/${assetId}`);
  };

  return (
    <div className="bg-crypto-darkBg border border-crypto-darkBorder rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-crypto-darkBorder">
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <input 
                type="date" 
                className="opacity-0 absolute inset-0 cursor-pointer"
                onChange={handleSelectDate}
                value={selectedDate}
              />
              <span className="text-crypto-mutedText text-sm">Selecionar data</span>
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-crypto-mutedText">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4 11H20" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 16H15" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 3L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
            </div>
            <div className="bg-crypto-darkCard h-10 pl-3 pr-10 py-2 border border-crypto-darkBorder rounded-lg cursor-pointer"></div>
          </div>
          <div className="h-10 px-3 flex items-center justify-center">→</div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-crypto-mutedText" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar criptomoeda"
              className="pl-10 pr-4 py-2 bg-crypto-darkCard border border-crypto-darkBorder rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-crypto-orange/30 input-crypto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="flex items-center justify-center h-10 w-10 rounded-lg bg-crypto-darkCard border border-crypto-darkBorder hover:bg-crypto-darkCard/70 transition-colors">
            <RefreshCw size={18} className="text-crypto-lightText" />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-crypto-mutedText text-xs font-medium uppercase">
              <th className="px-4 py-3 text-left">Posição<br /><span className="text-[10px] normal-case">% Carteira</span></th>
              <th className="px-4 py-3 text-left">Criptomoeda</th>
              <th className="px-4 py-3 text-right">Variação<br /><span className="text-[10px] normal-case">24h</span></th>
              <th className="px-4 py-3 text-right">Variação<br /><span className="text-[10px] normal-case">7d</span></th>
              <th className="px-4 py-3 text-right">Saldo atual<br /><span className="text-[10px] normal-case">Saldo em token</span></th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset, index) => (
                <tr 
                  key={asset.id}
                  className="border-t border-crypto-darkBorder hover:bg-crypto-darkBg/40 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(asset.id)}
                >
                  <td className="px-4 py-4">
                    <div className="font-medium">{index + 1}</div>
                    <div className="text-xs text-crypto-mutedText">{asset.percentOfPortfolio.toFixed(2)}%</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-crypto-darkCard rounded-full flex items-center justify-center overflow-hidden">
                        {asset.logo ? (
                          <img src={asset.logo} alt={asset.name} className="h-6 w-6" />
                        ) : (
                          <div className="text-xs font-bold">{asset.symbol.substring(0, 2)}</div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-xs text-crypto-mutedText">{asset.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={getPercentageColor(asset.change24h)}>
                      {asset.change24h > 0 ? '+ ' : '- '}
                      {Math.abs(asset.change24h).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={getPercentageColor(asset.change7d)}>
                      {asset.change7d > 0 ? '+ ' : '- '}
                      {Math.abs(asset.change7d).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="font-medium">{formatCurrency(asset.valueInBRL)}</div>
                    <div className="text-xs text-crypto-mutedText">{formatCryptoAmount(asset.amount, asset.symbol.split(' ')[0])}</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-crypto-mutedText">
                  Nenhuma criptomoeda encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioTable;
