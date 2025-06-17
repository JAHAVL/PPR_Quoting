import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {
  paverServices, // Only paver services needed for primary selection
  costAllocationPercentages,
  disposalFees,
  PricingRule,
  QuoteBreakdown,
  wallCapAddonRule // Assuming this can be repurposed or a similar rule exists for general wall ln ft
} from '../utils/pricingRules';
import { useRouter } from 'next/router';
import { formatCurrency } from '../utils/helpers';

// Import components
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/buttons/Button';
import TextField from '../components/fields/TextField';
import SelectField from '../components/fields/SelectField';
import ToggleSwitch from '../components/fields/ToggleSwitch';
import QuoteNavigation from '../components/navigation/QuoteNavigation';
import InstallIcon from '../components/icons/InstallIcon';
import CalculateIcon from '../components/icons/CalculateIcon';
import QuoteIcon from '../components/icons/QuoteIcon';
import PriceSummary from '../components/pricing/PriceSummary';

// pageStyle constant removed as its functionality is now in PageContainer

// Placeholder rule for grass removal - ideally, this would come from pricingRules.ts
const grassRemovalRule: PricingRule = {
  serviceName: "Grass Removal",
  unit: "sq ft",
  rate: 2, // Example: $2 per sq ft
  materialCostPercent: 0, // Assuming mostly labor/disposal
  laborCostPercent: 0.7, // Example
};

