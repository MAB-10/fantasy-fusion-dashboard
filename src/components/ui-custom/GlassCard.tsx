
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'raised' | 'flat' | 'accent';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
  hover?: boolean;
}

const GlassCard = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  animate = false,
  hover = false,
  ...props
}: GlassCardProps) => {
  const baseStyles = "relative rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300";
  
  const variantStyles = {
    default: "bg-white/70 shadow-glass",
    raised: "bg-white/80 shadow-card",
    flat: "bg-white/50 shadow-sm",
    accent: "bg-white/70 shadow-glass border-primary/20",
  };
  
  const paddingStyles = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
  };
  
  const animationStyles = animate ? "animate-scale-in" : "";
  const hoverStyles = hover ? "hover:shadow-glass-hover hover:bg-white/80 hover:-translate-y-1" : "";
  
  return (
    <div 
      className={cn(
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        animationStyles,
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
