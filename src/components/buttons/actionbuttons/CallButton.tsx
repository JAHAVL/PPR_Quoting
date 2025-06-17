import React, { useState, useRef, useEffect } from 'react';
import styles from './ActionButton.module.css';
import { addCallActivity } from '../../../services/activityService';

interface CallButtonProps {
  phone: string;
  className?: string;
  clientId: string;
}

// Function to format phone number for WhatsApp (remove spaces, dashes, etc.)
const formatPhoneForWhatsApp = (phone: string): string => {
  // Remove all non-digit characters
  return phone.replace(/\D/g, '');
};

// Function to check if the device is mobile
const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const CallButton: React.FC<CallButtonProps> = ({
  phone,
  className = '',
  clientId,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Track if we're handling a long press
  const [isLongPress, setIsLongPress] = useState(false);
  
  // Handle click for normal press
  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Only proceed if this wasn't a long press
    if (!isLongPress) {
      // On mobile, show options menu or directly use native dialer
      if (isMobileDevice()) {
        window.location.href = `tel:${phone}`;
      } else {
        // On desktop, toggle options menu
        setShowOptions(!showOptions);
      }
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
  
  // Copy phone number to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(phone)
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
  
  const handleWhatsAppCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Format phone number for WhatsApp URL (remove non-digit characters)
    const formattedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
    setShowOptions(false);
    
    // Log the call activity
    addCallActivity(clientId, 'WhatsApp', phone);
  };
  
  const handlePhoneCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
    setShowOptions(false);
    
    // Log the call activity
    addCallActivity(clientId, 'Phone', phone);
  };
  
  return (
    <div className={styles.actionButtonContainer} style={{ position: 'relative' }}>
      <button 
        ref={buttonRef}
        className={`${styles.actionButton} ${className}`}
        onClick={handleCall}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Call client"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
        </svg>
      </button>
      
      {showCopyPopup && (
        <div className={styles.copyPopup}>
          <div className={styles.phoneNumberDisplay}>
            {phone}
          </div>
          <button 
            onClick={copyToClipboard} 
            className={styles.copyButton}
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      
      {showOptions && (
        <div className={styles.callOptions}>
          <button 
            className={styles.callOptionButton}
            onClick={handleWhatsAppCall}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Call
          </button>
          <button 
            onClick={handlePhoneCall}
            className={styles.callOptionButton}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#fff',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1E73BE" width="18" height="18">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
            </svg>
            Phone Call
          </button>
        </div>
      )}
    </div>
  );
};

export default CallButton;
