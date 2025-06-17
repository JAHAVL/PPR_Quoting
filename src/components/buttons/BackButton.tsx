import React from 'react';
import Link from 'next/link';
import styles from './BackButton.module.css';

interface BackButtonProps {
  href: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  href
}) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <a className={styles.backButton}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </a>
    </Link>
  );
};

export default BackButton;
