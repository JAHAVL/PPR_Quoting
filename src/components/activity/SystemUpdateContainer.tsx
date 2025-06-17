import React, { useState, useEffect, useRef } from 'react';
import styles from './ActivityChat.module.css';
import { formatDate } from '../../utils/formatters';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { activityCommentsAPI } from '../../lib/api';
import { v4 as uuidv4 } from 'uuid';
import BlurActionMenu from '../common/BlurActionMenu';
import useBlurActionMenu from '../../hooks/useBlurActionMenu';

interface NoteItemProps {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ id, text, sender, timestamp, onEdit, onDelete }) => {
  const { isMenuOpen, closeMenu, containerRef, containerProps } = useBlurActionMenu();
  // Use MutableRefObject instead of RefObject to allow assignment
  const noteRef = useRef<HTMLLIElement | null>(null) as React.MutableRefObject<HTMLLIElement | null>;
  
  const handleEditNote = () => {
    onEdit(id, text);
    closeMenu();
  };

  const handleDeleteNote = () => {
    onDelete(id);
    closeMenu();
  };

  return (
    <li 
      {...containerProps}
      ref={(node) => {
        if (node) {
          const currentRef = containerRef as unknown as React.MutableRefObject<HTMLElement | null>;
          currentRef.current = node;
          noteRef.current = node;
        }
      }}
      className={styles.noteItem}
    >
      <div className={styles.noteSender}>{sender}</div>
      <div className={styles.noteContent}>{text}</div>
      <div className={styles.noteTimestamp}>{timestamp}</div>

      {/* Global BlurActionMenu component */}
      <BlurActionMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
        containerRef={containerRef}
      />
    </li>
  );
};

interface SystemUpdateContainerProps {
  id: string;
  content: string;
  timestamp: string;
  eventType: 'quote_accepted' | 'quote_created' | 'quote_rejected' | 'project_status' | 'call' | 'email' | 'note';
  details?: string;
  quoteId?: string;
  projectId?: string;
  onDelete?: (id: string) => void;
}

