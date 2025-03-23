
import React, { ReactNode } from 'react';
import Layout from '@/components/Layout';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <Layout className="bg-background">
      {children}
    </Layout>
  );
};

export default DashboardLayout;
