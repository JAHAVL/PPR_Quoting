import React from 'react';
import styles from './PageHeader.module.css';
import SearchBar from '../fields/SearchBar';
import BackButton from '../buttons/BackButton';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface PageHeaderProps {
  title?: string;
  showSearch?: boolean;
  children?: React.ReactNode;
  showBackButton?: boolean;
  backHref?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title = 'PPR',
  showSearch = true,
  children,
  showBackButton = false,
  backHref = '/admin-dashboard'
}) => {
  return (
    <>
      <header className={styles.header}>
        {showBackButton && (
          <div className={styles.backButton}>
            <BackButton href={backHref} />
          </div>
        )}
        <div className={styles.logoContainer}>
          <Link href="/">
            <a className={styles.logoLink}>
              <img 
                src="/images/Logo.png" 
                alt="PPR Logo" 
                className={styles.logo} 
                title={title} 
              />
            </a>
          </Link>
        </div>
      </header>
      
      <div className={styles.subHeader}>
        {children}
        
        {showSearch && (
          <div className={styles.searchSection}>
            <SearchBar placeholder="Search quotes, clients, projects..." />
          </div>
        )}
      </div>
    </>
  );
};

export default PageHeader;
