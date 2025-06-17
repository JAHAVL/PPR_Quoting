import React, { useState, useEffect, ChangeEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import PageHeader from '../components/layout/PageHeader';
import QuoteNavigation from '../components/navigation/QuoteNavigation';
import CleanSealIcon from '../components/icons/CleanSealIcon';
import CalculateIcon from '../components/icons/CalculateIcon';
import QuoteIcon from '../components/icons/QuoteIcon';
import TextField from '../components/fields/TextField';
import Button from '../components/buttons/Button';
import { formatCurrency } from '../utils/helpers';
import {
  cleanSealServices,
  costAllocationPercentages,
  PricingRule,
  QuoteBreakdown,
  TieredPricing,
  findRule, // Helper function to find the correct rule in tiered pricing
} from '../utils/pricingRules';
import PageContainer from '../components/layout/PageContainer'; // Added PageContainer

// Define service categories for Clean & Seal
const cleanSealServiceCategories = {
  cleanSandSeal: "Clean/Sand/Seal",
  strippingAddOn: "Stripping (Add-on)",
};

export default function CleanSealQuotePage() {
  const router = useRouter();

  // Custom pageStyle constant removed, PageContainer handles this

  const [selectedServiceKey, setSelectedServiceKey] = useState<string>('cleanSandSeal'); // Default to main service
  const [specificServiceRule, setSpecificServiceRule] = useState<PricingRule | null>(null);
  const [squareFootage, setSquareFootage] = useState<string>('');
  const [applyStripping, setApplyStripping] = useState<boolean>(false);
  const [quote, setQuote] = useState<QuoteBreakdown | null>(null);

  // Determine available services based on the selected key (though cleanSealServices is simpler)
  const availableRules = cleanSealServices[selectedServiceKey];

  useEffect(() => {
    // Reset quote when inputs change
    setQuote(null);
    // Automatically select the rule if it's not tiered or find based on sqft if tiered
    if (availableRules && !Array.isArray(availableRules)) {
      // This case might not happen for cleanSealServices as defined
      setSpecificServiceRule(availableRules as PricingRule);
    } else if (Array.isArray(availableRules)) {
      // For tiered, rule selection might depend on square footage, handled in calculateQuote
      // Or, if a flat selection is made (e.g. stripping), set it directly
      if (selectedServiceKey === 'strippingAddOn' && cleanSealServices.strippingAddOn) {
        setSpecificServiceRule(cleanSealServices.strippingAddOn[0]); // Assuming stripping is a single rule in an array
      } else {
        setSpecificServiceRule(null); // Requires sq ft for main service rule finding
      }
    }
  }, [selectedServiceKey, squareFootage, availableRules]);

  const handleServiceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedServiceKey(event.target.value);
    // If switching to stripping, it's a direct rule. If to cleanSandSeal, it depends on sqft.
    if (event.target.value === 'strippingAddOn' && cleanSealServices.strippingAddOn) {
      setSpecificServiceRule(cleanSealServices.strippingAddOn[0]);
    } else {
      // Rule for cleanSandSeal will be found in calculateQuote based on sqft
      setSpecificServiceRule(null); 
    }
  };

  const calculateQuote = () => {
    const sqFt = parseFloat(squareFootage);
    if (isNaN(sqFt) || sqFt <= 0) {
      alert('Please enter a valid square footage.');
      setQuote(null);
      return;
    }

    let mainServiceRule = findRule(cleanSealServices.cleanSandSeal, sqFt);
    if (!mainServiceRule) {
      alert('Could not find a pricing rule for the entered square footage.');
      setQuote(null);
      return;
    }

    let rawServiceCost = mainServiceRule.unit === 'flat' ? mainServiceRule.rate : sqFt * mainServiceRule.rate;
    let serviceName = mainServiceRule.serviceName ?? 'Clean/Sand/Seal';
    const inputs: QuoteBreakdown['inputs'] = {
      'Square Footage': sqFt,
      'Main Service Rule': serviceName,
    };

    // Handle Stripping Add-on
    let strippingCost = 0;
    if (applyStripping && cleanSealServices.strippingAddOn && cleanSealServices.strippingAddOn[0]) {
      const strippingRule = cleanSealServices.strippingAddOn[0];
      strippingCost = sqFt * strippingRule.rate;
      // Apply minimum for stripping if defined in notes or as a property (e.g., minJobPrice)
      if (strippingRule.minJobPrice && strippingCost < strippingRule.minJobPrice) {
        strippingCost = strippingRule.minJobPrice;
      }
      rawServiceCost += strippingCost;
      serviceName += ' + Stripping';
      inputs['Stripping Add-on Cost'] = strippingCost;
    }

    // Apply minJobPrice for the main service if applicable
    if (mainServiceRule.minJobPrice && rawServiceCost < mainServiceRule.minJobPrice) {
        // Note: if stripping is added, this logic might need adjustment
        // For now, assumes minJobPrice applies to the combined cost if stripping is part of the 'job'
        // or applies to main service cost before stripping is added.
        // Current: applies to rawServiceCost *after* stripping is potentially added.
        rawServiceCost = mainServiceRule.minJobPrice;
    }

    const ca = costAllocationPercentages;
    const materialCostPercent = mainServiceRule.materialCostPercent ?? ca.defaultMaterialCost;
    const materialCostBeforeTax = rawServiceCost * materialCostPercent;
    const salesTaxOnMaterials = materialCostBeforeTax * ca.salesTaxRate;
    const totalMaterialCost = materialCostBeforeTax + salesTaxOnMaterials;

    const laborCostPercent = mainServiceRule.laborCostPercent ?? ca.defaultLaborCost;
    const totalLaborCost = rawServiceCost * laborCostPercent;

    // For Clean & Seal, disposal costs are typically not a separate line item unless specified.
    // Assuming no separate disposal cost for now.
    const totalDisposalCost = 0;

    const totalDirectCosts = totalMaterialCost + totalLaborCost + totalDisposalCost;

    const baseForOperatingAndProfit = rawServiceCost + totalDisposalCost; // totalDisposalCost is 0 here
    const marketingCost = baseForOperatingAndProfit * ca.marketing;
    const contingencyCost = baseForOperatingAndProfit * ca.contingency;
    const otherOperatingCost = baseForOperatingAndProfit * ca.otherOperatingExpenses;
    const totalOperatingExpenses = marketingCost + contingencyCost + otherOperatingCost;

    const totalBusinessProfit = baseForOperatingAndProfit * ca.profit;
    const finalCustomerPrice = totalDirectCosts + totalOperatingExpenses + totalBusinessProfit;

    setQuote({
      serviceName,
      inputs,
      rawServiceCost,
      totalDisposalCost: totalDisposalCost > 0 ? totalDisposalCost : undefined,
      materialCostDetail: materialCostBeforeTax,
      salesTaxOnMaterials,
      totalMaterialCost,
      laborCostDetail: totalLaborCost,
      totalLaborCost,
      totalDirectCosts,
      marketingCost,
      contingencyCost,
      otherOperatingCost,
      totalOperatingExpenses,
      totalBusinessProfit,
      finalCustomerPrice,
    });
  };

  const handleViewGeneratedQuote = () => {
    if (quote) {
      router.push(`/view-quote?quoteData=${encodeURIComponent(JSON.stringify(quote))}`);
    }
  };

  return (
    <PageContainer>
      <Head>
        <title>Clean & Seal Quote - PPR Quoting</title>
        <meta name="description" content="Generate Clean & Seal Quotes for Pavers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageHeader 
        title="PPR" 
        showBackButton={true} 
        backHref="/admin-dashboard"
      />
      
      <QuoteNavigation />

      <main className={styles.main}>
        <h1 className={styles.title}>
          <CleanSealIcon size="large" color="var(--ppr-primary)" />
          <span>Clean & Seal Quote</span>
        </h1>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Service Details</h3>
            <TextField
              id="squareFootage"
              label="Square Footage (sq ft)"
              type="number"
              value={squareFootage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSquareFootage(e.target.value)}
              placeholder="Enter total sq ft"
              min="0"
              step="any"
            />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <input
                type="checkbox"
                id="applyStripping"
                checked={applyStripping}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApplyStripping(e.target.checked)}
              />
              <label htmlFor="applyStripping" style={{ marginLeft: '8px' }}>Apply Stripping Add-on?</label>
            </div>
            <Button
              variant="primary"
              onClick={calculateQuote}
              className={styles.buttonMarginTop}
            >
              <CalculateIcon size="small" />
              Calculate Clean & Seal Quote
            </Button>
          </div>

          {quote && (
            <div className={styles.card}>
              <h3>Quote Breakdown ({(quote && quote.serviceName) ? quote.serviceName : 'N/A'})</h3>
              <div className={styles.quoteItem}><span>Raw Service Cost:</span><span className={styles.price}>{formatCurrency(quote.rawServiceCost)}</span></div>
              {/* No disposal cost shown for C&S unless specifically added */}
              <div className={styles.divider}></div>
              <div className={styles.quoteItem}><span>Material Cost (incl. tax):</span><span className={styles.price}>{formatCurrency(quote.totalMaterialCost || 0)}</span></div>
              <div className={styles.quoteItem}><span>Labor Cost:</span><span className={styles.price}>{formatCurrency(quote.totalLaborCost || 0)}</span></div>
              <div className={styles.quoteItem}><span>Total Direct Costs:</span><span className={styles.price}>{formatCurrency(quote.totalDirectCosts)}</span></div>
              <div className={styles.divider}></div>
              <div className={styles.quoteItem}><span>Marketing ({costAllocationPercentages.marketing*100}%):</span><span className={styles.price}>{formatCurrency(quote.marketingCost || 0)}</span></div>
              <div className={styles.quoteItem}><span>Contingency ({costAllocationPercentages.contingency*100}%):</span><span className={styles.price}>{formatCurrency(quote.contingencyCost || 0)}</span></div>
              <div className={styles.quoteItem}><span>Other Operating ({costAllocationPercentages.otherOperatingExpenses*100}%):</span><span className={styles.price}>{formatCurrency(quote.otherOperatingCost || 0)}</span></div>
              <div className={styles.quoteItem}><span>Total Operating Expenses:</span><span className={styles.price}>{formatCurrency(quote.totalOperatingExpenses)}</span></div>
              <div className={styles.divider}></div>
              <div className={styles.quoteItem}><span>Business Profit ({costAllocationPercentages.profit*100}%):</span><span className={styles.price}>{formatCurrency(quote.totalBusinessProfit)}</span></div>
              <div className={styles.divider}></div>
              <div className={styles.quoteTotal}><span>FINAL CUSTOMER PRICE:</span><span className={styles.totalPrice}>{formatCurrency(quote.finalCustomerPrice)}</span></div>
              <Button onClick={handleViewGeneratedQuote} variant="secondary" className={styles.buttonMarginTop}>
                <QuoteIcon size="small" />
                View Full Quote
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Footer removed as requested */}
    </PageContainer>
  );
}
