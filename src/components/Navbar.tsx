import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  Search, 
  Users, 
  Calendar, 
  FileText, 
  Menu, 
  X,
  CheckSquare,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Explore', path: '/explore', icon: <Search size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Teams', path: '/teams', icon: <Users size={20} /> },
    { name: 'Events', path: '/events', icon: <Calendar size={20} /> },
    { name: 'AI Tools', path: '/ai-tools', icon: <Sparkles size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 flex-col w-64 h-screen bg-background border-r border-border/40 z-40">
        <div className="p-4 flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="rounded-lg bg-primary p-1.5">
              <span className="text-primary-foreground font-bold text-lg">HS</span>
            </div>
            <span className="font-semibold text-xl">HackSync</span>
          </Link>
        </div>
        
        <div className="px-3 py-4">
          <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">
                {user?.user_metadata.name ? 
                  user.user_metadata.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() :
                  'US'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium truncate max-w-[140px]">
                {user?.user_metadata.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">View profile</p>
            </div>
          </Link>

          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-border/40">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground" 
            onClick={() => signOut()}
          >
            <LogOut size={20} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Menu Button - fixed on top */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="ghost" 
          size="icon" 
          className="bg-background/80 backdrop-blur-sm border border-border/40"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-64 bg-background border-r border-border/40 h-full overflow-y-auto">
            <div className="p-4 flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <div className="rounded-lg bg-primary p-1.5">
                  <span className="text-primary-foreground font-bold text-lg">HS</span>
                </div>
                <span className="font-semibold text-xl">HackSync</span>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={20} />
              </Button>
            </div>
            
            <div className="px-3 py-4">
              <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {user?.user_metadata.name ? 
                      user.user_metadata.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() :
                      'US'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.user_metadata.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">View profile</p>
                </div>
              </Link>

              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-all duration-200 ${
                      isActive(link.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="mt-auto p-4 border-t border-border/40">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:text-foreground" 
                onClick={() => signOut()}
              >
                <LogOut size={20} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
