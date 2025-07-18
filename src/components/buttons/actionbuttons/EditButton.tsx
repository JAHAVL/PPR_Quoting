import React from 'react';
import styles from '../../tables/ClientsTable.module.css';

interface EditButtonProps {
  onClick: () => void;
  className?: string;
}

const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  className = '',
}) => {
  return (
    <button 
      className={`${styles.actionButton} ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label="Edit client"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
      </svg>
    </button>
  );
};

export default EditButton;
