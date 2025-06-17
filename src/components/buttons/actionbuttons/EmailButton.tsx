import React, { useState, useRef, useEffect } from 'react';
import styles from './ActionButton.module.css';
import { addEmailActivity } from '../../../services/activityService';

interface EmailButtonProps {
  email: string;
  className?: string;
  clientId: string;
}

const EmailButton: React.FC<EmailButtonProps> = ({
  email,
  className = '',
  clientId,
}) => {
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Track if we're handling a long press
  const [isLongPress, setIsLongPress] = useState(false);
  
  // Handle click for normal press
  const handleEmailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Only proceed if this wasn't a long press
    if (!isLongPress) {
      window.location.href = `mailto:${email}`;
      
      // Log the email activity
      addEmailActivity(clientId, email);
    }
    
    // Reset long press state
    setIsLongPress(false);
  };
  
  // Handle mouse down for long press
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      setShowCopyPopup(true);
    }, 500); // 500ms for long press
  };
  
  // Handle mouse up to clear timer
  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  
  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      setShowCopyPopup(true);
    }, 500); // 500ms for long press
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  
  // Copy email to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
          setShowCopyPopup(false);
        }, 1500);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowCopyPopup(false);
      }
    };
    
    if (showCopyPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCopyPopup]);
  
  return (
    <div className={styles.actionButtonContainer} style={{ position: 'relative' }}>
      <button 
        ref={buttonRef}
        className={`${styles.actionButton} ${className}`}
        onClick={handleEmailClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Send email"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      </button>
      
      {showCopyPopup && (
        <div className={styles.copyPopup}>
          <div className={styles.phoneNumberDisplay}>
            {email}
          </div>
          <button 
            onClick={copyToClipboard} 
            className={styles.copyButton}
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailButton;
