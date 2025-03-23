
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'dark';
  onClick?: () => void; // Added onClick prop
}

const GlassmorphicCard = ({ 
  children, 
  className, 
  variant = 'default',
  onClick
}: GlassmorphicCardProps) => {
  return (
    <div 
      className={cn(
        'rounded-xl p-6',
        variant === 'default' ? 'glass' : 'glass-dark',
        className
      )}
      onClick={onClick} // Added onClick handler
    >
      {children}
    </div>
  );
};

export default GlassmorphicCard;
