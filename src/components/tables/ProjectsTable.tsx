import React from 'react';
import { useRouter } from 'next/router';
import DataTable, { TableColumn } from './DataTable';
import styles from './ProjectsTable.module.css';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Tag from '../badges/Tag';

// Define the Project type
export interface Project {
  id: string;
  clientName: string;
  address: string;
  startDate: string;
  endDate: string;
  total: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  type: 'install' | 'clean' | 'seal' | 'repair';
  squareFootage: number;
}

interface ProjectsTableProps {
  projects: Project[];
  isLoading?: boolean;
}

// Status badge component using global Tag component
const StatusBadge: React.FC<{ status: Project['status'] }> = ({ status }) => {
  // Capitalize first letter of status for display
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <Tag type={status.toLowerCase() as any} label={label} className={styles.statusBadge} />;
};

// Project type badge component using global Tag component
const ProjectTypeBadge: React.FC<{ type: Project['type'] }> = ({ type }) => {
  // Convert first letter to uppercase for display
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  return <Tag type={type.toLowerCase() as any} label={label} className={styles.typeBadge} />;
};

export const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects, isLoading = false }) => {
  const router = useRouter();

  // Define columns for the table - client, type, status, and total
  const columns: TableColumn<Project>[] = [
    {
      header: 'Client',
      accessor: 'clientName',
    },
    {
      header: 'Type',
      accessor: (project) => <ProjectTypeBadge type={project.type} />,
      className: styles.centerAlign
    },
    {
      header: 'Status',
      accessor: (project) => <StatusBadge status={project.status} />,
      className: styles.centerAlign
    },
    {
      header: 'Total',
      accessor: (project) => formatCurrency(project.total),
      className: styles.rightAlign
    }
  ];

  // Handle row click to view project details
  const handleRowClick = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <DataTable<Project>
      columns={columns}
      data={projects}
      keyField="id"
      onRowClick={handleRowClick}
      isLoading={isLoading}
      emptyMessage="No projects found"
      className={styles.projectsTable}
    />
  );
};

export default ProjectsTable;