const SystemUpdateContainer: React.FC<SystemUpdateContainerProps> = ({
  id,
  content,
  timestamp,
  eventType,
  details,
  quoteId,
  projectId,
  onDelete
}) => {
  // Format date/time based on whether event is today or another day
  const eventDate = new Date(timestamp);
  const today = new Date();
  
  // Check if the event is from today
  const isToday = eventDate.getDate() === today.getDate() && 
                  eventDate.getMonth() === today.getMonth() && 
                  eventDate.getFullYear() === today.getFullYear();
  
  // Format as time only if today, otherwise as date only
  const collapsedDateTime = isToday 
    ? eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  // Full date time for expanded view
  const formattedDateTime = eventDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState<{ id: string, text: string, timestamp: string, sender: string }[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedNoteText, setEditedNoteText] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // State for individual note long press and menus 
  const [noteLongPressingMap, setNoteLongPressingMap] = useState<Record<string, boolean>>({});
  const [showNoteMenuMap, setShowNoteMenuMap] = useState<Record<string, boolean>>({});
  const noteLongPressTimerRefs = useRef<Record<string, NodeJS.Timeout | null>>({});
  const noteRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // Animation variants for framer-motion
  const fadeAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const bubbleAnimation: Variants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 20 
      } 
    },
    exit: { 
      opacity: 0, 
      y: -5, 
      scale: 0.95, 
      transition: { duration: 0.2 } 
    }
  };
  
  // Animations for delete button
  const deleteButtonAnimation: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 17 
      } 
    }
  };
  
  // Track if we're currently interacting with a note
  const [isInteractingWithNote, setIsInteractingWithNote] = useState(false);

  // Long press handlers
  const handleTouchStart = (e: React.MouseEvent | React.TouchEvent) => {
    // Check if the interaction is happening within a note
    // Don't start long press if already in delete mode or if interacting with a note
    if (!showDeleteOption && !isInteractingWithNote) {
      longPressTimerRef.current = setTimeout(() => {
        setIsLongPressing(true);
        setShowDeleteOption(true);
      }, 800); // 800ms for long press detection
    }
  };
  
  const handleTouchEnd = () => {
    // Clear the timer if it's still running
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // Important: Don't reset the delete state here
    // This allows the delete button to remain visible after releasing
  };
  
  const handleMouseLeave = () => {
    // Only clear the timer, don't reset delete state
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };
  
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
    setShowDeleteOption(false);
  };
  
  // Handle clicks on the container
  const handleContainerClick = () => {
    // Only toggle expanded state if not in delete mode
    if (!showDeleteOption) {
      setIsExpanded(!isExpanded);
    }
  };
  
  // Handle clicks on the overlay (cancel delete)
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only trigger if clicked directly on the overlay, not on the delete button
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      setIsLongPressing(false);
      setShowDeleteOption(false);
    }
  };

  // Determine icon based on event type
  let icon;
  let eventTitle = content;

  switch (eventType) {
    case 'quote_accepted':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      );
      break;
    case 'quote_created':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
        </svg>
      );
      break;
    case 'project_status':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 16c-2.05 0-3.81-1.24-4.58-3h1.71c.63.9 1.68 1.5 2.87 1.5 1.93 0 3.5-1.57 3.5-3.5S13.93 9.5 12 9.5c-1.35 0-2.52.78-3.1 1.9l1.6 1.6h-4V9l1.3 1.3C8.69 8.92 10.23 8 12 8c2.76 0 5 2.24 5 5s-2.24 5-5 5z" />
        </svg>
      );
      break;
    case 'call':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
        </svg>
      );
      break;
    case 'email':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      );
      break;
    case 'note':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </svg>
      );
      break;
    default:
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      );
  }

  // Load notes from API when system message is expanded
  useEffect(() => {
    if (isExpanded) {
      setIsLoadingNotes(true);
      setNoteError(null);
      
      console.log('Loading notes for activity ID:', id);
      // Load comments for this activity from the API
      activityCommentsAPI.getByActivityId(id)
        .then(comments => {
          console.log('Received comments from API:', comments);
          // Transform comments into the notes format expected by the component
          const formattedNotes = comments.map(comment => ({
            id: comment.id,
            text: comment.content,
            timestamp: new Date(comment.timestamp).toLocaleString(),
            sender: comment.userId === 'system' ? 'System' : 'You'
          }));
          
          console.log('Formatted notes:', formattedNotes);
          setNotes(formattedNotes);
          setIsLoadingNotes(false);
        })
        .catch(error => {
          console.error('Error loading activity comments:', error);
          setNoteError('Failed to load comments');
          setIsLoadingNotes(false);
        });
    }
  }, [isExpanded, id]);
  
  // Global click-away detection for the delete menu
  useEffect(() => {
    // Only add the event listener when delete menu is open
    if (showDeleteOption) {
      // Handler for document clicks
      const handleDocumentClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        
        // Check if the click is on the delete button or its parent delete overlay
        const deleteButton = document.querySelector(`.${styles.deleteButton}`);
        const deleteOverlay = document.querySelector(`.${styles.deleteOverlay}`);
        
        // Don't close if clicked on the delete button/overlay (those have their own handlers)
        if (deleteButton?.contains(target) || deleteOverlay === target) {
          return;
        }
        
        // Otherwise, close the delete menu
        setIsLongPressing(false);
        setShowDeleteOption(false);
      };
      
      // Add the global event listener
      document.addEventListener('mousedown', handleDocumentClick);
      
      // Cleanup: remove event listener when component unmounts or delete menu closes
      return () => {
        document.removeEventListener('mousedown', handleDocumentClick);
      };
    }
  }, [showDeleteOption]);

  // Global click-away detection for note menus
  useEffect(() => {
    // Find any active notes with menus open
    const activeNoteIds = Object.keys(showNoteMenuMap).filter(noteId => showNoteMenuMap[noteId]);
    
    if (activeNoteIds.length > 0) {
      setIsInteractingWithNote(true);
      
      // Handler for document-level clicks
      const handleDocumentClick = (e: MouseEvent) => {
        const target = e.target as Node;
        
        // Check each active note menu
        activeNoteIds.forEach(noteId => {
          const noteElement = noteRefs.current[noteId];
          
          // Skip if the click was inside this note element
          if (noteElement && noteElement.contains(target)) {
            return;
          }
          
          // Close this note's menu
          setNoteLongPressingMap(prev => ({ ...prev, [noteId]: false }));
          setShowNoteMenuMap(prev => ({ ...prev, [noteId]: false }));
        });
        
        // If we closed all active menus, reset the interaction flag
        if (activeNoteIds.every(noteId => {
          const noteElement = noteRefs.current[noteId];
          return !noteElement || !noteElement.contains(target);
        })) {
          setIsInteractingWithNote(false);
        }
      };
      
      // Add document-level event listener
      document.addEventListener('mousedown', handleDocumentClick);
      
      // Cleanup
      return () => {
        document.removeEventListener('mousedown', handleDocumentClick);
      };
    }
  }, [showNoteMenuMap]);

  const handleToggleExpand = () => {
    setIsExpanded(prev => !prev);
    // Clear delete option when toggling
    setShowDeleteOption(false);
  };

  // Handle note input change
  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteText(e.target.value);
  };

  // Handle edited note input change
  const handleEditedNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedNoteText(e.target.value);
  };

  const handleAddButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Start editing a note
  const handleEditNote = (noteId: string, currentText: string) => {
    setEditingNoteId(noteId);
    setEditedNoteText(currentText);
  };

  // Save edited note
  const handleSaveEditedNote = () => {
    if (!editingNoteId || !editedNoteText.trim()) return;
    
    // Find the note to edit
    const noteToUpdate = notes.find(note => note.id === editingNoteId);
    if (!noteToUpdate) return;
    
    // Create updated note object
    const updatedNote = {
      ...noteToUpdate,
      text: editedNoteText.trim(),
      // Optionally add an edited flag or timestamp
      // editedAt: new Date().toISOString()
    };
    
    // Send to API
    activityCommentsAPI.update(editingNoteId, updatedNote)
      .then(() => {
        console.log('Note updated successfully');
        // Update in local state
        setNotes(prev => prev.map(note => 
          note.id === editingNoteId ? updatedNote : note
        ));
        // Exit edit mode
        setEditingNoteId(null);
        setEditedNoteText('');
      })
      .catch((error: Error) => {
        console.error('Failed to update note:', error);
        setNoteError('Failed to update note. Please try again.');
        // Clear error after 3 seconds
        setTimeout(() => setNoteError(null), 3000);
      });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditedNoteText('');
  };

  // Delete a note
  const handleDeleteNote = (noteId: string) => {
    // Add debug logging
    console.log(`Attempting to delete note with ID: ${noteId}`);
    
    // Send to API and only remove from UI if successful
    activityCommentsAPI.delete(noteId)
      .then(() => {
        console.log('Note deleted successfully from API');
        // Remove from local state only after successful API call
        setNotes(prev => prev.filter(note => note.id !== noteId));
        // Reset active note ID
        setActiveNoteId(null);
        // Reset menu state
        setShowNoteMenuMap(prev => ({ ...prev, [noteId]: false }));
        setNoteLongPressingMap(prev => ({ ...prev, [noteId]: false }));
        setIsInteractingWithNote(false);
      })
      .catch((error: Error) => {
        console.error('Failed to delete note from API:', error);
        // Do NOT remove from local state if API fails
        // Just reset the menu states
        setActiveNoteId(null);
        setShowNoteMenuMap(prev => ({ ...prev, [noteId]: false }));
        setNoteLongPressingMap(prev => ({ ...prev, [noteId]: false }));
        setIsInteractingWithNote(false);
        
        // Show error message
        setNoteError('Failed to delete note. Please try again.');
        setTimeout(() => setNoteError(null), 3000);
      });
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    
    // Create a new note
    const newNote = {
      id: uuidv4(), // Generate a unique ID
      activityId: id,
      content: noteText.trim(),
      timestamp: new Date().toISOString(),
      userId: 'you' // Replace with actual user ID when available
    };
    
    // Add debug logging
    console.log('Adding note to activity:', id);
    console.log('Note content:', newNote);
    
    // Send to API
    activityCommentsAPI.create(newNote)
      .then(() => {
        console.log('Note saved successfully to API');
        // Add to local state with formatted values for display
        setNotes(prev => [
          ...prev,
          {
            id: newNote.id,
            text: newNote.content,
            timestamp: new Date(newNote.timestamp).toLocaleString(),
            sender: 'You'
          }
        ]);
        // Reset input
        setNoteText('');
        setShowAddNote(false);
      })
      .catch(error => {
        console.error('Failed to save note:', error);
        setNoteError('Failed to save note. Please try again.');
        // Clear error after 3 seconds
        setTimeout(() => setNoteError(null), 3000);
      });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && noteText.trim()) {
      e.preventDefault();
      handleAddNote(); // Use the same handler that calls the API
    } else if (e.key === 'Escape') {
      setShowAddNote(false); // Allow canceling with Escape
      setNoteText('');
    }
  };

  // Handle navigation to quote or project
  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent container expansion
    
    // Extract quote ID or project ID from details if not explicitly provided
    let targetId = quoteId || projectId;
    
    if (!targetId && details) {
      // Try to extract ID from details text
      const quoteMatch = details.match(/Quote #([\w-]+)/i);
      const projectMatch = details.match(/Project #([\w-]+)/i);
      
      if (quoteMatch && eventType.includes('quote')) {
        targetId = quoteMatch[1];
      } else if (projectMatch && eventType === 'project_status') {
        targetId = projectMatch[1];
      }
    }
    
    if (targetId) {
      // In a real implementation, this would navigate to the quote or project page
      // For now, just log and alert for demo purposes
      if (eventType.includes('quote')) {
        console.log(`Navigating to quote: ${targetId}`);
        alert(`Navigating to quote: ${targetId}`);
        // Example navigation: router.push(`/quotes/${targetId}`);
      } else if (eventType === 'project_status') {
        console.log(`Navigating to project: ${targetId}`);
        alert(`Navigating to project: ${targetId}`);
        // Example navigation: router.push(`/projects/${targetId}`);
      }
    } else {
      console.log('No target ID found for navigation');
    }
  };

  return (
    <div 
      className={`${styles.specialEventContainer} ${isExpanded ? styles.expanded : ''} ${isLongPressing ? styles.longPressing : ''}`}
      onClick={handleContainerClick}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Delete button overlay that appears on long-press */}
      {showDeleteOption && (
        <motion.div 
          className={styles.deleteOverlay}
          initial="hidden"
          animate="visible"
          variants={fadeAnimation}
          onClick={handleOverlayClick}
        >
          <motion.button
            className={styles.deleteButton}
            onClick={handleDeleteClick}
            initial="hidden"
            animate="visible"
            variants={deleteButtonAnimation}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </motion.button>
        </motion.div>
      )}
      {/* Title row with icon, event title, and date/add button */}
      <div className={styles.specialEventTitle}>
        <div className={styles.titleContent}>
          <div className={styles.activityIcon}>
            {icon}
          </div>
          <div className={styles.eventTitleText}>
            {content}
          </div>
        </div>
        <AnimatePresence>
          {!isExpanded && (
            <motion.div 
              className={styles.activityDate}
              initial={{ opacity: 1 }}
              exit={fadeAnimation.exit}
            >
              {collapsedDateTime}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isExpanded && (
            <div className={styles.buttonContainer}>
              {/* Show View button for quote and project messages */}
              {['quote_accepted', 'quote_created', 'quote_rejected', 'project_status'].includes(eventType) && (
                <motion.button
                  className={styles.viewButton}
                  onClick={handleViewClick}
                  initial={fadeAnimation.hidden}
                  animate={fadeAnimation.visible}
                  exit={fadeAnimation.exit}
                  title={`View ${eventType.includes('quote') ? 'Quote' : 'Project'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </motion.button>
              )}
              <motion.button
                className={styles.addNoteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddNote(prev => !prev);
                }}
                initial={fadeAnimation.hidden}
                animate={fadeAnimation.visible}
                exit={fadeAnimation.exit}
                title="Add a note"
              >
                +
              </motion.button>
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Expanded view - reveals details and conditionally shows notes */}
      {isExpanded && (
        <div className={styles.expandedContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.specialEventContent}>
            {details || content}
          </div>
          
          {/* Original compact meta info with timestamp */}
          <div className={styles.specialEventMeta}>{formattedDateTime}</div>
          
          {/* Notes section with original styling */}
          {isLoadingNotes && <div className={styles.loadingNotes}>Loading notes...</div>}
          
          {noteError && <div className={styles.errorMessage}>{noteError}</div>}
          
          {notes.length > 0 && (
            <ul className={styles.noteList}>
              {notes.map((note) => {
                const isEditing = editingNoteId === note.id;
                const isNoteLongPressing = noteLongPressingMap[note.id] || false;
                const showNoteMenu = showNoteMenuMap[note.id] || false;
                
                const handleNoteTouchStart = (e: React.MouseEvent | React.TouchEvent) => {
                  // Prevent parent container's long-press detection
                  e.stopPropagation();
                  setIsInteractingWithNote(true);
                  
                  if (!showNoteMenuMap[note.id]) {
                    noteLongPressTimerRefs.current[note.id] = setTimeout(() => {
                      setNoteLongPressingMap(prev => ({ ...prev, [note.id]: true }));
                      setShowNoteMenuMap(prev => ({ ...prev, [note.id]: true }));
                      setActiveNoteId(note.id);
                    }, 800); // 800ms for long press detection
                  }
                };
                
                const handleNoteMouseLeave = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  
                  // Only reset the interacting flag if we're not showing a menu
                  if (!showNoteMenuMap[note.id]) {
                    setIsInteractingWithNote(false);
                  }
                  
                  if (noteLongPressTimerRefs.current[note.id]) {
                    clearTimeout(noteLongPressTimerRefs.current[note.id]!);
                    noteLongPressTimerRefs.current[note.id] = null;
                  }
                };
                
                const handleNoteMenuClose = () => {
                  setNoteLongPressingMap(prev => ({ ...prev, [note.id]: false }));
                  setShowNoteMenuMap(prev => ({ ...prev, [note.id]: false }));
                  setActiveNoteId(null);
                  // Reset the interacting flag when closing the menu
                  setIsInteractingWithNote(false);
                };
                
                // Restore the touch end handler
                const handleNoteTouchEnd = (e: React.MouseEvent | React.TouchEvent) => {
                  e.stopPropagation();
                  
                  // Only reset the interacting flag if we're not showing a menu
                  // This ensures the parent container doesn't activate if we're in a menu
                  if (!showNoteMenuMap[note.id]) {
                    setIsInteractingWithNote(false);
                  }
                  
                  if (noteLongPressTimerRefs.current[note.id]) {
                    clearTimeout(noteLongPressTimerRefs.current[note.id]!);
                    noteLongPressTimerRefs.current[note.id] = null;
                  }
                };
                
                // Note: We'll implement the document click handler at the component level instead of here
                
                return (
                  <li 
                    key={note.id} 
                    ref={(element) => noteRefs.current[note.id] = element}
                    className={`${isEditing ? styles.editingNote : ''} ${showNoteMenu ? styles.longPressing : ''}`}
                    onTouchStart={handleNoteTouchStart}
                    onTouchEnd={handleNoteTouchEnd}
                    onMouseDown={handleNoteTouchStart}
                    onMouseUp={handleNoteTouchEnd}
                    onMouseLeave={handleNoteMouseLeave}
                  >
                    <div className={styles.noteSender}>{note.sender}</div>
                    
                    {isEditing ? (
                      <div className={styles.editNoteContainer}>
                        <textarea 
                          className={styles.editNoteTextarea}
                          value={editedNoteText}
                          onChange={handleEditedNoteChange}
                          autoFocus
                        />
                        <div className={styles.editNoteButtons}>
                          <button 
                            onClick={handleSaveEditedNote}
                            className={styles.saveButton}
                          >
                            Save
                          </button>
                          <button 
                            onClick={handleCancelEdit}
                            className={styles.cancelButton}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.noteContent}>{note.text}</div>
                    )}
                    
                    <div className={styles.noteTimestamp}>{note.timestamp}</div>
                    
                    {/* Use the BlurActionMenu component for consistent behavior */}
                    <BlurActionMenu
                      isOpen={showNoteMenu}
                      onClose={handleNoteMenuClose}
                      onEdit={() => {
                        handleNoteMenuClose();
                        handleEditNote(note.id, note.text);
                      }}
                      onDelete={() => {
                        console.log(`Deleting note with ID: ${note.id}`);
                        handleDeleteNote(note.id);
                      }}
                      containerRef={noteRefs.current[note.id] ? { current: noteRefs.current[note.id] } : { current: null }}
                    />
                  </li>
                );
              })}
            </ul>
          )}
          
          {/* Note input area with original animation and structure */}
          <AnimatePresence>
            {showAddNote && (
              <motion.div 
                className={styles.bubbleNoteInput}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={bubbleAnimation}
              >
                <input
                  type="text"
                  className={styles.noteInput}
                  placeholder="Add a note about this..."
                  value={noteText}
                  onChange={handleNoteChange}
                  onKeyPress={handleKeyPress}
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SystemUpdateContainer;
