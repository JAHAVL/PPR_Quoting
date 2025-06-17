import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { quotesAPI, clientsAPI } from '../../../lib/api';
import PageContainer from '../../../components/layout/PageContainer';
import AddClientModal from '../../../components/modals/AddClientModal';
import styles from '../../../styles/ClientQuote.module.css';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import Image from 'next/image';

interface LineItem {
  id: number;
  quoteId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Quote {
  id: number;
  clientId?: number;
  clientName?: string;
  projectId?: number;
  title: string;
  description?: string;
  date: string;
  expiryDate?: string;
  total: number;
  status: string;
  type: string;
  lineItems: LineItem[];
  created_at: string;
  updated_at: string;
}

const ClientQuoteView = () => {
  const router = useRouter();
  const { id } = router.query;
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [isAttachingClient, setIsAttachingClient] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [attachClientSuccess, setAttachClientSuccess] = useState(false);
  const [attachClientError, setAttachClientError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuoteData();
      fetchClients();
    }
  }, [id]);
  
  // Fetch all clients for the dropdown
  const fetchClients = async () => {
    try {
      const data = await clientsAPI.getAll();
      setClients(data);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    }
  };

  const fetchQuoteData = async () => {
    try {
      setLoading(true);
      const data = await quotesAPI.getById(id as string);
      setQuote(data);
      if (data.clientId) {
        setSelectedClientId(data.clientId);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch quote:', err);
      setError('Failed to load quote details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle client selection change
  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = parseInt(e.target.value);
    setSelectedClientId(clientId || null);
  };
  
  // Handle attaching client to quote
  const handleAttachClient = async () => {
    if (!selectedClientId || !quote) return;
    
    try {
      setIsAttachingClient(true);
      setAttachClientError(null);
      
      // Find the selected client to get their name
      const selectedClient = clients.find(client => client.id === selectedClientId);
      
      // Update the quote with the client information
      await quotesAPI.update(quote.id.toString(), {
        ...quote,
        clientId: selectedClientId,
        clientName: selectedClient?.name || 'Unknown Client'
      });
      
      // Update local state
      setQuote(prev => prev ? {
        ...prev,
        clientId: selectedClientId,
        clientName: selectedClient?.name || 'Unknown Client'
      } : null);
      
      setAttachClientSuccess(true);
      setTimeout(() => setAttachClientSuccess(false), 3000); // Clear success message after 3 seconds
    } catch (err) {
      console.error('Failed to attach client:', err);
      setAttachClientError('Failed to attach client to quote. Please try again.');
    } finally {
      setIsAttachingClient(false);
    }
  };
  
  // Handle new client added
  const handleClientAdded = () => {
    fetchClients(); // Refresh client list
    setShowAddClientModal(false);
  };

  // Group line items by type for better organization
  const groupLineItems = (items: LineItem[]) => {
    const grouped: { [key: string]: LineItem[] } = {};
    
    items.forEach(item => {
      // Extract category from description (e.g., "Pavers - ", "Wall - ")
      const category = item.description.includes(' - ') 
        ? item.description.split(' - ')[0] 
        : 'Other';
      
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    
    return grouped;
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Paver Pressure & Repair - Your Quote</title>
          <meta name="description" content="Paver Pressure and Repair Quote" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageContainer>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading your quote...</p>
          </div>
        </PageContainer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Paver Pressure & Repair - Error</title>
          <meta name="description" content="Paver Pressure and Repair Quote" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageContainer>
          <div className={styles.errorContainer}>
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={fetchQuoteData}
            >
              Retry
            </button>
          </div>
        </PageContainer>
      </>
    );
  }

  if (!quote) {
    return (
      <>
        <Head>
          <title>Paver Pressure & Repair - Quote Not Found</title>
          <meta name="description" content="Paver Pressure and Repair Quote" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageContainer>
          <div className={styles.notFoundContainer}>
            <h2>Quote Not Found</h2>
            <p>The requested quote could not be found.</p>
          </div>
        </PageContainer>
      </>
    );
  }

  const groupedItems = quote.lineItems ? groupLineItems(quote.lineItems) : {};

  return (
    <>
      <Head>
        <title>Paver Pressure & Repair - Your Quote</title>
        <meta name="description" content={`Paver Pressure and Repair - Quote: ${quote.title}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageContainer>
        <div className={styles.clientQuoteContainer}>
          <div className={styles.quoteHeader}>
            <div className={styles.logoContainer}>
              <Image 
                src="/logo.png" 
                alt="Paver Pressure & Repair Logo" 
                width={180} 
                height={60} 
              />
            </div>
            <h1 className={styles.quoteTitle}>Your Quote</h1>
            
            {/* Client Attachment Section */}
            <div className={styles.clientAttachmentSection}>
              {quote?.clientId ? (
                <div className={styles.attachedClientInfo}>
                  <span className={styles.attachedClientLabel}>Quote for client:</span>
                  <span className={styles.attachedClientName}>{quote.clientName}</span>
                </div>
              ) : (
                <div className={styles.clientAttachmentControls}>
                  <label htmlFor="client-select" className={styles.clientSelectLabel}>
                    Attach this quote to a client:
                  </label>
                  <div className={styles.clientSelectionRow}>
                    <select 
                      id="client-select"
                      className={styles.clientSelect}
                      value={selectedClientId || ''}
                      onChange={handleClientChange}
                    >
                      <option value="">Select a client...</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
                    <button 
                      className={styles.attachClientButton}
                      onClick={handleAttachClient}
                      disabled={!selectedClientId || isAttachingClient}
                    >
                      {isAttachingClient ? 'Attaching...' : 'Attach'}
                    </button>
                    <button 
                      className={styles.newClientButton}
                      onClick={() => setShowAddClientModal(true)}
                    >
                      New Client
                    </button>
                  </div>
                  {attachClientSuccess && (
                    <div className={styles.successMessage}>
                      Client successfully attached to quote!
                    </div>
                  )}
                  {attachClientError && (
                    <div className={styles.errorMessage}>
                      {attachClientError}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={styles.quoteInfo}>
            <div className={styles.infoSection}>
              <h3>Prepared For:</h3>
              <p className={styles.clientName}>{quote.clientName}</p>
            </div>
            <div className={styles.infoSection}>
              <h3>Quote Date:</h3>
              <p>{formatDate(quote.date)}</p>
              {quote.expiryDate && (
                <p className={styles.expiryDate}>Valid until: {formatDate(quote.expiryDate)}</p>
              )}
            </div>
          </div>

          {quote.description && (
            <div className={styles.quoteDescription}>
              <h3>Project Overview:</h3>
              <p>{quote.description}</p>
            </div>
          )}

          <div className={styles.quoteContent}>
            <h2>What's Included:</h2>
            
            {Object.keys(groupedItems).length > 0 ? (
              <div className={styles.includedItems}>
                {Object.entries(groupedItems).map(([category, items]) => (
                  <div key={category} className={styles.categorySection}>
                    <h3 className={styles.categoryTitle}>{category}</h3>
                    <ul className={styles.itemsList}>
                      {items.map(item => (
                        <li key={item.id} className={styles.itemDescription}>
                          {item.description.includes(' - ') 
                            ? item.description.split(' - ')[1] 
                            : item.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>No items found for this quote.</p>
            )}
          </div>

          <div className={styles.quoteTotalSection}>
            <div className={styles.totalContainer}>
              <h2 className={styles.totalLabel}>Total Investment:</h2>
              <div className={styles.totalAmount}>{formatCurrency(quote.total)}</div>
            </div>
          </div>

          <div className={styles.quoteFooter}>
            <p className={styles.footerText}>Thank you for considering Paver Pressure & Repair for your project.</p>
            <p className={styles.contactInfo}>For any questions, please contact us at: <strong>(555) 123-4567</strong> or <strong>info@paverpressurerepair.com</strong></p>
          </div>
        </div>
      </PageContainer>
      
      {/* Add Client Modal */}
      <AddClientModal 
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        onClientAdded={handleClientAdded}
      />
    </>
  );
};

export default ClientQuoteView;
