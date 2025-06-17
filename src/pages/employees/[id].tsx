import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { employeesAPI } from '../../lib/api';
import PageContainer from '../../components/layout/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import Tag from '../../components/badges/Tag';
import styles from '../../styles/DetailPage.module.css';
import { formatDate } from '../../utils/formatters';
import EmployeeIcon from '../../components/icons/EmployeeIcon';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  clockHours: number;
  hireDate: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const EmployeeDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchEmployeeData();
    }
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const data = await employeesAPI.getById(id as string);
      setEmployee(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch employee:', err);
      setError('Failed to load employee details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on': return 'green';
      case 'off': return 'gray';
      case 'out': return 'blue';
      case 'archived': return 'red';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>PPR - Loading Employee</title>
          <meta name="description" content="Paver Pressure and Repair Employee Details" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageContainer>
          <PageHeader 
            title="PPR" 
            showBackButton={true}
            backHref="/employees" 
          />
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading employee details...</p>
          </div>
        </PageContainer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>PPR - Error</title>
          <meta name="description" content="Paver Pressure and Repair Employee Details" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageContainer>
          <PageHeader 
            title="PPR" 
            showBackButton={true}
            backHref="/employees" 
          />
          <div className={styles.errorContainer}>
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={fetchEmployeeData}
            >
              Retry
            </button>
          </div>
        </PageContainer>
      </>
    );
  }

  if (!employee) {
    return (
      <>
        <Head>
          <title>PPR - Employee Not Found</title>
          <meta name="description" content="Paver Pressure and Repair Employee Details" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageContainer>
          <PageHeader 
            title="PPR" 
            showBackButton={true}
            backHref="/employees" 
          />
          <div className={styles.notFoundContainer}>
            <h2>Employee Not Found</h2>
            <p>The requested employee could not be found.</p>
            <button 
              className={styles.backButton}
              onClick={() => router.push('/employees')}
            >
              Back to Employees
            </button>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>PPR - {employee.name}</title>
        <meta name="description" content={`Paver Pressure and Repair - Employee: ${employee.name}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageContainer>
        <PageHeader 
          title="PPR" 
          showBackButton={true}
          backHref="/employees" 
        />
        
        <main className={styles.main}>
          <div className={styles.pageHeader}>
            <div className={styles.titleContainer}>
              <EmployeeIcon className={styles.pageIcon} />
              <h1 className={styles.pageTitle}>{employee.name}</h1>
            </div>
          </div>
          
          <div className={styles.detailContainer}>
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <div className={styles.tags}>
                  <Tag type={(employee.status.toLowerCase() === 'on' ? 'approved' : employee.status.toLowerCase() === 'off' ? 'default' : employee.status.toLowerCase() === 'out' ? 'pending' : employee.status.toLowerCase() === 'archived' ? 'rejected' : 'default') as any} label={employee.status} />
                  {employee.position && <Tag type={'default' as any} label={employee.position} />}
                </div>
              </div>
              <div className={styles.headerRight}>
                <button 
                  className={styles.editButton}
                  onClick={() => console.log('Edit employee')}
                >
                  Edit Employee
                </button>
              </div>
            </div>

        <div className={styles.infoGrid}>
          {employee.clockHours !== undefined && (
            <div className={styles.infoCard}>
              <h3>Clock Hours</h3>
              <p>{employee.clockHours} hours</p>
            </div>
          )}

          {employee.hireDate && (
            <div className={styles.infoCard}>
              <h3>Hire Date</h3>
              <p>{formatDate(employee.hireDate)}</p>
            </div>
          )}

          {employee.email && (
            <div className={styles.infoCard}>
              <h3>Email</h3>
              <p>{employee.email}</p>
              <a 
                href={`mailto:${employee.email}`}
                className={styles.viewButton}
              >
                Send Email
              </a>
            </div>
          )}

          {employee.phone && (
            <div className={styles.infoCard}>
              <h3>Phone</h3>
              <p>{employee.phone}</p>
              <a 
                href={`tel:${employee.phone}`}
                className={styles.viewButton}
              >
                Call
              </a>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2>Time Tracking</h2>
          <p className={styles.emptyState}>Time tracking functionality will be implemented in a future update.</p>
        </div>

        <div className={styles.section}>
          <h2>Assigned Projects</h2>
          <p className={styles.emptyState}>Project assignment functionality will be implemented in a future update.</p>
        </div>

        <div className={styles.footer}>
          <div className={styles.metaInfo}>
            <p>Created: {formatDate(employee.created_at)}</p>
            <p>Last Updated: {formatDate(employee.updated_at)}</p>
          </div>
        </div>
      </div>
    </main>
  </PageContainer>
</>
  );
};

export default EmployeeDetailsPage;
