
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlassmorphicCard from "./GlassmorphicCard";
import AnimatedSection from "./AnimatedSection";
import { useToast } from "@/components/ui/use-toast";

const AuthForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: isSignUp ? "Account created" : "Welcome back!",
        description: isSignUp 
          ? "Your account has been created successfully." 
          : "You've been logged in successfully.",
        variant: "default",
      });
      
      // Redirect to resume upload page
      navigate("/resume-upload");
    }, 1500);
  };

  return (
    <GlassmorphicCard className="w-full max-w-md">
      <AnimatedSection animation="scale-in" delay={1}>
        <div className="space-y-2 text-center mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-gradient">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-muted-foreground">
            {isSignUp 
              ? "Enter your information to create an account" 
              : "Enter your credentials to access your account"}
          </p>
        </div>
      </AnimatedSection>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatedSection animation="fade-in" delay={2}>
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required={isSignUp}
                value={formData.name}
                onChange={handleChange}
                className="bg-black/20 border-white/10 focus:border-tech-accent1/50"
              />
            </div>
          )}
        </AnimatedSection>

        <AnimatedSection animation="fade-in" delay={3}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="bg-black/20 border-white/10 focus:border-tech-accent1/50"
            />
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-in" delay={4}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {!isSignUp && (
                <button 
                  type="button" 
                  className="text-xs text-muted-foreground hover:text-tech-accent1 transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="bg-black/20 border-white/10 focus:border-tech-accent1/50"
            />
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={5}>
          <Button 
            type="submit" 
            className="w-full bg-cta-gradient hover:shadow-neon-cyan transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? "Creating account..." : "Logging in..."}
              </>
            ) : (
              <>
                {isSignUp ? "Create account" : "Sign in"}
                <Check className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </AnimatedSection>

        <AnimatedSection animation="fade-in" delay={5}>
          <div className="text-center text-sm">
            <button
              type="button"
              className="text-muted-foreground hover:text-tech-accent1 transition-colors"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </AnimatedSection>
      </form>
    </GlassmorphicCard>
  );
};

export default AuthForm;
