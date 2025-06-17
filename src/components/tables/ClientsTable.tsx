import React from 'react';
import { useRouter } from 'next/router';
import DataTable, { TableColumn } from './DataTable';
import styles from './ClientsTable.module.css';
import { formatDate } from '../../utils/formatters';
import Tag from '../badges/Tag';
import CallButton from '../buttons/actionbuttons/CallButton';
import EmailButton from '../buttons/actionbuttons/EmailButton';

// Define the Client type
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'prospect';
  projectCount: number;
}

interface ClientsTableProps {
  clients: Client[];
  isLoading?: boolean;
}

// Status badge component using global Tag component
const StatusBadge: React.FC<{ status: Client['status'] }> = ({ status }) => {
  // Capitalize first letter of status for display
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <Tag type={status.toLowerCase() as any} label={label} className={styles.statusBadge} />;
};

export const ClientsTable: React.FC<ClientsTableProps> = ({ clients, isLoading = false }) => {
  const router = useRouter();

  // Define columns for the table
  const columns: TableColumn<Client>[] = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Status',
      accessor: (client) => <StatusBadge status={client.status} />,
      className: styles.centerAlign
    },
    {
      header: 'Actions',
      accessor: (client) => (
        <div className={styles.actionButtons}>
          <EmailButton email={client.email} clientId={client.id} />
          <CallButton phone={client.phone} clientId={client.id} />
        </div>
      ),
      className: styles.centerAlign
    }
  ];

  // Handle row click to view client details
  const handleRowClick = (client: Client) => {
    router.push(`/clients/${client.id}`);
  };

  return (
    <DataTable<Client>
      columns={columns}
      data={clients}
      keyField="id"
      onRowClick={handleRowClick}
      isLoading={isLoading}
      emptyMessage="No clients found"
      className={styles.clientsTable}
      sortable={true}
      pagination={true}
    />
  );
};

export default ClientsTable;
