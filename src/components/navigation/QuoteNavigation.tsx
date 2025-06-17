import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './Navigation.module.css';

interface QuoteNavigationProps {
  className?: string;
}

const QuoteNavigation: React.FC<QuoteNavigationProps> = ({ className = '' }) => {
  const router = useRouter();
  const currentPath = router.pathname;
  
  const isInstallQuoteActive = currentPath === '/install-quote';

  return (
    <nav className={`${styles.navigation} ${className} ${styles.quoteNavigation}`}>
      <div className={styles.toggleContainer}>
        {/* Selection pill that slides */}
        <div className={`${styles.selectionPill} ${isInstallQuoteActive ? styles.pillLeft : styles.pillRight}`}>
          {/* No text in pill, just the background */}
        </div>
        
        <div className={styles.toggleLinks}>
          {/* Left side - Install */}
          <a href="/install-quote" className={styles.leftLink}>
            <span className={styles.linkArea}>
              <span className={styles.sideText}>Install</span>
            </span>
          </a>
          
          {/* Right side - MX */}
          <a href="/clean-seal-quote" className={styles.rightLink}>
            <span className={styles.linkArea}>
              <span className={styles.sideText}>MX</span>
            </span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default QuoteNavigation;
