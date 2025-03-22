
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'dark';
}

const GlassmorphicCard = ({ 
  children, 
  className, 
  variant = 'default' 
}: GlassmorphicCardProps) => {
  return (
    <div 
      className={cn(
        'rounded-xl p-6',
        variant === 'default' ? 'glass' : 'glass-dark',
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassmorphicCard;
