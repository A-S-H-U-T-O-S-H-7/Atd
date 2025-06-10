import { useState } from 'react';
import { ChevronDown, History, LogOut } from 'lucide-react';

export default function Header({ user, isRefreshing, onLogout, onClientHistory }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogoutClick = async () => {
    await onLogout(); 
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-lg">
      {/* Enhanced Header Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-400/15 to-pink-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="headerWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="20%" stopColor="#06b6d4" />
              <stop offset="40%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#8b5cf6" />
              <stop offset="80%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <path
            fill="url(#headerWave)"
            d="M0,30 C200,80 400,10 600,50 C800,90 1000,20 1200,60 L1200,0 L0,0 Z"
          />
        </svg>
      </div>

      <div className="relative px-4 md:px-8 lg:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="flex-shrink-0">
            <img 
              src="/atdlogo.png" 
              alt="ATD Finance Logo" 
              className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain"
            />
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 drop-shadow-sm">
              ATD MONEY
            </h1>
            <p className="text-sm text-slate-600/80 hidden sm:block font-medium">
              Welcome, {user.fname}
              {isRefreshing && <span className="ml-2 text-blue-500">(Refreshing...)</span>}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 md:space-x-4">
          <div 
            className="relative group"
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            <button className="flex items-center space-x-2 md:space-x-3 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 rounded-xl px-3 md:px-4 py-2 transition-all duration-300 hover:shadow-md border border-slate-200/50">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">{user.fname?.[0]}</span>
              </div>
              <span className="text-slate-700 font-medium hidden sm:block">{user.fname}</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-all duration-300 ${showProfileMenu ? 'rotate-180 text-blue-500' : ''}`} />
            </button>
            
            <div className={`absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/50 py-2 transition-all duration-300 ${
              showProfileMenu 
                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}>
              <button 
                onClick={onClientHistory}
                className="w-full px-4 py-3 text-left hover:bg-blue-50/50 flex items-center space-x-3 transition-all duration-200 group/item"
              >
                <History className="w-4 h-4 text-slate-500 group-hover/item:text-blue-500 transition-colors" />
                <span className="text-slate-700 group-hover/item:text-blue-600 font-medium">Loan History</span>
              </button>
              <div className="h-px bg-slate-200/50 mx-2 my-1"></div>
              <button 
                onClick={handleLogoutClick}
                className="w-full px-4 py-3 cursor-pointer text-left hover:bg-red-50/50 flex items-center space-x-3 transition-all duration-200 text-red-600 group/item"
              >
                <LogOut className="w-4 h-4  group-hover/item:text-red-700 transition-colors" />
                <span className="group-hover/item:text-red-700  font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}