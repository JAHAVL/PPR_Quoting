import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PageContainer from '../../components/layout/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import Tag, { TagType } from '../../components/badges/Tag';
import styles from '../../styles/DetailPage.module.css';
import { formatDate, formatCurrency } from '../../utils/formatters';
import ClientIcon from '../../components/icons/ClientIcon';
import CallButton from '../../components/buttons/actionbuttons/CallButton';
import EmailButton from '../../components/buttons/actionbuttons/EmailButton';
import EditButton from '../../components/buttons/actionbuttons/EditButton';
import AddButton from '../../components/buttons/actionbuttons/AddButton';
import ActivityChat from '../../components/activity/ActivityChat';
import ClientMap from '../../components/maps/ClientMap';
import EditClientModal from '../../components/modals/EditClientModal';
import { clientsAPI, projectsAPI } from '../../lib/api';
import { useQuotes } from '../../contexts/QuotesContext';

interface Client {
  id: string; // Changed from number to string to match database schema
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  created_at: string;
  updated_at: string;
  lifetimeValue?: number;
}

interface RelatedItem {
  id: string; // Changed from number to string to match database schema
  title: string;
  status: string;
  date: string;
}

const ClientDetailsPage = () => {
  // Get quotes from context
  const { quotes: allQuotes } = useQuotes();
  const router = useRouter();
  const { id } = router.query;
  const [client, setClient] = useState<Client | null>(null);
  // Filter quotes for this client using context data
  const relatedQuotes = useMemo(() => {
    if (!id || !allQuotes) return [];
    
    return allQuotes
      .filter(q => String(q.clientId) === String(id))
      .map(q => ({
        id: q.id,
        title: q.title || `Quote #${q.id}`,
        status: q.status || 'draft',
        date: q.date || q.created_at || new Date().toISOString().split('T')[0]
      }));
  }, [allQuotes, id]);
  const [relatedProjects, setRelatedProjects] = useState<RelatedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      console.log('Client ID changed, fetching data for ID:', id);
      fetchClientData();
    }
  }, [id]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const data = await clientsAPI.getById(id as string);
      console.log('Client data from API:', data);
      console.log('Client address from API:', data?.address);
      
      // Fetch related projects
      console.log('Current client ID:', id, 'Type:', typeof id);
      
      const projects = await projectsAPI.getAll();
      const filteredProjects = projects.filter(p => String(p.clientId) === String(id))
        .map(p => ({
          id: p.id,
          title: p.title,
          status: p.status,
          date: p.startDate || p.created_at
        }));
      
      // Calculate lifetime value from accepted quotes
      const acceptedQuotes = relatedQuotes.filter(q => 
        q.status?.toLowerCase() === 'accepted'
      );
      
      const lifetimeValue = acceptedQuotes.reduce((sum, quote) => {
        // Use total instead of totalAmount to match the quote structure
        const quoteTotal = allQuotes.find(q => q.id === quote.id)?.total || 0;
        return sum + quoteTotal;
      }, 0);
      
      // Update client with lifetime value
      const clientWithLifetimeValue = {
        ...data,
        lifetimeValue
      };
      
      setClient(clientWithLifetimeValue);
      setRelatedProjects(filteredProjects);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch client:', err);
      setError('Failed to load client details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTagType = (status: string): TagType => {
    switch (status.toLowerCase()) {
      case 'prospect': return 'pending';
      case 'active': return 'approved';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>PPR - Loading Client</title>
          <meta name="description" content="Paver Pressure and Repair Client Details" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageContainer>
          <PageHeader 
            title="PPR" 
            showBackButton={true}
            backHref="/clients" 
          />
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading client details...</p>
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
          <meta name="description" content="Paver Pressure and Repair Client Details" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageContainer>
          <PageHeader 
            title="PPR" 
            showBackButton={true}
            backHref="/clients" 
          />
          <div className={styles.errorContainer}>
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={fetchClientData}
            >
              Retry
            </button>
          </div>
        </PageContainer>
      </>
    );
  }

  if (!client) {
    return (
      <>
        <Head>
          <title>PPR - Client Not Found</title>
          <meta name="description" content="Paver Pressure and Repair Client Details" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageContainer>
          <PageHeader 
            title="PPR" 
            showBackButton={true}
            backHref="/clients" 
          />
          <div className={styles.notFoundContainer}>
            <h2>Client Not Found</h2>
            <p>The requested client could not be found.</p>
            <button 
              className={styles.backButton}
              onClick={() => router.push('/clients')}
            >
              Back to Clients
            </button>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>PPR - {client.name}</title>
        <meta name="description" content={`Paver Pressure and Repair - Client: ${client.name}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageContainer>
        <PageHeader 
          title="PPR" 
          showBackButton={true}
          backHref="/clients" 
        />
        
        <main className={styles.main}>
          <div className={styles.pageHeader}>
            <div className={styles.titleContainer}>
              <ClientIcon className={styles.pageIcon} />
              <h1 className={styles.pageTitle}>{client.name}</h1>
              {client.phone || client.email ? (
                <div className={styles.titleActions}>
                  {client.email && (
                    <EmailButton 
                      email={client.email} 
                      clientId={client.id.toString()} 
                    />
                  )}
                  {client.phone && (
                    <CallButton 
                      phone={client.phone} 
                      clientId={client.id.toString()} 
                    />
                  )}
                </div>
              ) : null}
            </div>
          </div>
          

          {/* Recent Activity Section */}
          <div className={styles.sectionContainer}>
            <div className={styles.detailsHeader}>
              <div className={styles.headerLeft}>
                <h2>Recent Activity</h2>
              </div>
            </div>
            <ActivityChat clientId={client.id.toString()} />
          </div>

          {/* Client Details Section */}
          <div className={styles.sectionContainer}>
            <div className={styles.detailsHeader}>
              <div className={styles.headerLeft}>
                <Tag type={getStatusTagType(client.status)} label={client.status} />
              </div>
              <div className={styles.headerRight}>
                <EditButton 
                  onClick={() => setIsEditModalOpen(true)}
                  className={styles.editIconButton}
                />
              </div>
            </div>

            <div className={styles.clientDetails}>
              {client.lifetimeValue !== undefined && (
                <div className={styles.lifetimeValue}>
                  <h3>Lifetime Value</h3>
                  <p className={styles.valueAmount}>{formatCurrency(client.lifetimeValue)}</p>
                </div>
              )}
              {client.address && (
                <>
                  <div className={styles.addressContainer}>
                    <p className={styles.addressText}>{client.address}</p>
                  </div>
                  {client.address ? (
                    <ClientMap address={client.address} />
                  ) : (
                    <div className={styles.emptyState}>No address provided for this client.</div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Quotes Section */}
          <div className={styles.sectionContainer}>
            <div className={styles.detailsHeader}>
              <div className={styles.headerLeft}>
                <h2>Quotes</h2>
              </div>
              <div className={styles.headerRight}>
                <AddButton 
                  onClick={() => router.push(`/install-quote?clientId=${client.id}`)}
                  className={styles.editIconButton}
                />
              </div>
            </div>
            {relatedQuotes.length > 0 ? (
              <div className={styles.tableContainer}>
                <table className={styles.lineItemsTable}>
                  <thead>
                    <tr>
                      <th>Quote</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatedQuotes.map((quote) => (
                      <tr key={quote.id}>
                        <td>{quote.title}</td>
                        <td>
                          <Tag 
                            type={(quote.status.toLowerCase() === 'draft' ? 'default' :
                              quote.status.toLowerCase() === 'sent' ? 'pending' :
                              quote.status.toLowerCase() === 'accepted' ? 'approved' :
                              quote.status.toLowerCase() === 'declined' ? 'rejected' : 'default') as any} 
                            label={quote.status}
                          />
                        </td>
                        <td>{formatDate(quote.date)}</td>
                        <td>
                          <button 
                            className={styles.viewButton}
                            onClick={() => router.push(`/quotes/${quote.id}`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={styles.emptyState}>No quotes found for this client.</p>
            )}
          </div>

          {/* Projects Section */}
          <div className={styles.sectionContainer}>
            <h2>Projects</h2>
            {relatedProjects.length > 0 ? (
              <div className={styles.tableContainer}>
                <table className={styles.lineItemsTable}>
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatedProjects.map((project) => (
                      <tr key={project.id}>
                        <td>{project.title}</td>
                        <td>
                          <Tag 
                            type={(project.status.toLowerCase() === 'pending' ? 'pending' :
                              project.status.toLowerCase() === 'active' ? 'approved' :
                              project.status.toLowerCase() === 'completed' ? 'completed' :
                              project.status.toLowerCase() === 'cancelled' ? 'rejected' : 'default') as any} 
                            label={project.status}
                          />
                        </td>
                        <td>{formatDate(project.date)}</td>
                        <td>
                          <button 
                            className={styles.viewButton}
                            onClick={() => router.push(`/projects/${project.id}`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={styles.emptyState}>No projects found for this client.</p>
            )}
          </div>
          
          {/* Footer Section */}
          <div className={styles.sectionContainer}>
            <div className={styles.footer}>
              <div className={styles.metaInfo}>
                <p>Created: {formatDate(client.created_at)}</p>
                <p>Last Updated: {formatDate(client.updated_at)}</p>
              </div>
            </div>
          </div>
        </main>
        
        {/* Edit Client Modal */}
        {client && (
          <EditClientModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onClientUpdated={fetchClientData}
            clientId={client.id.toString()}
          />
        )}
      </PageContainer>
    </>
  );
};

export default ClientDetailsPage;
