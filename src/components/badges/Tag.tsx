import React from 'react';
import styles from './Tag.module.css';

export type TagType = 'install' | 'clean' | 'seal' | 'repair' | 
                     'approved' | 'pending' | 'completed' | 'rejected' | 
                     'default';

interface TagProps {
  type: TagType;
  label: string;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ type, label, className = '' }) => {
  // Capitalize first letter of the label
  const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
  
  return (
    <span className={`${styles.tag} ${styles[type]} ${className}`}>
      {capitalizedLabel}
    </span>
  );
};

export default Tag;
