import React, { useState, CSSProperties } from 'react';
import Modal from '../common/Modal';
import styles from './FormModals.module.css';
import { createClient } from '../../lib/api';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onClientAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    status: 'prospect'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error('Client name is required');
      }

      // Address formatting is handled above
      
      // Format address for Google Maps compatibility
      const formattedAddress = [
        formData.street,
        formData.city,
        formData.state,
        formData.zipCode
      ].filter(Boolean).join(', ');
      
      // Submit to API with formatted address
      await createClient({
        ...formData,
        address: formattedAddress
      });
      
      // Reset form and close modal
      setFormData({
        name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        status: 'prospect'
      });
      
      onClientAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add client');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define inline styles for buttons
  const cancelButtonStyle: CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 20px',
    fontSize: 'var(--font-md)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'var(--font-primary)',
    minHeight: '44px',
  };

  const submitButtonStyle: CSSProperties = {
    backgroundColor: 'var(--ppr-primary)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 20px',
    fontSize: 'var(--font-md)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'var(--font-primary)',
    minHeight: '44px',
  };

  const modalFooter = (
    <>
      <button 
        type="button" 
        className={styles.cancelButton}
        style={cancelButtonStyle}
        onClick={onClose}
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button 
        type="submit" 
        className={styles.submitButton}
        style={submitButtonStyle}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Client'}
      </button>
    </>
  );

  // Define form styles
  const formStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const formGroupStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const labelStyle: CSSProperties = {
    fontSize: 'var(--font-sm)',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'var(--font-primary)',
  };

  const inputStyle: CSSProperties = {
    padding: '10px 12px',
    border: '1px solid rgba(30, 115, 190, 0.4)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--font-md)',
    transition: 'all 0.2s ease',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    fontFamily: 'var(--font-primary)',
  };

  const errorMessageStyle: CSSProperties = {
    backgroundColor: 'rgba(255, 107, 0, 0.2)',
    color: 'rgba(255, 180, 120, 1)',
    padding: '10px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--font-sm)',
    marginBottom: '12px',
    borderLeft: '3px solid var(--ppr-accent)',
  };

  const requiredStyle: CSSProperties = {
    color: 'var(--ppr-accent)',
    marginLeft: '2px',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Client"
      footer={modalFooter}
      size="medium"
    >
      <form className={styles.form} style={formStyle} onSubmit={handleSubmit}>
        {error && <div className={styles.errorMessage} style={errorMessageStyle}>{error}</div>}
        
        <div className={styles.formGroup} style={formGroupStyle}>
          <label htmlFor="name" className={styles.label} style={labelStyle}>
            Client Name <span className={styles.required} style={requiredStyle}>*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            style={inputStyle}
            placeholder="Enter client name"
            required
          />
        </div>

        <div className={styles.formGroup} style={formGroupStyle}>
          <label htmlFor="email" className={styles.label} style={labelStyle}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            style={inputStyle}
            placeholder="Enter email address"
          />
        </div>

        <div className={styles.formGroup} style={formGroupStyle}>
          <label htmlFor="phone" className={styles.label} style={labelStyle}>Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className={styles.input}
            style={inputStyle}
            placeholder="Enter phone number"
          />
        </div>

        <div className={styles.formGroup} style={formGroupStyle}>
          <label htmlFor="street" className={styles.label} style={labelStyle}>Street Address</label>
          <input
            id="street"
            name="street"
            type="text"
            value={formData.street}
            onChange={handleChange}
            className={styles.input}
            style={inputStyle}
            placeholder="Enter street address"
          />
        </div>
        
        <div className={styles.formRow} style={{ display: 'flex', gap: '16px' }}>
          <div className={styles.formGroup} style={{ ...formGroupStyle, flex: 1 }}>
            <label htmlFor="city" className={styles.label} style={labelStyle}>City</label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className={styles.input}
              style={inputStyle}
              placeholder="Enter city"
            />
          </div>
          
          <div className={styles.formGroup} style={{ ...formGroupStyle, width: '100px' }}>
            <label htmlFor="state" className={styles.label} style={labelStyle}>State</label>
            <input
              id="state"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
              className={styles.input}
              style={inputStyle}
              placeholder="State"
              maxLength={2}
            />
          </div>
          
          <div className={styles.formGroup} style={{ ...formGroupStyle, width: '120px' }}>
            <label htmlFor="zipCode" className={styles.label} style={labelStyle}>Zip Code</label>
            <input
              id="zipCode"
              name="zipCode"
              type="text"
              value={formData.zipCode}
              onChange={handleChange}
              className={styles.input}
              style={inputStyle}
              placeholder="Zip code"
              maxLength={10}
            />
          </div>
        </div>

        <div className={styles.formGroup} style={formGroupStyle}>
          <label htmlFor="status" className={styles.label} style={labelStyle}>Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={styles.select}
            style={inputStyle}
          >
            <option value="prospect">Prospect</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </form>
    </Modal>
  );
};

export default AddClientModal;
