import { v4 as uuidv4 } from 'uuid';
import { activitiesAPI } from '../lib/api';

// Define the activity message type
export interface ActivityMessage {
  id: string;
  clientId: string;
  userId?: string;
  type: 'system' | 'user' | 'other';
  content: string;
  timestamp: string;
  eventType?: 'quote_accepted' | 'quote_created' | 'project_status' | 'call' | 'email' | 'note';
  details?: string;
}

// Event bus for activity messages
class ActivityEventBus {
  private listeners: { [key: string]: ((message: ActivityMessage) => void)[] } = {};

  subscribe(clientId: string, callback: (message: ActivityMessage) => void) {
    if (!this.listeners[clientId]) {
      this.listeners[clientId] = [];
    }
    this.listeners[clientId].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[clientId] = this.listeners[clientId].filter(cb => cb !== callback);
    };
  }

  publish(clientId: string, message: ActivityMessage) {
    // Save to backend first
    activitiesAPI.create(message).then(() => {
      // Then notify any listeners
      if (this.listeners[clientId]) {
        this.listeners[clientId].forEach(callback => callback(message));
      }
    }).catch(error => {
      console.error('Failed to save activity:', error);
    });
  }
}

export const activityEventBus = new ActivityEventBus();

// Activity service functions
export const addCallActivity = (clientId: string, callType: 'WhatsApp' | 'Phone', phoneNumber: string) => {
  const message: ActivityMessage = {
    id: uuidv4(),
    clientId,
    type: 'system',
    content: 'Client Call',
    timestamp: new Date().toISOString(),
    eventType: 'call',
    details: `${callType} call initiated to ${phoneNumber}`
  };
  
  activityEventBus.publish(clientId, message);
};

export const addEmailActivity = (clientId: string, emailAddress: string) => {
  const message: ActivityMessage = {
    id: uuidv4(),
    clientId,
    type: 'system',
    content: 'Email Sent',
    timestamp: new Date().toISOString(),
    eventType: 'email',
    details: `Email initiated to ${emailAddress}`
  };
  
  activityEventBus.publish(clientId, message);
};
