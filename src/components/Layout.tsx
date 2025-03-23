
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import { cn } from "@/lib/utils";
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const showNavbar = user && !isHomePage;
  
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out", 
        showNavbar && "md:ml-64", // Add margin for sidebar when visible
        className
      )}>
        {children}
      </main>
      <footer className={cn(
        "py-6 border-t border-border/40 backdrop-blur-sm",
        showNavbar && "md:ml-64" // Add margin for sidebar when visible
      )}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} HackSync. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </a>
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
