import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Zap, Brain, Code } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500">
            HackHub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            The ultimate platform for finding skilled teammates, managing projects, and leveraging AI to build amazing things together.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {user ? (
              <>
                <Button asChild size="lg" className="gap-2">
                  <Link to="/explore">
                    Find Teams <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link to="/profile">
                    My Profile <Users size={16} />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="gap-2">
                  <Link to="/auth">
                    Get Started <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link to="/auth?signup=true">
                    Sign Up <Users size={16} />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Your Team</h3>
            <p className="text-muted-foreground">
              Connect with developers, designers, and other tech enthusiasts who share your passion for building amazing projects.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Skill Analysis</h3>
            <p className="text-muted-foreground">
              Our AI-powered skill analysis helps identify your strengths and matches you with complementary teammates.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Build Together</h3>
            <p className="text-muted-foreground">
              Collaborate efficiently with our integrated project management tools and AI assistance for development.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start building?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Join HackHub today and turn your ideas into reality with the perfect team.
          </p>
          
          <Button asChild size="lg" className="gap-2">
            <Link to={user ? "/explore" : "/auth"}>
              Get Started <Zap size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Home; 