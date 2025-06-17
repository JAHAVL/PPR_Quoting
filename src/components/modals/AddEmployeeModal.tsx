import React, { useState, CSSProperties } from 'react';
import Modal from '../common/Modal';
import styles from './FormModals.module.css';
import { createEmployee } from '../../lib/api';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeAdded: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onEmployeeAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    hireDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error('Employee name is required');
      }

      // Submit to API
      await createEmployee(formData);
      
      // Reset form and close modal
      setFormData({
        name: '',
        email: '',
        phone: '',
        hireDate: ''
      });
      
      onEmployeeAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add employee');
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
        {isSubmitting ? 'Adding...' : 'Add Employee'}
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
      title="Add New Employee"
      footer={modalFooter}
      size="medium"
    >
      <form className={styles.form} style={formStyle} onSubmit={handleSubmit}>
        {error && <div className={styles.errorMessage} style={errorMessageStyle}>{error}</div>}
        
        <div className={styles.formGroup} style={formGroupStyle}>
          <label htmlFor="name" className={styles.label} style={labelStyle}>
            Employee Name <span className={styles.required} style={requiredStyle}>*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            style={inputStyle}
            placeholder="Enter employee name"
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
          <label htmlFor="hireDate" className={styles.label} style={labelStyle}>Hire Date</label>
          <input
            id="hireDate"
            name="hireDate"
            type="date"
            value={formData.hireDate}
            onChange={handleChange}
            className={styles.input}
            style={inputStyle}
          />
        </div>


      </form>
    </Modal>
  );
};

export default AddEmployeeModal;
