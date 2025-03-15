
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Gauge, Users, Trophy, ChevronRight } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const handleScroll = () => {
    const offset = window.scrollY;
    setScrolled(offset > 10);
  };
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { name: 'Best XI', path: '/best-xi', icon: <Users size={18} /> },
    { name: 'Player Comparison', path: '/player-comparison', icon: <ChevronRight size={18} /> },
    { name: 'League Stats', path: '/league-stats', icon: <Trophy size={18} /> },
  ];
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "py-2 bg-background/80 backdrop-blur-md shadow-sm" : "py-4 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Gauge className="text-primary" size={24} />
          <span className="font-medium text-lg tracking-tight">Fantasy Analytics</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-secondary hover:text-foreground"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="md:hidden">
          {/* Mobile menu button - for responsive version */}
          <button className="p-2 rounded-full hover:bg-secondary transition-colors duration-300">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
