import React, { useState } from 'react';
import styles from '../../styles/Home.module.css';
import { formatCurrency } from '../../utils/helpers';
import Button from '../buttons/Button';
import TextField from '../fields/TextField';
import SelectField from '../fields/SelectField';
import ToggleSwitch from '../fields/ToggleSwitch';
import { costAllocationPercentages } from '../../utils/pricingRules';
import PriceSummary from '../pricing/PriceSummary';
import QuoteIcon from '../icons/QuoteIcon';
import InstallIcon from '../icons/InstallIcon';

// Interface for quote data
export interface QuoteDetailsData {
  id?: string;
  clientId?: string;
  clientName?: string;
  title?: string;
  description?: string;
  date?: string;
  expiryDate?: string;
  total?: number;
  status?: string;
  type?: string;
  serviceName?: string;
  rawServiceCost?: number;
  paverCost?: number;
  materialCostDetail?: number;
  laborCost?: number;
  installCost?: number;
  marketingCost?: number;
  profit?: number;
  profitMargin?: number;
  finalCustomerPrice?: number;
  squareFootage?: number;
  pricePerSqFt?: number;
  inputs?: Record<string, any>;
  calculations?: Record<string, any>;
  lineItems?: Record<string, any>;
  // Additional fields for UI
  isWallAddition?: boolean;
  wallLinearFootage?: number;
  isGrassRemoval?: boolean;
  isCopingAddition?: boolean;
  copingLinearFootage?: number;
}

