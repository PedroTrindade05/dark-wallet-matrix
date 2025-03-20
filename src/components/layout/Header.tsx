
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, UserCircle, MoreHorizontal } from 'lucide-react';

interface HeaderProps {
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userName = 'Pedro' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="flex items-center justify-between p-4 border-b border-crypto-darkBorder bg-black/20 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xl font-semibold text-crypto-orange"
        >
          <div className="h-6 w-6 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-crypto-orange rounded-md opacity-20"></div>
            <Home size={16} className="text-crypto-orange" />
          </div>
          Modelo
        </button>
        
        {!isHome && (
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-crypto-lightText hover:text-crypto-orange gap-1 ml-6 transition-colors"
          >
            <span className="text-sm">Voltar</span>
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center mr-1">
          <div className="relative">
            <div className="h-6 w-6 rounded-full flex items-center justify-center bg-crypto-orange/20 text-crypto-orange mr-1">
              <span className="text-xs">1</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-right">
            {userName}
            <span className="block text-[10px] text-crypto-orange font-semibold">FREE</span>
          </span>
          <div className="h-9 w-9 rounded-full bg-crypto-orange/20 flex items-center justify-center text-crypto-orange">
            <UserCircle size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
