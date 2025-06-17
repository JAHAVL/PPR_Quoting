import React from 'react';
import styles from './ActionButton.module.css';

interface ActionButtonProps {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  onClick,
  ariaLabel,
  className = '',
}) => {
  return (
    <button 
      className={`${styles.actionButton} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
};

export default ActionButton;