interface QuoteDetailsProps {
  quote: QuoteDetailsData;
  isEditable?: boolean;
  onSave?: (updatedQuote: QuoteDetailsData) => Promise<void>;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({ 
  quote, 
  isEditable = false,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedQuote, setEditedQuote] = useState<QuoteDetailsData>(quote);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Helper to get the total price regardless of quote data structure
  const getTotalPrice = () => {
    if (quote.total) {
      return quote.total; // From database
    } else if (quote.finalCustomerPrice) {
      return quote.finalCustomerPrice; // From calculator
    }
    return 0;
  };

  // Get square footage from quote data
  const getSquareFootage = () => {
    if (quote.squareFootage) {
      return Number(quote.squareFootage);
    } else if (quote.inputs && quote.inputs.squareFootage) {
      return Number(quote.inputs.squareFootage);
    }
    return 0;
  };

  // Get service name from quote data
  const getServiceName = () => {
    if (quote.serviceName) {
      return quote.serviceName;
    } else if (quote.type) {
      return quote.type; // From database
    }
    return 'Service';
  };

  // Check if a feature is included in the quote
  const isFeatureIncluded = (featureName: string) => {
    if (quote[featureName as keyof QuoteDetailsData]) {
      return true;
    }
    
    if (quote.inputs && quote.inputs[featureName]) {
      return quote.inputs[featureName] === true || 
             quote.inputs[featureName] === 'true' || 
             Number(quote.inputs[featureName]) > 0;
    }
    return false;
  };

  // Handle input change for editable fields
  const handleInputChange = (field: keyof QuoteDetailsData, value: any) => {
    setEditedQuote(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle numeric input change
  const handleNumericChange = (field: keyof QuoteDetailsData, value: string) => {
    const numericValue = value === '' ? 0 : parseFloat(value);
    setEditedQuote(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  // Handle toggle for boolean fields
  const handleToggleChange = (field: keyof QuoteDetailsData, checked: boolean) => {
    setEditedQuote(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  // Handle save of edited quote
  const handleSave = async () => {
    if (!onSave) return;
    
    try {
      setIsSaving(true);
      setSaveError(null);
      await onSave(editedQuote);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save quote:', error);
      setSaveError('Failed to save quote. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Render editable field
  const renderEditableField = (
    label: string, 
    field: keyof QuoteDetailsData, 
    type: 'text' | 'number' | 'toggle' | 'select' = 'text',
    options?: { value: string, label: string }[]
  ) => {
    const value = editedQuote[field];
    
    if (!isEditing) {
      return (
        <div className={styles.quoteItem}>
          <span>{label}:</span>
          <span>
            {type === 'toggle' 
              ? (value ? 'Yes' : 'No')
              : type === 'number' && typeof value === 'number'
                ? formatCurrency(value)
                : String(value || '-')}
          </span>
        </div>
      );
    }

    switch (type) {
      case 'text':
        return (
          <div className={styles.formGroup}>
            <label htmlFor={`field-${field}`}>{label}:</label>
            <TextField
              id={`field-${field}`}
              label={label}
              value={value as string || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
          </div>
        );
      case 'number':
        return (
          <div className={styles.formGroup}>
            <label htmlFor={`field-${field}`}>{label}:</label>
            <TextField
              id={`field-${field}`}
              label={label}
              value={value?.toString() || '0'}
              onChange={(e) => handleNumericChange(field, e.target.value)}
              type="number"
              step="0.01"
            />
          </div>
        );
      case 'toggle':
        return (
          <div className={styles.formGroup}>
            <label htmlFor={`field-${field}`}>{label}:</label>
            <ToggleSwitch
              id={`field-${field}`}
              label={label}
              checked={!!value}
              onChange={(checked) => handleToggleChange(field, checked)}
            />
          </div>
        );
      case 'select':
        return (
          <div className={styles.formGroup}>
            <label htmlFor={`field-${field}`}>{label}:</label>
            <SelectField
              id={`field-${field}`}
              label={label}
              value={value as string || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              options={options || []}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.quoteDetailsContainer}>
      {/* Header with Edit/Save buttons */}
      <div className={styles.quoteDetailsHeader}>
        <h3>Quote Details</h3>
        {isEditable && (
          <div className={styles.actionButtons}>
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  variant="primary"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  onClick={() => {
                    setIsEditing(false);
                    setEditedQuote(quote);
                    setSaveError(null);
                  }} 
                  variant="secondary"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)} 
                variant="primary"
              >
                Edit Quote
              </Button>
            )}
          </div>
        )}
      </div>

      {saveError && (
        <div className={styles.errorMessage}>
          {saveError}
        </div>
      )}

      {/* Project Overview Section */}
      <div className={styles.card}>
        <div className={styles.featureSection}>
          <div className={styles.featureHeader}>
            <div className={styles.featureIcon}>
              <QuoteIcon />
            </div>
            <h4>Project Overview</h4>
          </div>
          <div className={styles.featureContent}>
            {renderEditableField('Quote Title', 'title')}
            {renderEditableField('Service Type', 'serviceName')}
            {renderEditableField('Project Area (sq ft)', 'squareFootage', 'number')}
            {renderEditableField('Date', 'date')}
            {renderEditableField('Expiry Date', 'expiryDate')}
            {renderEditableField('Status', 'status', 'select', [
              { value: 'draft', label: 'Draft' },
              { value: 'sent', label: 'Sent' },
              { value: 'accepted', label: 'Accepted' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'expired', label: 'Expired' }
            ])}
            {renderEditableField('Description', 'description')}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={styles.card}>
        <div className={styles.featureSection}>
          <div className={styles.featureHeader}>
            <div className={styles.featureIcon}>
              <InstallIcon />
            </div>
            <h4>Project Features</h4>
          </div>
          <div className={styles.featureContent}>
            {renderEditableField('Wall Addition', 'isWallAddition', 'toggle')}
            {(isEditing || isFeatureIncluded('isWallAddition') || (editedQuote.isWallAddition)) && 
              renderEditableField('Wall Linear Footage', 'wallLinearFootage', 'number')}
            
            {renderEditableField('Grass Removal', 'isGrassRemoval', 'toggle')}
            
            {renderEditableField('Coping Addition', 'isCopingAddition', 'toggle')}
            {(isEditing || isFeatureIncluded('isCopingAddition') || (editedQuote.isCopingAddition)) && 
              renderEditableField('Coping Linear Footage', 'copingLinearFootage', 'number')}
          </div>
        </div>
      </div>

      {/* Pricing Breakdown Section */}
      <div className={styles.card}>
        <div className={styles.featureSection}>
          <div className={styles.featureHeader}>
            <div className={styles.featureIcon}>
              <QuoteIcon />
            </div>
            <h4>Pricing Breakdown</h4>
          </div>
          <div className={styles.featureContent}>
            {renderEditableField('Raw Service Cost', 'rawServiceCost', 'number')}
            {renderEditableField('Paver Cost', 'paverCost', 'number')}
            {renderEditableField('Material Cost', 'materialCostDetail', 'number')}
            {renderEditableField('Labor Cost', 'laborCost', 'number')}
            {renderEditableField('Installation Cost', 'installCost', 'number')}
            {renderEditableField('Marketing Cost', 'marketingCost', 'number')}
            {renderEditableField('Profit', 'profit', 'number')}
            {renderEditableField('Profit Margin', 'profitMargin', 'number')}
            {renderEditableField('Price Per Sq Ft', 'pricePerSqFt', 'number')}
            
            <div className={styles.divider}></div>
            
            <div className={styles.quoteItem}>
              <span>Total Price:</span>
              <span className={styles.price}>{formatCurrency(getTotalPrice())}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className={styles.card}>
        <PriceSummary 
          finalPrice={getTotalPrice()}
          squareFootage={getSquareFootage()}
          showViewQuoteButton={false}
        />
      </div>
    </div>
  );
};

export default QuoteDetails;
