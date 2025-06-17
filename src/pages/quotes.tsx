import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Quotes.module.css';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import QuotesTable, { Quote } from '../components/tables/QuotesTable';
import QuoteIcon from '../components/icons/QuoteIcon';
import { useQuotes } from '../contexts/QuotesContext';

const QuotesPage: React.FC = () => {
  const router = useRouter();
  const { quotes, loading, error, fetchQuotes } = useQuotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter quotes based on search term
  const filteredQuotes = quotes.filter(quote => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (quote.clientName?.toLowerCase() || '').includes(searchLower) ||
      (quote.address?.toLowerCase() || '').includes(searchLower) ||
      (quote.status?.toLowerCase() || '').includes(searchLower) ||
      (quote.type?.toLowerCase() || '').includes(searchLower)
    );
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle create new quote button click
  const handleCreateQuote = () => {
    router.push('/install-quote');
  };

  return (
    <>
      <Head>
        <title>PPR - Quotes</title>
        <meta name="description" content="Paver Pressure and Repair Quotes" />
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
              <QuoteIcon className={styles.pageIcon} />
              <h1 className={styles.pageTitle}>Quotes</h1>
              <button 
                className={styles.createButton}
                onClick={handleCreateQuote}
                aria-label="Create new quote"
              >
                +
              </button>
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <p>Loading quotes...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <QuotesTable quotes={filteredQuotes} isLoading={isLoading} />
            </div>
          )}
        </main>
      </PageContainer>
    </>
  );
};

export default QuotesPage;
