import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { quotesAPI } from '../../lib/api';
import PageContainer from '../../components/layout/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import Tag from '../../components/badges/Tag';
import styles from '../../styles/DetailPage.module.css';
import { formatCurrency, formatDate } from '../../utils/formatters';
import QuoteIcon from '../../components/icons/QuoteIcon';

interface LineItem {
  id: number;
  quoteId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Quote {
  id: number;
  clientId: number;
  clientName: string;
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

const QuoteDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuoteData();
    }
  }, [id]);

  const fetchQuoteData = async () => {
    try {
      setLoading(true);
      const data = await quotesAPI.getById(id as string);
      setQuote(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch quote:', err);
      setError('Failed to load quote details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft': return 'blue';
      case 'sent': return 'purple';
      case 'accepted': return 'green';
      case 'declined': return 'red';
      default: return 'gray';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'install': return 'green';
      case 'mx': return 'blue';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>PPR - Loading Quote</title>
          <meta name="description" content="Paver Pressure and Repair Quote Details" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageContainer>
          <PageHeader 
            title="PPR" 
            showBackButton={true}
            backHref="/quotes" 
          />
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading quote details...</p>
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
          <meta name="description" content="Paver Pressure and Repair Quote Details" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageContainer>
          <PageHeader 
            title="PPR" 
            showBackButton={true}
            backHref="/quotes" 
          />
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
          <title>PPR - Quote Not Found</title>
          <meta name="description" content="Paver Pressure and Repair Quote Details" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageContainer>
          <PageHeader 
            title="PPR" 
            showBackButton={true}
            backHref="/quotes" 
          />
          <div className={styles.notFoundContainer}>
            <h2>Quote Not Found</h2>
            <p>The requested quote could not be found.</p>
            <button 
              className={styles.backButton}
              onClick={() => router.push('/quotes')}
            >
              Back to Quotes
            </button>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>PPR - {quote.title}</title>
        <meta name="description" content={`Paver Pressure and Repair - Quote: ${quote.title}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageContainer>
        <PageHeader 
          title="PPR" 
          showBackButton={true}
          backHref="/quotes" 
        />
        
        <main className={styles.main}>
          <div className={styles.pageHeader}>
            <div className={styles.titleContainer}>
              <QuoteIcon className={styles.pageIcon} />
              <h1 className={styles.pageTitle}>{quote.title}</h1>
            </div>
          </div>
          
          <div className={styles.detailContainer}>
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <div className={styles.tags}>
                  <Tag type={getStatusColor(quote.status) as any} label={quote.status} />
                  <Tag type={getTypeColor(quote.type) as any} label={quote.type} />
                </div>
              </div>
              <div className={styles.headerRight}>
                <div className={styles.totalAmount}>
                  {formatCurrency(quote.total)}
                </div>
                <div className={styles.buttonGroup}>
                  <button 
                    className={`${styles.viewClientButton}`}
                    onClick={() => router.push(`/quotes/view/${quote.id}`)}
                  >
                    View Client Quote
                  </button>
                  <button 
                    className={styles.editButton}
                    onClick={() => console.log('Edit quote')}
                  >
                    Edit Quote
                  </button>
                </div>
              </div>
            </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3>Client</h3>
            <p>{quote.clientName}</p>
            <button 
              className={styles.viewButton}
              onClick={() => router.push(`/clients/${quote.clientId}`)}
            >
              View Client
            </button>
          </div>

          {quote.projectId && (
            <div className={styles.infoCard}>
              <h3>Project</h3>
              <p>Project #{quote.projectId}</p>
              <button 
                className={styles.viewButton}
                onClick={() => router.push(`/projects/${quote.projectId}`)}
              >
                View Project
              </button>
            </div>
          )}

          <div className={styles.infoCard}>
            <h3>Date</h3>
            <p>{formatDate(quote.date)}</p>
            {quote.expiryDate && (
              <p>Expires: {formatDate(quote.expiryDate)}</p>
            )}
          </div>
        </div>

        {quote.description && (
          <div className={styles.section}>
            <h2>Description</h2>
            <div className={styles.descriptionBox}>
              {quote.description}
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h2>Line Items</h2>
          {quote.lineItems && quote.lineItems.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.lineItemsTable}>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.lineItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.unitPrice)}</td>
                      <td>{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className={styles.totalLabel}>Total</td>
                    <td className={styles.totalValue}>{formatCurrency(quote.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className={styles.emptyState}>No line items found for this quote.</p>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.metaInfo}>
            <p>Created: {formatDate(quote.created_at)}</p>
            <p>Last Updated: {formatDate(quote.updated_at)}</p>
          </div>
        </div>
      </div>
    </main>
  </PageContainer>
</>
  );
};

export default QuoteDetailsPage;
