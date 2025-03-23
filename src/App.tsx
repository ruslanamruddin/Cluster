import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import Explore from '@/pages/Explore';
import Tasks from '@/pages/Tasks';
import AITools from '@/pages/AITools';
import ProfileSetup from '@/pages/ProfileSetup';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import SkillsRequiredRoute from '@/components/Auth/SkillsRequiredRoute';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { UserProfileProvider } from '@/context/UserProfileContext';
import { ErrorProvider } from '@/context/ErrorContext';
import { HackathonProvider } from '@/context/HackathonContext';
import ErrorBoundary from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <ThemeProvider defaultTheme="dark" storageKey="hackhub-theme">
          <AuthProvider>
            <UserProfileProvider>
              <HackathonProvider>
                <Router>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    
                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/profile-setup" element={<ProfileSetup />} />
                      <Route path="/ai-tools" element={<AITools />} />
                      <Route path="/explore" element={<Explore />} />
                      <Route path="/explore/:id" element={<Explore />} />

                      {/* Routes that require skill analysis */}
                      <Route element={<SkillsRequiredRoute redirectTo="/profile-setup" />}>
                        <Route path="/tasks" element={<Tasks />} />
                      </Route>
                    </Route>
                    
                    {/* Redirect unknown routes to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <Toaster />
                </Router>
              </HackathonProvider>
            </UserProfileProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
}

export default App;
