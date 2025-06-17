import React, { useEffect, useRef, CSSProperties } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  footer
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Close modal with ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Define inline styles to ensure they override any cached CSS
  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',
  };

  const containerStyle: CSSProperties = {
    backgroundColor: 'rgba(18, 24, 38, 0.7)',
    backgroundImage: 'linear-gradient(to bottom right, rgba(30, 115, 190, 0.15), rgba(18, 24, 38, 0.7))',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid rgba(30, 115, 190, 0.3)',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    width: size === 'small' ? '320px' : size === 'medium' ? '450px' : '650px',
    maxWidth: '90vw',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(30, 115, 190, 0.3)',
    background: 'linear-gradient(to right, rgba(30, 115, 190, 0.2), transparent)',
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: 'var(--font-lg)',
    fontWeight: 600,
    color: 'white',
    fontFamily: 'var(--font-primary)',
  };

  const closeButtonStyle: CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.7)',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
  };

  const contentStyle: CSSProperties = {
    padding: '20px',
    overflowY: 'auto',
    flex: 1,
    color: 'rgba(255, 255, 255, 0.9)',
  };

  const footerStyle: CSSProperties = {
    padding: '16px 20px',
    borderTop: '1px solid rgba(30, 115, 190, 0.3)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    background: 'linear-gradient(to right, transparent, rgba(30, 115, 190, 0.2))',
  };

  return (
    <div className={styles.modalOverlay} style={overlayStyle}>
      <div 
        className={`${styles.modalContainer} ${styles[size]}`}
        style={containerStyle}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.modalHeader} style={headerStyle}>
          <h2 id="modal-title" className={styles.modalTitle} style={titleStyle}>{title}</h2>
          <button 
            className={styles.closeButton} 
            style={closeButtonStyle}
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className={styles.modalContent} style={contentStyle}>
          {children}
        </div>
        {footer && (
          <div className={styles.modalFooter} style={footerStyle}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
