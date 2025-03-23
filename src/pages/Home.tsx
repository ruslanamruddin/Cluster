import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Zap, Brain, Code, ChevronRight, Sparkles, Rocket, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <Layout className="overflow-hidden">
      {/* Hero Section with animated gradient background */}
      <div className="relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          
          {/* Tech pattern - subtle grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="flex flex-col items-center max-w-5xl mx-auto">
            {/* Animated badge */}
            <div className="inline-flex items-center gap-1.5 py-1 px-3 mb-6 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20 animate-pulse">
              <Sparkles size={14} />
              <span>Next-gen hackathon collaboration platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-br from-primary via-violet-500 to-fuchsia-500 mb-6">
              <span className="inline-block">Cluster</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-center text-muted-foreground max-w-3xl mb-10 leading-relaxed">
              The ultimate platform for finding skilled teammates, managing projects, and leveraging AI to build amazing things together.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {user ? (
                <>
                  <Button asChild size="lg" className="h-14 px-8 rounded-full shadow-lg shadow-primary/20">
                    <Link to="/explore" className="flex items-center gap-2">
                      Find Teams <ArrowRight size={18} />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full border-2">
                    <Link to="/profile" className="flex items-center gap-2">
                      My Profile <Users size={18} />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="h-14 px-8 rounded-full shadow-lg shadow-primary/20">
                    <Link to="/auth" className="flex items-center gap-2">
                      Get Started <ArrowRight size={18} />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full border-2">
                    <Link to="/auth?signup=true" className="flex items-center gap-2">
                      Sign Up <Users size={18} />
                    </Link>
                  </Button>
                </>
              )}
            </div>
            
            {/* Abstract decorative elements */}
            <div className="relative w-full max-w-4xl h-24 mt-16 hidden md:block">
              <div className="absolute left-0 bottom-0 w-40 h-10 bg-primary/10 rounded-lg blur-sm"></div>
              <div className="absolute left-1/4 bottom-4 w-60 h-8 bg-violet-500/10 rounded-lg blur-sm"></div>
              <div className="absolute right-1/4 bottom-10 w-40 h-10 bg-primary/5 rounded-lg blur-sm"></div>
              <div className="absolute right-0 bottom-0 w-32 h-8 bg-violet-500/5 rounded-lg blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-background/50 backdrop-blur-sm py-24 border-y border-border/30">
        <div className="container mx-auto px-4">
          <div className="mb-16 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why developers love Cluster</h2>
            <p className="text-lg text-muted-foreground">Our platform brings together cutting-edge technology and smart design to help you build the perfect team.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {/* Feature 1 - vertical layout with left alignment */}
            <div className="group p-2 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-violet-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-col p-6 h-full">
                <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Find Your Team</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect with developers, designers, and other tech enthusiasts who share your passion for building amazing projects.
                </p>
                <div className="mt-6 pt-4 border-t border-border/30">
                  <Link to="/explore" className="group/link inline-flex items-center text-primary font-medium">
                    Explore teams
                    <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Feature 2 - vertical layout with left alignment */}
            <div className="group p-2 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-violet-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-col p-6 h-full">
                <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Brain className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">AI Skill Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI-powered skill analysis helps identify your strengths and matches you with complementary teammates.
                </p>
                <div className="mt-6 pt-4 border-t border-border/30">
                  <Link to="/ai-tools" className="group/link inline-flex items-center text-primary font-medium">
                    Discover AI tools
                    <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Feature 3 - vertical layout with left alignment */}
            <div className="group p-2 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-violet-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-col p-6 h-full">
                <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Code className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Build Together</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Collaborate efficiently with our integrated project management tools and AI assistance for development.
                </p>
                <div className="mt-6 pt-4 border-t border-border/30">
                  <Link to="/tasks" className="group/link inline-flex items-center text-primary font-medium">
                    View collaboration tools
                    <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            <div className="relative flex flex-col items-center p-6">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl font-bold text-center text-primary mb-2">500+</h3>
                <p className="text-sm text-center text-muted-foreground">Active Teams</p>
              </div>
            </div>
            <div className="relative flex flex-col items-center p-6">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl font-bold text-center text-primary mb-2">2k+</h3>
                <p className="text-sm text-center text-muted-foreground">Developers</p>
              </div>
            </div>
            <div className="relative flex flex-col items-center p-6">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl font-bold text-center text-primary mb-2">150+</h3>
                <p className="text-sm text-center text-muted-foreground">Projects Completed</p>
              </div>
            </div>
            <div className="relative flex flex-col items-center p-6">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl font-bold text-center text-primary mb-2">98%</h3>
                <p className="text-sm text-center text-muted-foreground">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-violet-500/10 to-transparent"></div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-card/80 backdrop-blur-sm p-10 md:p-16 rounded-3xl border border-border/50 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Ready to start building?</h2>
            <p className="text-lg text-muted-foreground text-center max-w-xl mx-auto mb-10">
              Join Cluster today and turn your ideas into reality with the perfect team. Our platform makes collaboration seamless.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full shadow-lg shadow-primary/20">
                <Link to={user ? "/explore" : "/auth"} className="flex items-center gap-2">
                  Get Started <Rocket size={18} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full border-2">
                <Link to="/explore" className="flex items-center gap-2">
                  Explore Projects <Globe size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home; 
