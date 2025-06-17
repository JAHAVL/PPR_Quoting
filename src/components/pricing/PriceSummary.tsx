import React from 'react';
import styles from '../../styles/Home.module.css';
import QuoteIcon from '../icons/QuoteIcon';
import Button from '../buttons/Button';
import { formatCurrency } from '../../utils/helpers';

interface PriceSummaryProps {
  finalPrice: number;
  squareFootage: number;
  onViewFullQuote?: () => void;
  showViewQuoteButton?: boolean;
}

/**
 * PriceSummary - A reusable component for displaying the final price summary
 * with enhanced visual styling
 */
const PriceSummary: React.FC<PriceSummaryProps> = ({
  finalPrice,
  squareFootage,
  onViewFullQuote,
  showViewQuoteButton = true
}) => {
  const pricePerSqFt = squareFootage > 0 
    ? finalPrice / squareFootage 
    : 0;

  return (
    <div className={styles.quoteTotalContainer}>
      <div className={styles.quoteTotal}>
        <span>FINAL CUSTOMER PRICE:</span>
        <span className={styles.totalPrice}>{formatCurrency(finalPrice)}</span>
      </div>
      <div className={styles.pricePerSqFt}>
        <span>Price per Square Foot:</span>
        <span>{formatCurrency(pricePerSqFt)}/sq ft</span>
      </div>
      {showViewQuoteButton && onViewFullQuote && (
        <Button onClick={onViewFullQuote} className={styles.buttonMarginTop}>
          <QuoteIcon size="small" />
          VIEW FULL QUOTE
        </Button>
      )}
    </div>
  );
};

export default PriceSummary;