export default function InstallQuotePage() {
  const router = useRouter();

  const [squareFootage, setSquareFootage] = useState<string>('');
  const [selectedPaverKey, setSelectedPaverKey] = useState<string>('standardInstallation::0'); // Stores composite key e.g., "installation::0"
  const [selectedPaverRule, setSelectedPaverRule] = useState<PricingRule | null>(null);
  
  const [isWallAddition, setIsWallAddition] = useState<boolean>(false);
  const [wallLinearFootage, setWallLinearFootage] = useState<string>('');
  const [wallIncludesCap, setWallIncludesCap] = useState<boolean>(true); // true = with cap, false = without
  
  const [isCopingAddition, setIsCopingAddition] = useState<boolean>(false);
  const [copingLinearFootage, setCopingLinearFootage] = useState<string>('');
  
  const [isGrassRemoval, setIsGrassRemoval] = useState<boolean>(false);
  
  // Discount is always calculated but can be applied via toggle if needed
  const [applyMaxDiscount, setApplyMaxDiscount] = useState<boolean>(true);

  const [quote, setQuote] = useState<QuoteBreakdown | null>(null);

  const paverTypeOptions = Object.entries(paverServices).flatMap(([categoryKey, rulesArray]) =>
    rulesArray.map((rule, index) => ({
      value: `${categoryKey}::${index}`, // Composite key: "category::index"
      label: rule.serviceName || `Unnamed Paver Service (${categoryKey})`,
    }))
  );

  const PAVER_MATERIAL_COST_PER_SQFT = 2.50;
  const SAND_CONCRETE_COST_PER_SQFT = 1.00;
  const INSTALLATION_LABOR_COST_PER_SQFT = 1.75; // Direct installation labor
  const HELPER_LABOR_COST_PER_SQFT = 0.09; // Helper labor
  const LBS_PER_SQFT_DISPOSAL = 12; // Average weight per sq ft of removed material
  const DISPOSAL_RATE_PER_TON = disposalFees.ratesPerTon.mixedConstructionDebris; // $69 per ton
  const GRASS_REMOVAL_COST_PER_SQFT = 1.0; // Sod removal labor
  const WALL_LABOR_RATE_WITH_CAP = 8.0; // $8 per linear ft
  const WALL_LABOR_RATE_WITHOUT_CAP = 6.0; // $6 per linear ft
  const COPING_INSTALL_COST_PER_LF = 10.0; // $10 per linear ft installation
  const COPING_MATERIAL_COST_PER_LF = 18.0; // $18 per linear ft material cost
  
  // Discount tiers based on square footage matching labor rates in Revenue_Breakdown.md
  const getMaxDiscountPerSqFt = (sqFt: number): number => {
    if (sqFt > 3000) return 0.50; // $0.50 discount for >3,000 sq ft (labor $1.75 → $1.25)
    if (sqFt >= 1000) return 0.25; // $0.25 discount for 1,000–3,000 sq ft (labor $1.75 → $1.50)
    return 0; // No discount for < 1,000 sq ft
  };

  const handlePaverTypeChange = (value: string) => {
    setSelectedPaverKey(value);
  };
  
  // Define calculateQuote function using useCallback to avoid dependency issues
  const calculateQuote = useCallback(() => {
    try {
      if (squareFootage && selectedPaverRule) {
        const sqFt = parseFloat(squareFootage);
        if (isNaN(sqFt) || sqFt <= 0) {
          alert("Please enter a valid square footage.");
          return;
        }

      // Base calculations
      const paverRate = selectedPaverRule.rate;
      const materialCostPercent = selectedPaverRule.materialCostPercent || 0.6; // Default to 60% if not specified
      const laborCostPercent = selectedPaverRule.laborCostPercent || 0.4; // Default to 40% if not specified

      // Calculate base costs
      const totalBaseCost = sqFt * paverRate;
      const baseMaterialCost = totalBaseCost * materialCostPercent;
      const baseLaborCost = totalBaseCost * laborCostPercent;

      // --- Core Material and Service Calculations ---
      const calculatedPaverMaterialCost = sqFt * PAVER_MATERIAL_COST_PER_SQFT;
      const calculatedSandConcreteMaterialCost = sqFt * SAND_CONCRETE_COST_PER_SQFT;
      const totalBaseMaterialCost = calculatedPaverMaterialCost + calculatedSandConcreteMaterialCost; // Pre-tax

      // Pre-tax material cost
      const materialCostDetail = totalBaseMaterialCost;
      
      const installationLaborCost = sqFt * INSTALLATION_LABOR_COST_PER_SQFT;
      const helperLaborCost = sqFt * HELPER_LABOR_COST_PER_SQFT;
      const totalLaborCost = installationLaborCost + helperLaborCost;

      // Disposal calculation: 12 lbs per sq ft, $69 per ton, $10 minimum
      const disposalWeightLbs = sqFt * LBS_PER_SQFT_DISPOSAL;
      const disposalTons = disposalWeightLbs / disposalFees.poundsPerTon;
      let totalDisposalCost = disposalTons * DISPOSAL_RATE_PER_TON;
      if (totalDisposalCost < disposalFees.minimumFee) totalDisposalCost = disposalFees.minimumFee;

      // Wall construction cost - add proper validation
      const wallFt = isWallAddition ? (parseFloat(wallLinearFootage) || 0) : 0;
      const wallRate = wallIncludesCap ? WALL_LABOR_RATE_WITH_CAP : WALL_LABOR_RATE_WITHOUT_CAP;
      const wallCost = isWallAddition && wallFt > 0 ? wallFt * wallRate : 0;

      // Coping for pool deck cost calculation - using LINEAR feet
      let copingLF = 0;
      let copingInstallCost = 0;
      let copingMaterialCost = 0;
      let copingMaterialCostWithTax = 0;
      let totalCopingCost = 0;
      
      if (isCopingAddition && copingLinearFootage) {
        copingLF = parseFloat(copingLinearFootage) || 0;
        copingInstallCost = copingLF * COPING_INSTALL_COST_PER_LF;
        copingMaterialCost = copingLF * COPING_MATERIAL_COST_PER_LF;
        copingMaterialCostWithTax = copingMaterialCost * (1 + costAllocationPercentages.salesTaxRate);
        totalCopingCost = copingInstallCost + copingMaterialCostWithTax;
      }

      // Grass / sod removal cost
      const grassRemovalCost = isGrassRemoval ? sqFt * GRASS_REMOVAL_COST_PER_SQFT : 0;

      // --- Cost Aggregation for Overheads, Profit, and Final Price ---
      // First, calculate total direct costs (materials + labor + disposal + coping)
      const totalMaterialCostWithTax = materialCostDetail * (1 + costAllocationPercentages.salesTaxRate);
      let totalDirectCosts = totalMaterialCostWithTax + totalLaborCost + totalDisposalCost + wallCost + grassRemovalCost + totalCopingCost;

      // Overhead and profit are defined as percentages of the FINAL customer price.
      const overheadRate =
        costAllocationPercentages.marketing +
        costAllocationPercentages.contingency +
        costAllocationPercentages.otherOperatingExpenses;
      const profitRate = costAllocationPercentages.profit;

      // Solve for finalCustomerPrice where:
      // finalPrice = directCosts + finalPrice * (overheadRate + profitRate)
      // => finalPrice * (1 - overheadRate - profitRate) = directCosts
      const denominator = 1 - (overheadRate + profitRate);
      const finalCustomerPrice = denominator > 0 ? totalDirectCosts / denominator : totalDirectCosts;

      // Allocate overhead and profit based on the final price
      const marketingCost = finalCustomerPrice * costAllocationPercentages.marketing;
      const contingencyCost = finalCustomerPrice * costAllocationPercentages.contingency;
      const otherOperatingCost = finalCustomerPrice * costAllocationPercentages.otherOperatingExpenses;
      const totalOperatingExpenses = marketingCost + contingencyCost + otherOperatingCost;

      let totalBusinessProfit = finalCustomerPrice * profitRate;
      
      // Always calculate maximum discount (only affects business profit)
      const maxDiscountPerSqFt = getMaxDiscountPerSqFt(sqFt);
      const potentialDiscountAmount = sqFt * maxDiscountPerSqFt;
      
      // Cap the discount at 50% of business profit to ensure profitability
      const discountAmount = Math.min(potentialDiscountAmount, totalBusinessProfit * 0.5);
      
      // Store original business profit before discount
      const originalBusinessProfit = totalBusinessProfit;
      
      // Apply discount to business profit
      const adjustedBusinessProfit = originalBusinessProfit - discountAmount;

      // --- Final Price Calculation ---
      // totalDirectCosts and finalCustomerPrice were calculated above using the percentage-of-revenue approach.
      // If discount is applied, the final customer price is reduced by the discount amount

      setQuote({
        serviceName: 'Standard Paver Installation', // Simplified service name
        inputs: {
          squareFootage: sqFt,
          // selectedPaverKey: selectedPaverKey, // Commented out: Paver type is fixed
          isWallAddition, // Kept for UI state, but cost is neutralized
          wallLinearFootage: wallFt, // Use validated wallFt instead of raw input
          isGrassRemoval, // Kept for UI state, but cost is neutralized
          isCopingAddition,
          copingLinearFootage: copingLF,
        },
        rawServiceCost: installationLaborCost,       // Direct installation labor cost
        paverCost: totalBaseMaterialCost,       // Displaying sum of paver & sand/concrete material (pre-tax)
        
        wallCost: wallCost > 0 ? wallCost : undefined,
        grassRemovalCost: grassRemovalCost > 0 ? grassRemovalCost : undefined,
        copingInstallCost: copingInstallCost > 0 ? copingInstallCost : undefined,
        copingMaterialCost: copingMaterialCost > 0 ? copingMaterialCost : undefined,
        copingMaterialCostWithTax: copingMaterialCostWithTax > 0 ? copingMaterialCostWithTax : undefined,
        totalCopingCost: totalCopingCost > 0 ? totalCopingCost : undefined,
        
        materialCostDetail: materialCostDetail,         // Pre-tax total material cost
        salesTaxOnMaterials: materialCostDetail * costAllocationPercentages.salesTaxRate,       // Calculated sales tax on materials
        totalMaterialCost: totalMaterialCostWithTax,    // Total material cost including tax
        
        laborCostDetail: installationLaborCost,               // Direct installation labor
        totalLaborCost: totalLaborCost,                // Install + helper labor
        
        totalDisposalCost: totalDisposalCost,
        
        totalDirectCosts: totalDirectCosts,
        
        marketingCost: marketingCost,
        contingencyCost: contingencyCost,
        otherOperatingCost: otherOperatingCost,
        totalOperatingExpenses: totalOperatingExpenses,
        
        originalBusinessProfit: originalBusinessProfit,
        totalBusinessProfit: adjustedBusinessProfit, // This is now the adjusted profit after discount
        discountAmount: discountAmount,
        maxDiscountPerSqFt: maxDiscountPerSqFt,
        finalCustomerPrice: finalCustomerPrice - discountAmount,
      });
      }
    } catch (error) {
      console.error('Error in calculateQuote:', error);
      alert('An error occurred while calculating the quote. Please check your inputs and try again.');
      setQuote(null);
    }
  }, [squareFootage, isWallAddition, wallLinearFootage, wallIncludesCap, isGrassRemoval, isCopingAddition, copingLinearFootage, applyMaxDiscount, selectedPaverRule, paverServices]);

  const handleViewGeneratedQuote = () => {
    if (quote) {
      // Store quote in session storage for the view page
      sessionStorage.setItem('currentQuote', JSON.stringify(quote));
      router.push('/view-quote');
    }
  };

  // Handle paver selection changes
  useEffect(() => {
    if (selectedPaverKey) {
      const [categoryKey, ruleIndexStr] = selectedPaverKey.split('::')
      const ruleIndex = parseInt(ruleIndexStr, 10);
      
      if (categoryKey && !isNaN(ruleIndex) && paverServices[categoryKey] && paverServices[categoryKey][ruleIndex]) {
        setSelectedPaverRule(paverServices[categoryKey][ruleIndex]);
      } else {
        setSelectedPaverRule(null);
      }
    } else {
      setSelectedPaverRule(null);
    }
  }, [selectedPaverKey]);

  // Recalculate quote when inputs change
  useEffect(() => {
    // Only recalculate if we have valid square footage
    if (squareFootage && parseFloat(squareFootage) > 0) {
      calculateQuote();
    }
  }, [calculateQuote]);

  return (
    <PageContainer>
      <Head>
        <title>Install Quote Calculator - PPR</title>
        <meta name="description" content="Generate quotes for paver installation services." />
      </Head>

      <PageHeader 
        title="Install Quote Calculator" 
        showBackButton
        backHref="/admin-dashboard"
      />
      <QuoteNavigation />

      <main className={styles.container}>
        <div className={styles.card}>
          <TextField
            id="squareFootage"
            label="Total Square Footage of Install:"
            type="number"
            value={squareFootage}
            onChange={(e) => setSquareFootage(e.target.value)}
            placeholder="Enter total sq ft"
            required
          />

          <SelectField
            id="paverType"
            label="Paver Type:"
            value={selectedPaverKey}
            onChange={(e) => handlePaverTypeChange(e.target.value)}
            options={paverTypeOptions}
            required
          />
          
          <ToggleSwitch
            id="wallAdditionToggle"
            label="Add Wall Construction?"
            checked={isWallAddition}
            onChange={setIsWallAddition}
          />

          {isWallAddition && (
            <>
              <TextField
                id="wallLinearFootage"
                label="Linear Footage of Wall:"
                type="number"
                value={wallLinearFootage}
                onChange={(e) => setWallLinearFootage(e.target.value)}
                placeholder="Enter linear ft for wall"
                required
              />
              <ToggleSwitch
                id="wallCapToggle"
                label="Include Cap on Wall?"
                checked={wallIncludesCap}
                onChange={setWallIncludesCap}
              />
            </>
          )}

          <ToggleSwitch
            id="grassRemovalToggle"
            label="Add Grass Removal?"
            checked={isGrassRemoval}
            onChange={setIsGrassRemoval}
          />
          
          <ToggleSwitch
            id="copingAdditionToggle"
            label="Add Coping For Pool Deck?"
            checked={isCopingAddition}
            onChange={setIsCopingAddition}
          />
          
          {isCopingAddition && (
            <TextField
              id="copingLinearFootage"
              label="Linear Footage of Coping:"
              type="number"
              value={copingLinearFootage}
              onChange={(e) => setCopingLinearFootage(e.target.value)}
              placeholder="Enter linear ft for coping"
              required
            />
          )}
          
          {/* Discount is now always calculated and shown */}

        </div>

        {quote && (
          <div className={styles.card}>
            <h3>Quote Breakdown ({quote.serviceName})</h3>
            <h4 className={styles.sectionHeader}>Project Details</h4>
            <div className={styles.quoteItem}><span>Square Footage:</span><span className={styles.price}>{quote.inputs.squareFootage} sq ft</span></div>
            
            <h4 className={styles.sectionHeader}>Materials</h4>
            <div className={styles.quoteItem}><span>Pavers ($2.50/sq ft):</span><span className={styles.price}>{formatCurrency(Number(quote.inputs.squareFootage) * PAVER_MATERIAL_COST_PER_SQFT)}</span></div>
            <div className={styles.quoteItem}><span>Sand & Concrete ($1.00/sq ft):</span><span className={styles.price}>{formatCurrency(Number(quote.inputs.squareFootage) * SAND_CONCRETE_COST_PER_SQFT)}</span></div>
            <div className={styles.quoteItem}><span>Material Subtotal:</span><span className={styles.price}>{formatCurrency(quote.materialCostDetail || 0)}</span></div>
            <div className={styles.quoteItem}><span>Sales Tax ({(costAllocationPercentages.salesTaxRate * 100).toFixed(1)}%):</span><span className={styles.price}>{formatCurrency(quote.salesTaxOnMaterials || 0)}</span></div>
            <div className={styles.quoteItem}><span>Total Materials (with tax):</span><span className={styles.price}>{formatCurrency(quote.totalMaterialCost || 0)}</span></div>
            
            <h4 className={styles.sectionHeader}>Labor</h4>
            <div className={styles.quoteItem}><span>Installation Labor ($1.75/sq ft):</span><span className={styles.price}>{formatCurrency(quote.laborCostDetail || 0)}</span></div>
            <div className={styles.quoteItem}><span>Helper Labor ($0.09/sq ft):</span><span className={styles.price}>{formatCurrency((quote.totalLaborCost || 0) - (quote.laborCostDetail || 0))}</span></div>
            <div className={styles.quoteItem}><span>Total Labor:</span><span className={styles.price}>{formatCurrency(quote.totalLaborCost || 0)}</span></div>
            
            <h4 className={styles.sectionHeader}>Disposal</h4>
            <div className={styles.quoteItem}><span>Weight (12 lbs/sq ft):</span><span className={styles.price}>{(Number(quote.inputs.squareFootage) * LBS_PER_SQFT_DISPOSAL).toFixed(0)} lbs</span></div>
            <div className={styles.quoteItem}><span>Disposal Cost ($69/ton):</span><span className={styles.price}>{formatCurrency(quote.totalDisposalCost || 0)}</span></div>
            
            {quote.wallCost !== undefined && (
              <>
              <h4 className={styles.sectionHeader}>Wall Construction</h4>
              <div className={styles.quoteItem}><span>Linear Footage:</span><span className={styles.price}>{Number(quote.inputs.wallLinearFootage).toLocaleString()} ft</span></div>
              <div className={styles.quoteItem}><span>Rate:</span><span className={styles.price}>{formatCurrency(wallIncludesCap ? WALL_LABOR_RATE_WITH_CAP : WALL_LABOR_RATE_WITHOUT_CAP)}/ft</span></div>
              <div className={styles.quoteItem}><span>Wall Cost:</span><span className={styles.price}>{formatCurrency(quote.wallCost)}</span></div>
              </>
            )}

            {quote.grassRemovalCost !== undefined && (
              <>
              <h4 className={styles.sectionHeader}>Grass / Sod Removal</h4>
              <div className={styles.quoteItem}><span>Rate:</span><span className={styles.price}>${GRASS_REMOVAL_COST_PER_SQFT.toFixed(2)}/sq ft</span></div>
              <div className={styles.quoteItem}><span>Grass Removal Cost:</span><span className={styles.price}>{formatCurrency(quote.grassRemovalCost)}</span></div>
              </>
            )}
            
            {quote.totalCopingCost !== undefined && (
              <>
              <h4 className={styles.sectionHeader}>Pool Deck Coping</h4>
              <div className={styles.quoteItem}><span>Linear Footage:</span><span className={styles.price}>{Number(quote.inputs.copingLinearFootage).toLocaleString()} linear ft</span></div>
              <div className={styles.quoteItem}><span>Installation Rate:</span><span className={styles.price}>${COPING_INSTALL_COST_PER_LF.toFixed(2)}/linear ft</span></div>
              <div className={styles.quoteItem}><span>Installation Cost:</span><span className={styles.price}>{formatCurrency(quote.copingInstallCost || 0)}</span></div>
              <div className={styles.quoteItem}><span>Material Rate:</span><span className={styles.price}>${COPING_MATERIAL_COST_PER_LF.toFixed(2)}/linear ft</span></div>
              <div className={styles.quoteItem}><span>Material Cost:</span><span className={styles.price}>{formatCurrency(quote.copingMaterialCost || 0)}</span></div>
              <div className={styles.quoteItem}><span>Sales Tax ({(costAllocationPercentages.salesTaxRate * 100).toFixed(1)}%):</span><span className={styles.price}>{formatCurrency((quote.copingMaterialCostWithTax || 0) - (quote.copingMaterialCost || 0))}</span></div>
              <div className={styles.quoteItem}><span>Total Coping Cost:</span><span className={styles.price}>{formatCurrency(quote.totalCopingCost || 0)}</span></div>
              </>
            )}
            
            <div className={styles.divider}></div>
            <div className={styles.quoteItem}><span>Total Direct Costs:</span><span className={styles.price}>{formatCurrency(quote.totalDirectCosts)}</span></div>
            
            <h4 className={styles.sectionHeader}>Overhead & Profit</h4>
            <div className={styles.quoteItem}><span>Marketing ({(costAllocationPercentages.marketing * 100).toFixed(1)}% of final):</span><span className={styles.price}>{formatCurrency(quote.marketingCost || 0)}</span></div>
            <div className={styles.quoteItem}><span>Contingency ({(costAllocationPercentages.contingency * 100).toFixed(1)}% of final):</span><span className={styles.price}>{formatCurrency(quote.contingencyCost || 0)}</span></div>
            <div className={styles.quoteItem}><span>Other Operating ({(costAllocationPercentages.otherOperatingExpenses * 100).toFixed(1)}% of final):</span><span className={styles.price}>{formatCurrency(quote.otherOperatingCost || 0)}</span></div>
            <div className={styles.quoteItem}><span>Total Operating Expenses:</span><span className={styles.price}>{formatCurrency(quote.totalOperatingExpenses)}</span></div>
            
            <div className={styles.quoteItem}><span>Original Business Profit ({(costAllocationPercentages.profit * 100).toFixed(1)}% of final):</span><span className={styles.price}>{formatCurrency(quote.originalBusinessProfit || 0)}</span></div>
            
            <h4 className={styles.sectionHeader}>Discount</h4>
            <div className={styles.quoteItem}><span>Square Footage Tier:</span><span className={styles.price}>{Number(quote.inputs.squareFootage).toLocaleString()} sq ft</span></div>
            <div className={styles.quoteItem}><span>Maximum Discount Rate:</span><span className={styles.price}>${quote.maxDiscountPerSqFt?.toFixed(2)}/sq ft {quote.maxDiscountPerSqFt === 0 ? '(None for projects < 1,000 sq ft)' : quote.maxDiscountPerSqFt === 0.25 ? '(Projects 1,000–3,000 sq ft)' : '(Projects > 3,000 sq ft)'}</span></div>
            <div className={styles.quoteItem}><span>Total Discount Amount:</span><span className={styles.price}>-{formatCurrency(quote.discountAmount || 0)}</span></div>
            <div className={styles.quoteItem}><span>Applied To:</span><span className={styles.price}>Business Profit Only</span></div>
            <div className={styles.quoteItem}><span>Adjusted Business Profit:</span><span className={styles.price}>{formatCurrency(quote.totalBusinessProfit || 0)}</span></div>
            
            <div className={styles.divider}></div>
            
            <PriceSummary 
              finalPrice={quote.finalCustomerPrice || 0}
              squareFootage={Number(quote.inputs.squareFootage)}
              onViewFullQuote={handleViewGeneratedQuote}
              showViewQuoteButton={true}
            />
          </div>
        )}
      </main>
    </PageContainer>
  );
}
