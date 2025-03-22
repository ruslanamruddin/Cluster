
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: 1 | 2 | 3 | 4 | 5;
  animation?: 'fade-in' | 'slide-up' | 'slide-in-right' | 'scale-in';
}

const AnimatedSection = ({ 
  children, 
  className, 
  delay = 1, 
  animation = 'fade-in' 
}: AnimatedSectionProps) => {
  return (
    <div 
      className={cn(
        `opacity-0 animate-${animation} delay-${delay}`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
