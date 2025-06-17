import React, { useState, useRef, useEffect } from 'react';
import styles from './ActivityChat.module.css';
import SystemUpdateContainer from './SystemUpdateContainer';
import ChatMessage from './ChatMessage';
import ActionButton from '../buttons/actionbuttons/ActionButton';
import { activityEventBus, ActivityMessage as ActivityMessageType } from '../../services/activityService';
import { activitiesAPI } from '../../lib/api';
import { v4 as uuidv4 } from 'uuid';

// Using the ActivityMessage type from activityService

interface ActivityChatProps {
  clientId: string;
  className?: string;
}

const ActivityChat: React.FC<ActivityChatProps> = ({ clientId, className = '' }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ActivityMessageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sort activities by timestamp (oldest first for chronological display)
  const sortActivitiesByTimestamp = (activities: ActivityMessageType[]) => {
    return [...activities].sort((a, b) => {
      // Convert to Date objects for comparison
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateA.getTime() - dateB.getTime(); // Ascending order (oldest first)
    });
  };

  // Load messages from API when component mounts or clientId changes
  useEffect(() => {
    setLoading(true);
    setError(null);

    activitiesAPI.getByClientId(clientId)
      .then(data => {
        // Sort messages by timestamp
        const sortedData = sortActivitiesByTimestamp(data);
        setMessages(sortedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching activities:', err);
        setError('Failed to load activity data');
        setLoading(false);

        // Fallback to initial mock data if API fails
        setMessages([
          {
            id: '1',
            clientId,
            type: 'system',
            content: 'Quote Accepted',
            timestamp: '2023-10-15T15:30:00',
            eventType: 'quote_accepted',
            details: 'Quote #1234 was accepted by the client'
          },
          {
            id: '2',
            clientId,
            type: 'system',
            content: 'Quote Created',
            timestamp: '2023-10-14T10:15:00',
            eventType: 'quote_created',
            details: 'Quote #1234 was created and sent to client'
          },
          {
            id: '3',
            clientId,
            type: 'system',
            content: 'Project Status Changed',
            timestamp: '2023-10-13T09:30:00',
            eventType: 'project_status',
            details: 'Project status changed from "Planning" to "In Progress"'
          },
          {
            id: '4',
            clientId,
            type: 'system',
            content: 'Client Call',
            timestamp: '2023-10-12T14:45:00',
            eventType: 'call',
            details: 'Call initiated to discuss project scope'
          },
          {
            id: '5',
            clientId,
            type: 'system',
            content: 'Email Sent',
            timestamp: '2023-10-11T11:20:00',
            eventType: 'email',
            details: 'Follow-up email sent regarding project timeline'
          },
          {
            id: '6',
            clientId,
            type: 'user',
            content: 'Client requested additional features for the project. Need to adjust timeline and budget.',
            timestamp: '2023-10-10T16:30:00',
            eventType: 'note'
          },
          {
            id: '7',
            clientId,
            type: 'other',
            content: 'Team discussed project challenges and solutions.',
            timestamp: '2023-10-09T13:25:00',
            eventType: 'note'
          },
        ]);
      });
  }, [clientId]);

  // Scroll to bottom within the chat container whenever messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);
  
  // Subscribe to activity events for this client
  useEffect(() => {
    const unsubscribe = activityEventBus.subscribe(clientId, (newActivity) => {
      setMessages(prev => [...prev, newActivity]);
    });
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [clientId]);

  const handleSubmit = () => {
    if (!newMessage.trim()) return;
    
    const newActivityMessage: ActivityMessageType = {
      id: uuidv4(),
      clientId,
      type: 'user',
      content: newMessage,
      timestamp: new Date().toISOString(),
      eventType: 'note'
    };
    
    // Just publish to activityEventBus - the subscription will add it to the messages
    // This avoids adding the message twice
    activityEventBus.publish(clientId, newActivityMessage);
    setNewMessage('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDeleteMessage = (id: string) => {
    // Delete from database first
    activitiesAPI.delete(id)
      .then(() => {
        // If successful, remove from UI
        setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
      })
      .catch(error => {
        console.error('Failed to delete message from database:', error);
        // Provide user feedback
        setError('Failed to delete message. Please try again.');
        // Clear error after 3 seconds
        setTimeout(() => setError(null), 3000);
      });
  };
  
  const handleEditMessage = (id: string, newContent: string) => {
    // Find the message to edit
    const messageToUpdate = messages.find(message => message.id === id);
    
    if (!messageToUpdate) {
      console.error(`Message with id ${id} not found`);
      setError('Failed to edit message. Message not found.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // Create updated message object
    const updatedMessage = {
      ...messageToUpdate,
      content: newContent,
      // Optional: Add an edited timestamp or flag if desired
      // editedAt: new Date().toISOString(),
    };
    
    // Update in database
    activitiesAPI.update(id, updatedMessage)
      .then(() => {
        // If successful, update in UI
        setMessages(prevMessages => 
          prevMessages.map(message => 
            message.id === id ? updatedMessage : message
          )
        );
      })
      .catch((error: Error) => {
        console.error('Failed to update message in database:', error);
        // Provide user feedback
        setError('Failed to edit message. Please try again.');
        // Clear error after 3 seconds
        setTimeout(() => setError(null), 3000);
      });
  };

  return (
    <div className={`${styles.activityContainer} ${className}`}>
      <div className={styles.chatMessages} ref={chatMessagesRef}>
        {messages.map((message) => {
          if (message.type === 'system') {
            // System events with nice container style - matching quote calculator but less tall
            return (
              <SystemUpdateContainer
                key={message.id}
                id={message.id}
                content={message.content}
                timestamp={message.timestamp}
                eventType={(message.eventType || 'note') as 'quote_accepted' | 'quote_created' | 'project_status' | 'call' | 'email' | 'note'}
                details={message.details}
                onDelete={handleDeleteMessage}
              />
            );
          } else {
            // User or other messages
            return (
              <ChatMessage
                key={message.id}
                id={message.id}
                content={message.content}
                timestamp={message.timestamp}
                type={message.type as 'user' | 'other'}
                eventType={message.eventType}
                onDelete={handleDeleteMessage}
                onEdit={handleEditMessage}
              />
            );
          }
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.chatFooter}>
        <input
          type="text"
          className={styles.chatInput}
          placeholder="Add a note..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <ActionButton
          icon={(
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
          onClick={handleSubmit}
          ariaLabel="Send message"
        />
      </div>
    </div>
  );
};

export default ActivityChat;
