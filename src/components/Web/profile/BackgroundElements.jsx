export default function BackgroundElements() {
    return (
      <>
        {/* Main Background Pattern */}
        <div className="absolute inset-0 opacity-8 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 1200 800" className="w-full h-full">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
              <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-slate-300" />
            <circle cx="200" cy="150" r="100" fill="url(#circleGradient)" />
            <circle cx="1000" cy="200" r="150" fill="url(#circleGradient)" />
            <circle cx="300" cy="600" r="80" fill="url(#circleGradient)" />
            <circle cx="900" cy="650" r="120" fill="url(#circleGradient)" />
            <polygon points="500,100 580,220 420,220" fill="url(#circleGradient)" />
            <polygon points="700,500 800,620 600,620" fill="url(#circleGradient)" />
          </svg>
        </div>
  
        {/* Floating Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-bl from-purple-400/15 to-pink-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-teal-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
  
        {/* Geometric Shapes */}
        <div className="absolute top-20 right-20 hidden lg:block opacity-40">
          <div className="relative">
            <div className="w-20 h-20 border-2 border-blue-400/50 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
            <div className="absolute top-2 left-2 w-16 h-16 border-2 border-cyan-400/60 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
            <div className="absolute top-6 left-6 w-8 h-8 bg-gradient-to-r from-purple-400/70 to-pink-400/70 rounded-full animate-pulse"></div>
          </div>
        </div>
  
        <div className="absolute bottom-20 left-20 hidden md:block opacity-50">
          <div className="space-y-3">
            <div className="w-4 h-4 bg-blue-400/60 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-cyan-400/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-5 h-5 bg-teal-400/55 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </>
    );
  }