import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Projects.module.css';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import ProjectsTable, { Project } from '../components/tables/ProjectsTable';
import ProjectsIcon from '../components/icons/ProjectsIcon';
import { api } from '../lib/api';



const ProjectsPage: React.FC = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await api.projects.getAll();
        
        // Transform the data to match the expected format for ProjectsTable
        const formattedProjects = data.map((project: any) => ({
          id: project.id,
          clientName: project.clientName,
          address: project.address || '',
          startDate: project.startDate,
          endDate: project.endDate,
          total: project.total,
          status: project.status,
          type: project.type,
          squareFootage: project.squareFootage || 0
        }));
        
        setProjects(formattedProjects);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on search term
  const filteredProjects = projects.filter(project => {
    const searchLower = searchTerm.toLowerCase();
    return (
      project.clientName.toLowerCase().includes(searchLower) ||
      project.address.toLowerCase().includes(searchLower) ||
      project.status.toLowerCase().includes(searchLower) ||
      project.type.toLowerCase().includes(searchLower)
    );
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle create new project button click
  const handleCreateProject = () => {
    router.push('/create-project');
  };

  return (
    <>
      <Head>
        <title>PPR - Projects</title>
        <meta name="description" content="Paver Pressure and Repair Projects" />
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
              <ProjectsIcon className={styles.pageIcon} />
              <h1 className={styles.pageTitle}>Projects</h1>
              <button 
                className={styles.createButton}
                onClick={handleCreateProject}
                aria-label="Create new project"
              >
                +
              </button>
            </div>
          </div>

          {/* Search is handled by the top navigation search bar */}

          {loading ? (
            <div className={styles.loadingContainer}>
              <p>Loading projects...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <ProjectsTable projects={filteredProjects} isLoading={isLoading} />
            </div>
          )}
        </main>
      </PageContainer>
    </>
  );
};

export default ProjectsPage;
