import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { projectsAPI, quotesAPI, clientsAPI } from '../../lib/api';
import PageContainer from '../../components/layout/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import Tag from '../../components/badges/Tag';
import styles from '../../styles/DetailPage.module.css';
import { formatCurrency, formatDate } from '../../utils/formatters';
import ProjectIcon from '../../components/icons/ProjectIcon';

interface Project {
  id: number;
  clientId: number;
  clientName: string;
  quoteId?: number;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget: number;
  status: string;
  type: string;
  created_at: string;
  updated_at: string;
}

const ProjectDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [relatedQuote, setRelatedQuote] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const data = await projectsAPI.getById(id as string);
      setProject(data);
      
      // Fetch related quote if exists
      if (data.quoteId) {
        try {
          const quoteData = await quotesAPI.getById(data.quoteId.toString());
          setRelatedQuote(quoteData);
        } catch (err) {
          console.error('Failed to fetch related quote:', err);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch project:', err);
      setError('Failed to load project details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'blue';
      case 'active': return 'green';
      case 'completed': return 'purple';
      case 'cancelled': return 'red';
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
          <title>PPR - Loading Project</title>
          <meta name="description" content="Paver Pressure and Repair Project Details" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageContainer>
          <PageHeader 
            title="PPR" 
            showBackButton={true}
            backHref="/projects" 
          />
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading project details...</p>
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
          <meta name="description" content="Paver Pressure and Repair Project Details" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageContainer>
          <PageHeader 
            title="PPR" 
            showBackButton={true}
            backHref="/projects" 
          />
          <div className={styles.errorContainer}>
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={fetchProjectData}
            >
              Retry
            </button>
          </div>
        </PageContainer>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Head>
          <title>PPR - Project Not Found</title>
          <meta name="description" content="Paver Pressure and Repair Project Details" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageContainer>
          <PageHeader 
            title="PPR" 
            showBackButton={true}
            backHref="/projects" 
          />
          <div className={styles.notFoundContainer}>
            <h2>Project Not Found</h2>
            <p>The requested project could not be found.</p>
            <button 
              className={styles.backButton}
              onClick={() => router.push('/projects')}
            >
              Back to Projects
            </button>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>PPR - {project.title}</title>
        <meta name="description" content={`Paver Pressure and Repair - Project: ${project.title}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageContainer>
        <PageHeader 
          title="PPR" 
          showBackButton={true}
          backHref="/projects" 
        />
        
        <main className={styles.main}>
          <div className={styles.pageHeader}>
            <div className={styles.titleContainer}>
              <ProjectIcon className={styles.pageIcon} />
              <h1 className={styles.pageTitle}>{project.title}</h1>
            </div>
          </div>
          
          <div className={styles.detailContainer}>
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <div className={styles.tags}>
                  <Tag type={getStatusColor(project.status) as any} label={project.status} />
                  <Tag type={getTypeColor(project.type) as any} label={project.type} />
                </div>
              </div>
              <div className={styles.headerRight}>
                <div className={styles.totalAmount}>
                  {formatCurrency(project.budget)}
                </div>
                <button 
                  className={styles.editButton}
                  onClick={() => console.log('Edit project')}
                >
                  Edit Project
                </button>
              </div>
            </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3>Client</h3>
            <p>{project.clientName}</p>
            <button 
              className={styles.viewButton}
              onClick={() => router.push(`/clients/${project.clientId}`)}
            >
              View Client
            </button>
          </div>

          {project.startDate && (
            <div className={styles.infoCard}>
              <h3>Start Date</h3>
              <p>{formatDate(project.startDate)}</p>
            </div>
          )}

          {project.endDate && (
            <div className={styles.infoCard}>
              <h3>End Date</h3>
              <p>{formatDate(project.endDate)}</p>
            </div>
          )}

          {relatedQuote && (
            <div className={styles.infoCard}>
              <h3>Related Quote</h3>
              <p>{relatedQuote.title}</p>
              <button 
                className={styles.viewButton}
                onClick={() => router.push(`/quotes/${relatedQuote.id}`)}
              >
                View Quote
              </button>
            </div>
          )}
        </div>

        {project.description && (
          <div className={styles.section}>
            <h2>Description</h2>
            <div className={styles.descriptionBox}>
              {project.description}
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h2>Project Timeline</h2>
          <p className={styles.emptyState}>Project timeline functionality will be implemented in a future update.</p>
        </div>

        <div className={styles.section}>
          <h2>Assigned Employees</h2>
          <p className={styles.emptyState}>Employee assignment functionality will be implemented in a future update.</p>
        </div>

        <div className={styles.footer}>
          <div className={styles.metaInfo}>
            <p>Created: {formatDate(project.created_at)}</p>
            <p>Last Updated: {formatDate(project.updated_at)}</p>
          </div>
        </div>
      </div>
    </main>
  </PageContainer>
</>
  );
};

export default ProjectDetailsPage;
