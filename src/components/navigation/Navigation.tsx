import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Navigation.module.css';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const router = useRouter();
  const currentPath = router.pathname;
  
  const isActive = (path: string): boolean => {
    return currentPath === path;
  };

  return (
    <nav className={`${styles.navigation} ${className}`}>
      <div className={styles.navContainer}>
        <Link 
          href="/admin-dashboard" 
          className={`${styles.navLink} ${isActive('/admin-dashboard') ? styles.activeTab : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          href="/install-quote" 
          className={`${styles.navLink} ${isActive('/install-quote') ? styles.activeTab : ''}`}
        >
          Install Quote
        </Link>
        <Link 
          href="/clean-seal-quote" 
          className={`${styles.navLink} ${isActive('/clean-seal-quote') ? styles.activeTab : ''}`}
        >
          Clean & Seal Quote
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
