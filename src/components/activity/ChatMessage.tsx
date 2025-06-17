import React, { useState, useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import styles from './ActivityChat.module.css';
import { formatDate } from '../../utils/formatters';
import useBlurActionMenu from '../../hooks/useBlurActionMenu';
import BlurActionMenu from '../common/BlurActionMenu';

interface ChatMessageProps {
  id: string;
  content: string;
  timestamp: string;
  type: 'user' | 'other';
  eventType?: 'quote_accepted' | 'quote_created' | 'project_status' | 'call' | 'email' | 'note';
  onDelete?: (id: string) => void;
  onEdit?: (id: string, content: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  content,
  timestamp,
  type,
  eventType,
  onDelete,
  onEdit
}) => {
  // States for edit functionality
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [showActionOptions, setShowActionOptions] = useState(false);
  const editInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Use the global blur action menu hook
  const { isMenuOpen, closeMenu, containerRef, containerProps } = useBlurActionMenu();
  
  // Define animation variants
  const fadeAnimation: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };
  
  // Handle edit action
  const handleEdit = () => {
    setIsEditing(true);
    closeMenu();
    
    // Focus the edit input after a short delay to ensure it's rendered
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    }, 100);
  };
  
  // Handle delete action
  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
    closeMenu();
  };
  
  // Handle delete button click
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Call the onDelete callback if provided
    if (onDelete) {
      onDelete(id);
      console.log(`Deleting message with id: ${id}`);
    } else {
      // Fallback if no delete handler is provided
      console.log(`No delete handler provided for message id: ${id}`);
      alert(`Message with ID ${id} would be deleted here (but no delete handler was provided).`);
    }
    
    // Reset states
    setIsLongPressing(false);
    setShowActionOptions(false);
  };
  
  // Handle edit button click
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Switch to edit mode
    setIsEditing(true);
    setShowActionOptions(false);
    setIsLongPressing(false);
    
    // Focus the edit input after rendering
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    }, 0);
  };
  
  // Handle save button click (for edit mode)
  const handleSaveClick = () => {
    if (onEdit) {
      onEdit(id, editedContent);
    }
    setIsEditing(false);
  };
  
  // Handle cancel button click (for edit mode)
  const handleCancelClick = () => {
    setEditedContent(content); // Reset to original content
    setIsEditing(false);
  };
  
  // Handle key press in edit mode
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveClick();
    } else if (e.key === 'Escape') {
      handleCancelClick();
    }
  };
  // Determine icon based on message type or event
  let icon;
  if (type === 'other') {
    // Person icon
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    );
  } else {
    // Default pencil/edit icon for user note
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
      </svg>
    );
  }

  // For 'other' messages, try to extract sender name
  let displayTitle = content;
  if (type === 'other') {
    const match = content.match(/^Message from ([^:]+):\s*(.*)$/i);
    if (match) {
      const sender = match[1];
      const body = match[2];
      displayTitle = `${sender}: ${body}`;
    }
  }

  return (
    <div 
      {...containerProps}
      ref={(node) => {
        if (node) {
          const currentRef = containerRef as unknown as React.MutableRefObject<HTMLElement | null>;
          currentRef.current = node;
        }
      }}
      className={`${styles.activityItem} ${type === 'user' ? styles.userMessage : styles.otherMessage}`}
    >
      <div className={styles.activityIcon}>
        {icon}
      </div>
      
      {isEditing ? (
        /* Edit mode UI */
        <div className={styles.editContainer}>
          <textarea
            ref={editInputRef}
            className={styles.editInput}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={3}
          />
          <div className={styles.editActions}>
            <button className={styles.saveButton} onClick={handleSaveClick}>
              Save
            </button>
            <button className={styles.cancelButton} onClick={handleCancelClick}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Normal display mode */
        <div className={styles.activityContent}>
          <div className={styles.activityTitle}>{displayTitle}</div>
          <div className={styles.activityDate}>{formatDate(timestamp)}</div>
        </div>
      )}
      
      {/* Global BlurActionMenu component */}
      {!isEditing && (
        <BlurActionMenu
          isOpen={isMenuOpen}
          onClose={closeMenu}
          onEdit={handleEdit}
          onDelete={handleDelete}
          containerRef={containerRef}
        />
      )}
    </div>
  );
};

export default ChatMessage;
