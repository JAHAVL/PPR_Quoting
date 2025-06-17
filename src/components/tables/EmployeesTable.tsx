import React from 'react';
import { useRouter } from 'next/router';
import DataTable, { TableColumn } from './DataTable';
import styles from './EmployeesTable.module.css';
import { formatDate } from '../../utils/formatters';
import Tag from '../badges/Tag';

// Define the Employee type
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string; // Keep for reference but not displayed in table
  clockHours: number;
  hireDate: string;
  status: 'active' | 'inactive' | 'onleave';
}

interface EmployeesTableProps {
  employees: Employee[];
  isLoading?: boolean;
}

// Status badge component using global Tag component
const StatusBadge: React.FC<{ status: Employee['status'] }> = ({ status }) => {
  // Capitalize first letter of status for display
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <Tag type={status.toLowerCase() as any} label={label} className={styles.statusBadge} />;
};

// Format clock hours
const formatClockHours = (hours: number): string => {
  return `${hours.toFixed(1)}h`;
};

export const EmployeesTable: React.FC<EmployeesTableProps> = ({ employees, isLoading = false }) => {
  const router = useRouter();

  // Define columns for the table
  const columns: TableColumn<Employee>[] = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Clock Hours',
      accessor: (employee) => formatClockHours(employee.clockHours),
      className: styles.centerAlign
    },
    {
      header: 'Status',
      accessor: (employee) => <StatusBadge status={employee.status} />,
      className: styles.centerAlign
    },
    {
      header: 'Actions',
      accessor: (employee) => (
        <div className={styles.actionButtons}>
          <button 
            className={styles.actionButton} 
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `mailto:${employee.email}`;
            }}
            aria-label="Send email"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </button>
          <button 
            className={styles.actionButton} 
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${employee.phone}`;
            }}
            aria-label="Call employee"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
            </svg>
          </button>
        </div>
      ),
      className: styles.centerAlign
    }
  ];

  // Handle row click to view employee details
  const handleRowClick = (employee: Employee) => {
    router.push(`/employees/${employee.id}`);
  };

  return (
    <DataTable<Employee>
      columns={columns}
      data={employees}
      keyField="id"
      onRowClick={handleRowClick}
      isLoading={isLoading}
      emptyMessage="No employees found"
      className={styles.employeesTable}
      sortable={true}
      pagination={true}
    />
  );
};

export default EmployeesTable;
