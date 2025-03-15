
import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/ui-custom/GlassCard';
import { cn } from '@/lib/utils';
import { Trophy, Users2, BarChart3 } from 'lucide-react';

const features = [
  {
    title: 'Best Playing XI',
    description: 'Get AI-powered recommendations for your fantasy team lineup.',
    icon: Users2,
    color: 'text-blue-500',
    link: '/best-xi',
    gradient: 'from-blue-500/20 to-transparent'
  },
  {
    title: 'Player Comparison',
    description: 'Compare players head-to-head with detailed statistics.',
    icon: BarChart3,
    color: 'text-green-500',
    link: '/player-comparison',
    gradient: 'from-green-500/20 to-transparent'
  },
  {
    title: 'League Stats',
    description: 'Analyze team performance and league standings.',
    icon: Trophy,
    color: 'text-amber-500',
    link: '/league-stats',
    gradient: 'from-amber-500/20 to-transparent'
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="absolute inset-x-0 -top-8">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
            Fantasy Football Analytics
          </h1>
          
          <p className="text-foreground/60 text-lg sm:text-xl mb-8 leading-relaxed">
            Make data-driven decisions for your fantasy team with our AI-powered analytics platform.
          </p>
          
          <div className="absolute inset-x-0 -bottom-8">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Link 
              key={feature.title} 
              to={feature.link}
              className="group"
            >
              <GlassCard
                hover
                animate
                className={cn(
                  "h-full relative overflow-hidden",
                  "before:absolute before:inset-0 before:bg-gradient-radial",
                  `before:${feature.gradient}`,
                  "before:opacity-0 before:transition-opacity before:duration-500",
                  "group-hover:before:opacity-100"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative z-10">
                  <div className={cn(
                    "inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4",
                    "bg-white/50 backdrop-blur-sm",
                    feature.color
                  )}>
                    <feature.icon size={24} />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-foreground/60">{feature.description}</p>
                  
                  <div className={cn(
                    "mt-4 inline-flex items-center text-sm font-medium",
                    feature.color,
                    "opacity-0 -translate-y-2 transition-all duration-300",
                    "group-hover:opacity-100 group-hover:translate-y-0"
                  )}>
                    Explore
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
