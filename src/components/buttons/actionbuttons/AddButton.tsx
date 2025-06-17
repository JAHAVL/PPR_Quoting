import React from 'react';
import styles from './ActionButton.module.css';

interface AddButtonProps {
  onClick: () => void;
  className?: string;
}

const AddButton: React.FC<AddButtonProps> = ({
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
      aria-label="Add new item"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
    </button>
  );
};

export default AddButton;
