import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/context/UserProfileContext';

interface SkillsRequiredRouteProps {
  redirectTo?: string;
}

/**
 * A route component that requires the user to be both authenticated
 * and have completed their skills analysis before access is granted.
 */
const SkillsRequiredRoute: React.FC<SkillsRequiredRouteProps> = ({ 
  redirectTo = '/profile-setup' 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { hasCompletedSkillAnalysis, isLoading: profileLoading } = useUserProfile();
  
  // Show loading state if we're still fetching auth or profile data
  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading user profile...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Redirect to profile setup if skills analysis not completed
  if (!hasCompletedSkillAnalysis) {
    return <Navigate to={redirectTo} replace />;
  }

  // User is authenticated and has completed skills analysis
  return <Outlet />;
};

export default SkillsRequiredRoute; 