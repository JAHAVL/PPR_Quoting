import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import AddClientModal from '../components/modals/AddClientModal';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/buttons/Button';
import { costAllocationPercentages } from '../utils/pricingRules';
import QuoteDetails, { QuoteDetailsData } from '../components/quotes/QuoteDetails';

// We're using the QuoteDetailsData interface from the QuoteDetails component instead
import { formatCurrency } from '../utils/helpers';
import { clientsAPI, quotesAPI } from '../lib/api';
import { useQuotes } from '../contexts/QuotesContext';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function ViewQuotePage() {
  const router = useRouter();
  const { fetchQuotes } = useQuotes();
  const { id: quoteId } = router.query;
  
  const [parsedQuote, setParsedQuote] = useState<QuoteDetailsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showAddClientModal, setShowAddClientModal] = useState<boolean>(false);
  const [isAttachingClient, setIsAttachingClient] = useState<boolean>(false);
  const [attachClientSuccess, setAttachClientSuccess] = useState<boolean>(false);
  const [attachClientError, setAttachClientError] = useState<string | null>(null);
  const [isSavingQuote, setIsSavingQuote] = useState<boolean>(false);
  const [saveQuoteError, setSaveQuoteError] = useState<string | null>(null);
  const [savedQuoteId, setSavedQuoteId] = useState<number | null>(null);
  
  // Fetch quote data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      await fetchClients();
      if (router.isReady && router.query.id) {
        await fetchQuote();
      }
    };
    fetchData();
  }, [router.isReady, router.query.id]);
  
  // Fetch quote based on router query
  const fetchQuote = async () => {
    if (!router.query.id) return;
    await fetchQuoteFromDatabase(router.query.id as string);
  };
  
  // Fetch clients from database
  const fetchClients = async () => {
    try {
      const data = await clientsAPI.getAll();
      setClients(data || []);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    }
  };
  
  // Fetch quote from database by ID
  const fetchQuoteFromDatabase = async (quoteId: string) => {
    try {
      const response = await quotesAPI.getById(quoteId);
      
      if (!response) {
        throw new Error('Quote not found');
      }
      
      // Check if the quote has a client attached
      if (response.clientId) {
        setSelectedClientId(response.clientId);
      }
      
      // Parse any JSON fields if needed
      let parsedData: QuoteDetailsData = { ...response };
      
      // Parse inputs if it's a string
      if (typeof response.inputs === 'string' && response.inputs) {
        try {
          parsedData.inputs = JSON.parse(response.inputs);
          
          // Extract feature flags from inputs for the QuoteDetails component
          if (parsedData.inputs) {
            // Extract wall addition
            if (parsedData.inputs.wall === true || parsedData.inputs.wall === 'true') {
              parsedData.isWallAddition = true;
              parsedData.wallLinearFootage = Number(parsedData.inputs.wallLinearFootage || 0);
            }
            
            // Extract grass removal
            if (parsedData.inputs.grassRemoval === true || parsedData.inputs.grassRemoval === 'true') {
              parsedData.isGrassRemoval = true;
            }
            
            // Extract coping addition
            if (parsedData.inputs.coping === true || parsedData.inputs.coping === 'true') {
              parsedData.isCopingAddition = true;
              parsedData.copingLinearFootage = Number(parsedData.inputs.copingLinearFootage || 0);
            }
            
            // Extract square footage
            if (parsedData.inputs.squareFootage) {
              parsedData.squareFootage = Number(parsedData.inputs.squareFootage);
            }
          }
        } catch (e) {
          console.error('Failed to parse quote inputs:', e);
        }
      }
      
      // Parse calculations if it's a string
      if (typeof response.calculations === 'string' && response.calculations) {
        try {
          parsedData.calculations = JSON.parse(response.calculations);
        } catch (e) {
          console.error('Failed to parse quote calculations:', e);
        }
      }
      
      setParsedQuote(parsedData);
      return parsedData;
    } catch (err) {
      console.error('Error fetching quote:', err);
      setError('Failed to load quote. Please try again.');
      return null;
    }
  };
  
  // Save quote to database
  const saveQuoteToDatabase = async (quote: QuoteDetailsData, clientIdOverride?: string): Promise<number | null> => {
    try {
      // Check if we have a client ID from the override or selected client
      const clientId = clientIdOverride || selectedClientId;
      
      // If we don't have a client ID and no override provided, store in session and return
      if (!clientId && !clientIdOverride) {
        console.log('No client selected, storing quote in session storage');
        sessionStorage.setItem('pendingQuote', JSON.stringify(quote));
        return null;
      }
      
      // Prepare quote data for database
      const quoteData = {
        title: quote.title || quote.serviceName || 'Quote',
        description: quote.description || '',
        date: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        status: 'draft',
        type: quote.serviceName || 'Install',
        total: quote.finalCustomerPrice || quote.total || 0,
        clientId: clientId || null,
        clientName: clientId ? clients.find(c => c.id === clientId)?.name || '' : '',
        inputs: JSON.stringify(quote.inputs || {}),
        calculations: JSON.stringify(quote.calculations || {})
      };
      
      // Create quote in database
      const createdQuote = await quotesAPI.create(quoteData);
      console.log('Quote saved to database:', createdQuote);
      
      if (createdQuote && createdQuote.id) {
        // Clear session storage
        sessionStorage.removeItem('pendingQuote');
        
        // Set saved quote ID
        setSavedQuoteId(createdQuote.id);
        
        // Refresh quotes list in context
        fetchQuotes();
        
        return createdQuote.id;
      }
      
      return null;
    } catch (err) {
      console.error('Failed to save quote to database:', err);
      return null;
    }
  };
  
  // Handle client selection change
  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
  
    if (value === 'add_new') {
      // Show add client modal
      setShowAddClientModal(true);
      setSelectedClientId(null);
      return;
    }
  
    // Set selected client ID
    setSelectedClientId(value || null);
  
    // Auto-attach client when selected
    if (value && savedQuoteId) {
      handleAttachClient(value);
    }
  
    // Clear any previous errors
    setAttachClientError(null);
  };
  
  // Handle attaching client to quote
  const handleAttachClient = async (clientId: string) => {
    if (!clientId || !savedQuoteId) {
      console.error('Cannot attach client: missing client ID or quote ID');
      setAttachClientError('Missing client ID or quote ID');
      return;
    }
  
    try {
      setIsAttachingClient(true);
      setAttachClientError(null);
      
      console.log('Attaching client to quote:', {
        quoteId: savedQuoteId,
        clientId
      });
      
      // Use the helper function to attach client to quote
      await attachClientToQuote(savedQuoteId, clientId);
      
      // Refresh the quote data
      await fetchQuote();
      
      // Refresh quotes list in context
      fetchQuotes();
      
      // Show success message
      setAttachClientSuccess(true);
      setTimeout(() => setAttachClientSuccess(false), 3000); // Hide after 3 seconds
      
    } catch (error) {
      console.error('Failed to attach client:', error);
      setAttachClientError('Failed to attach client. Please try again.');
    } finally {
      setIsAttachingClient(false);
    }
  };
  
  // Attach client to quote helper function
  const attachClientToQuote = async (quoteId: string | number, clientId: string) => {
    // Get client details
    const selectedClient = clients.find(client => client.id === clientId);
    const clientName = selectedClient ? selectedClient.name : 'Unknown Client';
    
    // Try to get current quote data
    let currentQuote: any = null;
    try {
      const quoteIdStr = typeof quoteId === 'number' ? quoteId.toString() : quoteId;
      currentQuote = await quotesAPI.getById(quoteIdStr);
    } catch (err) {
      console.error('Failed to fetch quote details:', err);
      // Continue with default values if we can't fetch the quote
    }
    
    // Prepare update data with all required fields
    const updateData = {
      clientId,
      clientName,
      title: currentQuote?.title || parsedQuote?.title || 'Quote',
      total: currentQuote?.total || parsedQuote?.total || 0,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      status: currentQuote?.status || 'pending',
      type: currentQuote?.type || parsedQuote?.serviceName || 'Service'
    };
    
    // Convert quoteId to string if it's a number
    const quoteIdStr = typeof quoteId === 'number' ? quoteId.toString() : quoteId;
    
    // Update quote with client info
    return await quotesAPI.update(quoteIdStr, updateData);
  };
  
  // Handle new client added
  const handleClientAdded = () => {
    fetchClients(); // Refresh client list
    setShowAddClientModal(false);
  };
  
  // Handle saving updated quote
  const handleSaveQuote = async (updatedQuote: QuoteDetailsData) => {
    try {
      setIsSavingQuote(true);
      setSaveQuoteError(null);
      
      console.log('Saving updated quote:', updatedQuote);
      
      // If this is a new quote, create it
      if (!router.query.id) {
        const newQuoteId = await saveQuoteToDatabase(updatedQuote);
        
        if (newQuoteId) {
          // Redirect to the new quote page
          router.push(`/view-quote?id=${newQuoteId}`);
        } else {
          throw new Error('Failed to create new quote');
        }
        return;
      }
      
      // Otherwise update existing quote
      const quoteId = router.query.id as string;
      
      // Prepare quote data for database update
      const updateData = {
        title: updatedQuote.title || updatedQuote.serviceName || 'Quote',
        description: updatedQuote.description || '',
        total: updatedQuote.finalCustomerPrice || updatedQuote.total || 0,
        inputs: JSON.stringify(updatedQuote.inputs || {}),
        calculations: JSON.stringify(updatedQuote.calculations || {})
      };
      
      // Update quote in database
      await quotesAPI.update(quoteId, updateData);
      console.log('Quote updated successfully');
      
      // Refresh quote data
      await fetchQuote();
      
      // Refresh quotes list in context
      fetchQuotes();
      
    } catch (error) {
      console.error('Failed to update quote:', error);
      setSaveQuoteError('Failed to save quote changes. Please try again.');
    } finally {
      setIsSavingQuote(false);
    }
  };
  
  return (
    <PageContainer>
      <Head>
        <title>View Quote | PPR Quoting Software</title>
      </Head>
      
      <PageHeader title="View Full Quote" />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Error Message */}
            {error && (
              <div className={`${styles.card} ${styles.errorCard} ${styles.fullWidth}`}>
                <h3>Error Loading Quote</h3>
                <p>{error}</p>
              </div>
            )}

            {/* Loading State */}
            {!error && !parsedQuote && (
              <div className={`${styles.card} ${styles.fullWidth}`}>
                <h3>Loading Quote...</h3>
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Please wait while we load your quote details.</p>
                </div>
              </div>
            )}

            {/* Quote Details - Now Full Width and First */}
            {parsedQuote && (
              <div className={`${styles.fullWidth}`}>
                <QuoteDetails 
                  quote={parsedQuote} 
                  isEditable={true}
                  onSave={handleSaveQuote}
                />
              </div>
            )}

            {/* Client Attachment Section - Now After Quote Details */}
            {parsedQuote && (
              <div className={`${styles.card} ${styles.fullWidth}`}>
                <h3>Client Information</h3>
                {selectedClientId ? (
                  <div className={styles.clientInfo}>
                    <div className={styles.quoteItem}>
                      <span>Quote for client:</span>
                      <span className={styles.price}>
                        {clients.find(client => client.id === selectedClientId)?.name || 'Selected Client'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className={styles.formGroup}>
                      <label htmlFor="client-select">Attach this quote to a client:</label>
                      <div className={styles.selectWithButton}>
                        <select 
                          id="client-select"
                          value={selectedClientId || ''}
                          onChange={handleClientChange}
                          className={styles.clientSelect}
                        >
                          <option value="">Select a client...</option>
                          <option value="add_new" className={styles.addNewOption}>+ Add New Client</option>
                          {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                          ))}
                        </select>
                      </div>
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
            )}
          </div>
        </div>
      </main>
      
      {/* Add Client Modal */}
      <AddClientModal
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        onClientAdded={handleClientAdded}
      />
    </PageContainer>
  );
}
