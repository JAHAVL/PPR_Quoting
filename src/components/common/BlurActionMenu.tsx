import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './BlurActionMenu.module.css';

interface BlurActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
  containerRef: React.RefObject<HTMLElement>;
}

/**
 * A reusable blur action menu component with edit and delete options 
 * that can be attached to any container. Includes click-away functionality.
 */
const BlurActionMenu: React.FC<BlurActionMenuProps> = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  showEdit = true,
  showDelete = true,
  containerRef,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [wasOpen, setWasOpen] = useState(false);

  useEffect(() => {
    // Track if the menu was ever open for animation purposes
    if (isOpen) {
      setWasOpen(true);
    }

    // Click-away functionality
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Add event listener when menu is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, containerRef]);

  // If the menu was never opened, don't render anything
  if (!wasOpen) {
    return null;
  }

  return (
    <>
      {/* Apply the blur effect class to the referenced container */}
      {isOpen && containerRef.current && containerRef.current.classList.add(styles.longPressing)}
      {!isOpen && containerRef.current && containerRef.current.classList.remove(styles.longPressing)}
      
      {/* Action menu */}
      <motion.div
        ref={menuRef}
        className={`${styles.actionOverlay} ${!isOpen ? styles.hidden : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.actionButtons}>
          {showEdit && (
            <motion.button
              className={styles.editButton}
              onClick={onEdit}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </motion.button>
          )}
          
          {showDelete && (
            <motion.button
              className={styles.deleteButton}
              onClick={onDelete}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </motion.button>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default BlurActionMenu;
