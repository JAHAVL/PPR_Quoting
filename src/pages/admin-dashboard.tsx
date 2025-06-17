import React from 'react';
import Head from 'next/head';
import styles from '../styles/AdminDashboard.module.css';
import DashboardCard from '../components/cards/DashboardCard';
import PageHeader from '../components/layout/PageHeader';
import QuoteIcon from '../components/icons/QuoteIcon';
import ClientsIcon from '../components/icons/ClientsIcon';
import ProjectsIcon from '../components/icons/ProjectsIcon';
import CreateQuoteIcon from '../components/icons/CreateQuoteIcon';
import EmployeesIcon from '../components/icons/EmployeesIcon';
import PageContainer from '../components/layout/PageContainer'; // Added PageContainer

const AdminDashboard: React.FC = () => {
  return (
    <>
      <Head>
        <title>PPR Admin Dashboard</title>
        <meta name="description" content="Paver Pressure and Repair Admin Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <PageContainer>
        <PageHeader title="PPR" />
        
        <main className={styles.dashboard}>
        
        <div className={styles.cardContainer}>
          <DashboardCard 
            title="Quotes" 
            href="/quotes" 
            icon={<QuoteIcon />} 
            description="View and manage quotes"
            chartType="line"
            chartData={[
              { value: 5, label: 'Mon' },
              { value: 8, label: 'Tue' },
              { value: 12, label: 'Wed' },
              { value: 7, label: 'Thu' },
              { value: 10, label: 'Fri' },
            ]}
            statValue={42}
            statLabel="this month"
          />
          
          <DashboardCard 
            title="Clients" 
            href="/clients" 
            icon={<ClientsIcon />} 
            description="Manage client information"
            chartType="circle"
            percentage={78}
            statValue={24}
            statLabel="active"
          />
          
          <DashboardCard 
            title="Projects" 
            href="/projects" 
            icon={<ProjectsIcon />} 
            description="Track ongoing projects"
            chartType="line"
            chartData={[
              { value: 3, label: 'Open' },
              { value: 7, label: 'In Progress' },
              { value: 4, label: 'Complete' },
            ]}
            statValue={14}
            statLabel="total"
          />
          
          <DashboardCard 
            title="Employees" 
            href="/employees" 
            icon={<EmployeesIcon />} 
            description="Manage team members"
            chartType="line"
            chartData={[
              { value: 4, label: 'Install' },
              { value: 3, label: 'Clean' },
              { value: 2, label: 'Admin' },
            ]}
            statValue={9}
            statLabel="total"
          />
          
          <DashboardCard 
            title="Create Quote" 
            href="/install-quote" 
            icon={<CreateQuoteIcon />} 
            description="Create new quotes"
            chartType="circle"
            percentage={65}
            statValue="$24,850"
            statLabel="avg value"
          />
        </div>
        
        {/* Stats container removed as requested */}
        </main>
      </PageContainer>
    </>
  );
};

export default AdminDashboard;
