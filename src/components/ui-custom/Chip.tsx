
import React from 'react';
import { cn } from '@/lib/utils';

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

const Chip = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}: ChipProps) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors duration-300 rounded-full";
  
  const variantStyles = {
    default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    primary: "bg-primary/10 text-primary hover:bg-primary/20",
    success: "bg-success/10 text-success hover:bg-success/20",
    warning: "bg-warning/10 text-warning hover:bg-warning/20",
    info: "bg-info/10 text-info hover:bg-info/20",
    destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  };
  
  const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };
  
  return (
    <div 
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Chip;
