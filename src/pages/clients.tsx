import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Clients.module.css';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import ClientsTable, { Client } from '../components/tables/ClientsTable';
import ClientIcon from '../components/icons/ClientIcon';
import { api } from '../lib/api';
import AddClientModal from '../components/modals/AddClientModal';



const ClientsPage: React.FC = () => {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await api.clients.getAll();
        
        // Transform the data to match the expected format for ClientsTable
        const formattedClients = data.map((client: any) => ({
          id: client.id,
          name: client.name,
          email: client.email || '',
          phone: client.phone || '',
          address: client.address || '',
          joinDate: client.joinDate || '',
          status: client.status,
          projectCount: client.projectCount || 0
        }));
        
        setClients(formattedClients);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch clients:', err);
        setError('Failed to load clients. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filter clients based on search term
  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.includes(searchTerm) ||
      client.address.toLowerCase().includes(searchLower) ||
      client.status.toLowerCase().includes(searchLower)
    );
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle create new client button click
  const handleCreateClient = () => {
    setIsAddModalOpen(true);
  };
  
  // Handle client added successfully
  const handleClientAdded = () => {
    // Refresh the clients list
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await api.clients.getAll();
        
        // Transform the data to match the expected format for ClientsTable
        const formattedClients = data.map((client: any) => ({
          id: client.id,
          name: client.name,
          email: client.email || '',
          phone: client.phone || '',
          address: client.address || '',
          joinDate: client.joinDate || '',
          status: client.status,
          projectCount: client.projectCount || 0
        }));
        
        setClients(formattedClients);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch clients:', err);
        setError('Failed to load clients. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  };

  return (
    <>
      <Head>
        <title>PPR - Clients</title>
        <meta name="description" content="Paver Pressure and Repair Clients" />
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
              <ClientIcon className={styles.pageIcon} />
              <h1 className={styles.pageTitle}>Clients</h1>
              <button 
                className={styles.createButton}
                onClick={handleCreateClient}
                aria-label="Create new client"
              >
                +
              </button>
            </div>
          </div>

          {/* Search is handled by the top navigation search bar */}

          {loading ? (
            <div className={styles.loadingContainer}>
              <p>Loading clients...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <ClientsTable clients={filteredClients} isLoading={isLoading} />
            </div>
          )}
          
          {/* Add Client Modal */}
          <AddClientModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onClientAdded={handleClientAdded}
          />
        </main>
      </PageContainer>
    </>
  );
};

export default ClientsPage;
