
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import AuthForm from '@/components/Auth/AuthForm';
import { useAuth } from '@/context/AuthContext';

const Auth = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">Welcome to HackSync</h1>
          <AuthForm />
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
