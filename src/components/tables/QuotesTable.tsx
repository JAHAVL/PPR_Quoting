import React from 'react';
import { useRouter } from 'next/router';
import DataTable, { TableColumn } from './DataTable';
import styles from './QuotesTable.module.css';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Tag from '../badges/Tag';

// Define the Quote type
export interface Quote {
  id: string;
  clientName: string;
  address: string;
  date: string;
  total: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  type: 'install' | 'clean' | 'seal' | 'repair';
  squareFootage: number;
}

interface QuotesTableProps {
  quotes: Quote[];
  isLoading?: boolean;
}

// Using formatters from utils/formatters.ts

// Status badge component using global Tag component
const StatusBadge: React.FC<{ status: Quote['status'] }> = ({ status }) => {
  // Capitalize first letter of status for display
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <Tag type={status.toLowerCase() as any} label={label} className={styles.statusBadge} />;
};

// Quote type badge component using global Tag component
const QuoteTypeBadge: React.FC<{ type: Quote['type'] }> = ({ type }) => {
  // Convert first letter to uppercase for display
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  return <Tag type={type.toLowerCase() as any} label={label} className={styles.typeBadge} />;
};

export const QuotesTable: React.FC<QuotesTableProps> = ({ quotes, isLoading = false }) => {
  const router = useRouter();

  // Define columns for the table - client, type, status, and total
  const columns: TableColumn<Quote>[] = [
    {
      header: 'Client',
      accessor: 'clientName',
    },
    {
      header: 'Type',
      accessor: (quote) => <QuoteTypeBadge type={quote.type} />,
      className: styles.centerAlign
    },
    {
      header: 'Status',
      accessor: (quote) => <StatusBadge status={quote.status} />,
      className: styles.centerAlign
    },
    {
      header: 'Total',
      accessor: (quote) => formatCurrency(quote.total),
      className: styles.rightAlign
    }
  ];

  // Handle row click to view quote details
  const handleRowClick = (quote: Quote) => {
    router.push(`/quotes/${quote.id}`);
  };

  return (
    <DataTable<Quote>
      columns={columns}
      data={quotes}
      keyField="id"
      onRowClick={handleRowClick}
      isLoading={isLoading}
      emptyMessage="No quotes found"
      className={styles.quotesTable}
    />
  );
};

export default QuotesTable;
