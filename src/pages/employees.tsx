import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Employees.module.css';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import EmployeesTable, { Employee } from '../components/tables/EmployeesTable';
import EmployeeIcon from '../components/icons/EmployeeIcon';
import { api } from '../lib/api';
import AddEmployeeModal from '../components/modals/AddEmployeeModal';



const EmployeesPage: React.FC = () => {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await api.employees.getAll();
        
        // Transform the data to match the expected format for EmployeesTable
        const formattedEmployees = data.map((employee: any) => ({
          id: employee.id,
          name: employee.name,
          email: employee.email || '',
          phone: employee.phone || '',
          position: employee.position || '',
          clockHours: employee.clockHours || 0,
          hireDate: employee.hireDate || '',
          status: employee.status
        }));
        
        setEmployees(formattedEmployees);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
        setError('Failed to load employees. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee => {
    const searchLower = searchTerm.toLowerCase();
    return (
      employee.name.toLowerCase().includes(searchLower) ||
      employee.position.toLowerCase().includes(searchLower) ||
      employee.status.toLowerCase().includes(searchLower)
    );
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle create new employee button click
  const handleCreateEmployee = () => {
    setIsAddModalOpen(true);
  };
  
  // Handle employee added successfully
  const handleEmployeeAdded = () => {
    // Refresh the employees list
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await api.employees.getAll();
        
        // Transform the data to match the expected format for EmployeesTable
        const formattedEmployees = data.map((employee: any) => ({
          id: employee.id,
          name: employee.name,
          email: employee.email || '',
          phone: employee.phone || '',
          position: employee.position || '',
          clockHours: employee.clockHours || 0,
          hireDate: employee.hireDate || '',
          status: employee.status
        }));
        
        setEmployees(formattedEmployees);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
        setError('Failed to load employees. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  };

  return (
    <>
      <Head>
        <title>PPR - Employees</title>
        <meta name="description" content="Paver Pressure and Repair Employees" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageContainer>
        <PageHeader 
          title="PPR" 
          showBackButton={true}
          backHref="/admin-dashboard" 
        />

        <main className={styles.main}>
          <div className={styles.pageHeader}>
            <div className={styles.titleContainer}>
              <EmployeeIcon className={styles.pageIcon} />
              <h1 className={styles.pageTitle}>Employees</h1>
              <button 
                className={styles.createButton}
                onClick={handleCreateEmployee}
                aria-label="Create new employee"
              >
                +
              </button>
            </div>
          </div>

          {/* Search is handled by the top navigation search bar */}

          {loading ? (
            <div className={styles.loadingContainer}>
              <p>Loading employees...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <EmployeesTable employees={filteredEmployees} isLoading={isLoading} />
            </div>
          )}
          
          {/* Add Employee Modal */}
          <AddEmployeeModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onEmployeeAdded={handleEmployeeAdded}
          />
        </main>
      </PageContainer>
    </>
  );
};

export default EmployeesPage;
