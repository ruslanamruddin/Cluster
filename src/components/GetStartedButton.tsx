
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface GetStartedButtonProps {
  className?: string;
  text?: string;
}

const GetStartedButton = ({ 
  className,
  text = "Get Started"
}: GetStartedButtonProps) => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      className={cn(
        "relative overflow-hidden group py-4 px-8 rounded-full font-medium",
        "bg-cta-gradient bg-size-200 animate-gradient-shift",
        "transition-all duration-300 ease-out",
        "hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => navigate('/auth')}
    >
      {/* Button content */}
      <span className="relative z-10 flex items-center text-black">
        <span>{text}</span>
        <ArrowRight 
          className={cn(
            "ml-2 transition-transform duration-300",
            isHovering ? "translate-x-1" : "translate-x-0"
          )} 
          size={18} 
        />
      </span>
      
      {/* Glow effect */}
      <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="absolute inset-0 w-full h-full opacity-70 blur-xl bg-cta-gradient animate-pulse" />
      </span>
    </button>
  );
};

export default GetStartedButton;
