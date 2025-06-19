import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const hasLoadedFromSession = useRef(false);
  const autoSaveCompleted = useRef(false);

  // Fetch clients from database
  const fetchClients = useCallback(async () => {
    try {
      const data = await clientsAPI.getAll();
      setClients(data || []);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
      // Optionally set an error state here if needed for UI
    }
  }, []); // No dependencies as clientsAPI and setClients are stable

  // Fetch quote from database by ID
  const fetchQuoteFromDatabase = useCallback(async (quoteIdToFetch: string) => {
    try {
      const response = await quotesAPI.getById(quoteIdToFetch);
      
      if (!response) {
        setError('Quote not found in database.');
        setParsedQuote(null);
        return;
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

            // Extract paver sealing
            // if (parsedData.inputs.paverSealing === true || parsedData.inputs.paverSealing === 'true') {
            //   parsedData.isPaverSealing = true;
            // }

            // Extract pressureWashing
            // if (parsedData.inputs.pressureWashing === true || parsedData.inputs.pressureWashing === 'true') {
            //   parsedData.isPressureWashing = true;
            // }

            // Extract drainage and corrections
            // if (parsedData.inputs.drainageCorrections === true || parsedData.inputs.drainageCorrections === 'true') {
            //   parsedData.isDrainageCorrections = true;
            // }
          }
        } catch (e) {
          console.error('Failed to parse quote inputs:', e);
          setError('Quote data is corrupted (inputs).');
          setParsedQuote(null);
          return;
        }
      }
      
      setParsedQuote(parsedData);
      setError(null); // Clear any previous errors

    } catch (err: any) {
      console.error('Failed to fetch quote from database:', err);
      setError(err.message || 'Failed to load quote from database.');
      setParsedQuote(null);
    }
  }, [setSelectedClientId, setParsedQuote, setError]); // quotesAPI is stable

  // Fetch quote based on router query
  const fetchQuote = useCallback(async () => {
    const queryId = router.query.id;
    if (!queryId) return;
    await fetchQuoteFromDatabase(queryId as string);
  }, [router.query.id, fetchQuoteFromDatabase]);
  
  // Fetch quote data when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      setError(null); // Reset error state

      // Always fetch clients
      await fetchClients();

      // Try to load from sessionStorage first
      const storedQuoteJSON = sessionStorage.getItem('currentQuote');
      if (storedQuoteJSON) {
        console.log('[ViewQuotePage] Found quote in sessionStorage.');
        try {
          const quoteFromStorage: QuoteDetailsData = JSON.parse(storedQuoteJSON);
          setParsedQuote(quoteFromStorage);
          if (quoteFromStorage.clientId) {
            setSelectedClientId(quoteFromStorage.clientId);
          }
          // sessionStorage.removeItem('currentQuote'); // DO NOT REMOVE YET
          hasLoadedFromSession.current = true; // Set flag to prevent error on re-run

          // Auto-save the quote to the database if it's the first load from session
          if (!autoSaveCompleted.current) {
            autoSaveCompleted.current = true; // Mark as triggered to prevent re-saves
            console.log('[ViewQuotePage] Auto-saving quote from session...');
            // We don't need to await this. Let it run in the background.
            // It will handle updating the quotes list via context on its own.
            saveQuoteToDatabase(quoteFromStorage);
          }

          // Successfully loaded from session, no need to fetch by ID or set loading to false explicitly as setParsedQuote handles UI update.
          return;
        } catch (e) {
          console.error("[ViewQuotePage] Failed to parse quote from sessionStorage:", e);
          setError("Failed to load quote data from session. It might be corrupted.");
          // Fall through to try fetching by ID if session parse fails, error is set.
        }
      }

      // If not in sessionStorage (or parse failed), try fetching by ID from router query
      if (router.isReady && router.query.id) {
        console.log(`[ViewQuotePage] No quote in session or parse failed, fetching by ID: ${router.query.id}`);
        await fetchQuote(); // fetchQuote calls fetchQuoteFromDatabase which sets parsedQuote or error
      } else if (router.isReady && !storedQuoteJSON) { // Only if not found in session and no ID
        // This case means router is ready, no ID in URL, and nothing was in session.
        // If parsedQuote is still null at this point, the UI will show "Loading..."
        // To avoid indefinite loading, set an error if no specific error has been set yet.
        // Only set error if we haven't just loaded from session storage.
        if (!error && !hasLoadedFromSession.current) { 
            console.log('[ViewQuotePage] No quote ID in URL and no quote found in session.');
            setError("No quote to display. Please generate a new quote or select one from the list.");
        }
      }
      // If router is not ready, useEffect will re-run when it becomes ready.
      // If fetchQuote is called, it handles setting parsedQuote or error, which updates loading state implicitly.
    };

    loadInitialData();
  }, [router.isReady, router.query.id, fetchClients, fetchQuote]); // Dependencies for the effect

  
  // Save quote to database
  const saveQuoteToDatabase = async (quote: QuoteDetailsData, clientIdOverride?: string): Promise<number | null> => {
    try {
      let finalClientId = clientIdOverride || selectedClientId;

      // If no client is selected (e.g., during auto-save), find or create a default "Walk-in Customer"
      if (!finalClientId) {
        console.log("[ViewQuotePage] No client selected. Finding or creating 'Walk-in Customer'.");
        try {
          let defaultClient = clients.find(c => c.name === 'Walk-in Customer');

          if (!defaultClient) {
            // Fetch all clients again to ensure we have the latest list before deciding to create
            const allClientsFresh = await clientsAPI.getAll();
            defaultClient = allClientsFresh.find(c => c.name === 'Walk-in Customer');
            
            if (!defaultClient) {
              console.log("[ViewQuotePage] 'Walk-in Customer' not found, creating...");
              // Ensure all required fields for client creation are provided, even if empty strings
              defaultClient = await clientsAPI.create({ 
                name: 'Walk-in Customer', 
                email: '', 
                phone: '', 
                address: '' 
              });
              await fetchClients(); // Refresh client list in component state
            }
          }
          
          if (defaultClient && defaultClient.id) {
            finalClientId = defaultClient.id.toString();
            setSelectedClientId(finalClientId); // Update UI state
            console.log(`[ViewQuotePage] Using 'Walk-in Customer' with ID: ${finalClientId}`);
          } else {
            throw new Error("Failed to find or create a default 'Walk-in Customer'. Check API response for client creation.");
          }
        } catch (clientError) {
          console.error("[ViewQuotePage] Error handling default client:", clientError);
          const clientErrorMessage = clientError instanceof Error ? clientError.message : "Unknown client error";
          setSaveQuoteError(`Failed to prepare a client for saving the quote: ${clientErrorMessage}. Please select one manually or try again.`);
          return null;
        }
      }

      if (!finalClientId) {
        setSaveQuoteError("Could not determine a client to associate the quote with. Save failed.");
        return null;
      }

      // Prepare quote data for database
      const clientForName = clients.find(c => c.id?.toString() === finalClientId?.toString());
      const quoteData = {
        title: quote.title || quote.serviceName || 'New Quote', // Ensure title is never empty
        description: quote.description || '',
        date: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        type: quote.serviceName || 'Install',
        total: quote.finalCustomerPrice || quote.total || 0, // Ensure total is never undefined or null
        clientId: finalClientId,
        clientName: clientForName ? clientForName.name : 'Walk-in Customer',
        inputs: JSON.stringify(quote.inputs || {}),
        calculations: JSON.stringify(quote.calculations || {})
      };
      
      // Client-side validation before sending to API
      if (!quoteData.clientId || !quoteData.title || typeof quoteData.total === 'undefined' || quoteData.total === null) {
          const validationErrorMsg = `Client-side validation failed: Client ID: ${quoteData.clientId}, Title: ${quoteData.title}, Total: ${quoteData.total}`;
          console.error(validationErrorMsg);
          setSaveQuoteError("Quote data is incomplete. Client ID, Title, and a valid Total are required.");
          return null;
      }

      console.log('[ViewQuotePage] Sending quote data to API:', JSON.parse(JSON.stringify(quoteData))); // Deep copy for logging
      const createdQuote = await quotesAPI.create(quoteData);
      
      if (createdQuote && createdQuote.id) {
        console.log('[ViewQuotePage] Quote successfully created with ID:', createdQuote.id);
        sessionStorage.removeItem('pendingQuote');
        sessionStorage.removeItem('currentQuote');
        setSavedQuoteId(createdQuote.id);
        fetchQuotes(); // Update global quotes list
        
        console.log(`[ViewQuotePage] Auto-save successful. Updating URL to /view-quote?id=${createdQuote.id}`);
        router.push(`/view-quote?id=${createdQuote.id}`, undefined, { shallow: true });

        // For debugging: Fetch the quote we just saved and log it for verification
        try {
          console.log(`[ViewQuotePage] Verifying saved quote. Fetching quote with ID: ${createdQuote.id}`);
          const savedQuoteFromDB = await quotesAPI.getById(createdQuote.id.toString());
          console.log('[ViewQuotePage] Data retrieved from DB for quote ID ' + createdQuote.id + ':', JSON.parse(JSON.stringify(savedQuoteFromDB)));
          console.log('[ViewQuotePage] Original data sent to API for quote ID ' + createdQuote.id + ':', JSON.parse(JSON.stringify(quoteData)));
        } catch (verificationError) {
          console.error(`[ViewQuotePage] Error verifying saved quote with ID ${createdQuote.id}:`, verificationError);
        }
        
        return createdQuote.id;
      } else {
        const errorMsg = 'Failed to save quote: The server did not return a valid quote ID after creation.';
        console.error(errorMsg, 'API Response:', createdQuote);
        setSaveQuoteError(errorMsg);
        return null;
      }
    } catch (err) {
      console.error('[ViewQuotePage] Failed to save quote to database:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during save.';
      setSaveQuoteError(`Failed to save quote. Server error: "${errorMessage}"`);
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
                
                {/* Display current client if one is selected */}
                {selectedClientId && (
                  <div className={styles.clientInfo} style={{ marginBottom: '1rem' }}>
                    <div className={styles.quoteItem}>
                      <span>Currently attached client:</span>
                      <span className={styles.price}>
                        {clients.find(client => client.id === selectedClientId)?.name || 'Selected Client'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Always display the client selection dropdown */}
                <div>
                  <div className={styles.formGroup}>
                    <label htmlFor="client-select">
                      {selectedClientId ? 'Change or confirm attached client:' : 'Attach this quote to a client:'}
                    </label>
                    <div className={styles.selectWithButton}>
                      <select 
                        id="client-select"
                        value={selectedClientId || ''} // Ensures the dropdown reflects the current state
                        onChange={handleClientChange}
                        className={styles.clientSelect}
                        disabled={isAttachingClient} // Disable while an attachment is in progress
                      >
                        <option value="">Select a client...</option>
                        <option value="add_new" className={styles.addNewOption}>+ Add New Client</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Success and Error Messages for client attachment */}
                {attachClientSuccess && (
                  <div className={styles.successMessage} style={{ marginTop: '1rem' }}>
                    Client successfully attached to quote!
                  </div>
                )}
                {attachClientError && (
                  <div className={styles.errorMessage} style={{ marginTop: '1rem' }}>
                    {attachClientError}
                  </div>
                )}
              </div>
            )}
          </div> {/* Closing div for styles.grid */}
        </div> {/* Closing div for styles.container */}
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
