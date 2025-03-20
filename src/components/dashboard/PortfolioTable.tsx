
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import { formatCurrency, formatPercentage, formatCryptoAmount, getPercentageColor } from '../../utils/formatters';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { Cryptocurrency } from '../../types';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface PortfolioTableProps {
  assets: Cryptocurrency[];
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ assets }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const navigate = useNavigate();

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (assetId: string) => {
    navigate(`/crypto/${assetId}`);
  };

  return (
    <div className="bg-crypto-darkBg border border-crypto-darkBorder rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-crypto-darkBorder">
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal bg-crypto-darkCard border-crypto-darkBorder hover:bg-crypto-darkCard/70",
                  !date && "text-crypto-mutedText"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy") : <span>Selecionar data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-crypto-darkCard border-crypto-darkBorder" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="bg-crypto-darkCard text-crypto-lightText pointer-events-auto"
                classNames={{
                  day_selected: "bg-crypto-orange text-white hover:bg-crypto-orange hover:text-white",
                  day_today: "bg-crypto-darkBg text-crypto-lightText",
                  day: "text-crypto-lightText hover:bg-crypto-darkBg",
                  head_cell: "text-crypto-mutedText",
                }}
              />
            </PopoverContent>
          </Popover>
          {date && (
            <Button 
              variant="ghost" 
              className="h-9 px-2 text-crypto-mutedText hover:text-crypto-lightText"
              onClick={() => setDate(undefined)}
            >
              Limpar
            </Button>
          )}
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
