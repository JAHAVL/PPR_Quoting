export interface QuoteBreakdown {
  serviceName: string;
  inputs: { [key: string]: string | number | boolean };
  rawServiceCost: number;
  paverCost?: number; // Added for new quote structure
  wallCost?: number; // Added for new quote structure
  grassRemovalCost?: number; // Added for new quote structure
  copingInstallCost?: number; // Added for coping installation
  copingMaterialCost?: number; // Added for coping material cost (pre-tax)
  copingMaterialCostWithTax?: number; // Added for coping material cost with tax
  totalCopingCost?: number; // Added for total coping cost
  totalDisposalCost?: number;
  totalMaterialCost?: number; // Including sales tax
  totalLaborCost?: number;
  totalDirectCosts: number;
  totalOperatingExpenses: number;
  originalBusinessProfit?: number; // Business profit before discount
  totalBusinessProfit: number; // Business profit after discount
  finalCustomerPrice: number;
  // Discount-related properties
  discountAmount?: number; // Amount of discount applied (from business profit)
  maxDiscountPerSqFt?: number; // Maximum discount per square foot based on tier
  // Detailed breakdown for display
  materialCostDetail?: number;
  salesTaxOnMaterials?: number;
  laborCostDetail?: number;
  disposalCostDetail?: number;
  marketingCost?: number;
  contingencyCost?: number;
  otherOperatingCost?: number;
}

export type PricingRuleUnit = 'sq ft' | 'linear ft' | 'flat' | 'hour' | 'each' | 'job';

export interface PricingRule {
  range?: { min: number; max: number };
  rate: number;
  unit: PricingRuleUnit;
  notes?: string;
  serviceName?: string; // For easier identification in UI
  minJobPrice?: number; // Minimum price for this specific service/tier
  materialCostPercent?: number; // Optional override for material cost percentage
  laborCostPercent?: number; // Optional override for labor cost percentage
}

export interface TieredPricing {
  [serviceType: string]: PricingRule[];
}

export interface FlatRateService {
  rate: number;
  unit: 'sq ft' | 'hour';
  notes?: string;
}

export const paverServices: TieredPricing = {
  standardInstallation: [
    {
      serviceName: 'Standard Paver Installation',
      rate: 1.75, // Corresponds to INSTALLATION_SERVICE_RATE_PER_SQFT from install-quote.tsx
      unit: 'sq ft',
      notes: 'Standard paver installation service with fixed material costs ($2.50/sqft paver, $1.00/sqft sand/concrete).',
      // No range needed as it's the only option and rate is fixed.
      // materialCostPercent and laborCostPercent are effectively overridden by direct logic in calculateQuote
    },
  ],
};

export const concreteServices: TieredPricing = {
  installation: [
    { serviceName: 'Concrete Installation (< 1,000 sq ft)', range: { min: 0, max: 999 }, rate: 6.00, unit: 'sq ft', notes: 'Standard rate' },
    { serviceName: 'Concrete Installation (1,000-2,000 sq ft)', range: { min: 1000, max: 2000 }, rate: 6.00, unit: 'sq ft', notes: 'Consistent pricing' }, // Note: Revenue_Breakdown.md shows same rate
    { serviceName: 'Concrete Installation (> 3,000 sq ft)', range: { min: 3001, max: Infinity }, rate: 6.00, unit: 'sq ft', notes: 'Volume pricing' }, // Note: Revenue_Breakdown.md shows same rate. There's a gap between 2000 and 3001 sq ft in the doc, assuming >2000 is covered by the >3000 tier or it's an oversight in the doc.
  ],
};

export const wallCapAddonRule: PricingRule = {
  serviceName: 'Wall Cap Add-on',
  rate: 2.00, // Example: $2.00 per linear foot, adjust as per actual pricing for cap itself
  unit: 'linear ft',
  notes: 'Add-on for wall cap installation, priced per linear foot of wall.'
};

export const wallConstruction: TieredPricing = {
  retainingWallWithCap: [
    { serviceName: 'Retaining Wall (With Cap)', rate: 8.00, unit: 'linear ft' },
  ],
  retainingWallWithoutCap: [
    { serviceName: 'Retaining Wall (Without Cap)', rate: 6.00, unit: 'linear ft' },
  ],
};

// Define specific types for disposal keys to improve type safety
export type DisposalMaterialTypeKey = 'paversAndBase' | 'concrete' | 'dirtGravel' | 'mixedDebrisGeneral';
export type DisposalRateKey = 'mixedConstructionDebris' | 'cleanConcrete' | 'yardWaste';

interface SqFtToWeightConversionDetail {
  lbsPerSqFt: number;
  materialType: DisposalRateKey;
}

export const additionalServices: { [key: string]: FlatRateService } = {
  sodRemoval: { rate: 1.00, unit: 'sq ft', notes: 'Complete removal' },
  materialHandler: { rate: 17.00, unit: 'hour', notes: 'Based on project size' },
};

export const disposalFees: {
  ratesPerTon: Record<DisposalRateKey, number>;
  minimumFee: number;
  sqFtToWeightConversion: Record<DisposalMaterialTypeKey, SqFtToWeightConversionDetail>;
  poundsPerTon: number;
} = {
  ratesPerTon: {
    mixedConstructionDebris: 69.00,
    cleanConcrete: 32.00,
    yardWaste: 32.00,
  },
  minimumFee: 10.00,
  sqFtToWeightConversion: {
    // Using average of 12-15 lbs for pavers/concrete, 10-12 for dirt/gravel as per doc
    // For simplicity, using a general 'mixed debris' default if not specified
    paversAndBase: { lbsPerSqFt: 13.5, materialType: 'mixedConstructionDebris' }, // average of 12-15
    concrete: { lbsPerSqFt: 13.5, materialType: 'cleanConcrete' }, // average of 12-15, assuming separated
    dirtGravel: { lbsPerSqFt: 11, materialType: 'mixedConstructionDebris' }, // average of 10-12
    mixedDebrisGeneral: { lbsPerSqFt: 12, materialType: 'mixedConstructionDebris' }, // from example: 12 lbs/sq ft for mixed debris
  },
  poundsPerTon: 2000,
};

export const cleanSealServices: TieredPricing = {
  cleanSandSeal: [
    { serviceName: 'Clean/Sand/Seal (< 500 sq ft)', range: { min: 0, max: 500 }, rate: 1250, unit: 'flat', notes: 'Minimum charge' },
    { serviceName: 'Clean/Sand/Seal (501-1,000 sq ft)', range: { min: 501, max: 1000 }, rate: 2.14, unit: 'sq ft', notes: 'Volume discount' },
    { serviceName: 'Clean/Sand/Seal (1,001-1,500 sq ft)', range: { min: 1001, max: 1500 }, rate: 1.80, unit: 'sq ft', notes: 'Volume discount' },
    { serviceName: 'Clean/Sand/Seal (1,501-2,000 sq ft)', range: { min: 1501, max: 2000 }, rate: 1.62, unit: 'sq ft', notes: 'Volume discount' },
    { serviceName: 'Clean/Sand/Seal (> 2,000 sq ft)', range: { min: 2001, max: Infinity }, rate: 1.44, unit: 'sq ft', notes: 'Best value' },
  ],
  strippingAddOn: [
    { serviceName: 'Stripping (Add-on)', rate: 0.60, unit: 'sq ft', notes: '$300 minimum', minJobPrice: 300 }, // This minimum needs to be handled in calculation logic
  ],
};

export const costAllocationPercentages = {
  // Default cost percentages if not specified by a service rule
  defaultMaterialCost: 0.25, // Example: 25% of raw service cost, adjust based on average
  defaultLaborCost: 0.35,    // Example: 35% of raw service cost, adjust based on average

  // Sales tax rate applied to material costs
  salesTaxRate: 0.06,

  // Allocations as a percentage of (Raw Service Cost + Disposal Cost)
  // These names are simplified for easier use in calculation logic
  marketing: 0.10,         // Was revenueToMarketing
  contingency: 0.05,       // Was revenueToContingency
  otherOperatingExpenses: 0.07, // Was revenueToOtherOperating
  profit: 0.399,           // Was revenueToBusinessProfit (this is a large chunk, ensure it aligns with how profit is calculated vs. direct/operating)

  // The following are for deeper financial analysis and might not be directly used in the simplified quote calculation's cost object
  // but are kept for reference from the original document.
  _revenueToDirectCosts_ref: 0.381,
  _revenueToOperatingExpenses_ref: 0.220,
  _directCostsToMaterials_ref: 0.588,
  _directCostsToLabor_ref: 0.308,
  _directCostsToDisposal_ref: 0.070,
  _directCostsToSalesTax_ref: 0.034,
  _profitToOwnersCompensation_ref: 0.40,
  _profitToPayrollTaxes_ref: 0.15,
  _profitToOfficeStaff_ref: 0.15,
  _profitToBusinessDevelopment_ref: 0.10,
  _profitToReserves_ref: 0.20,
};

// Helper function to find the correct pricing rule
export const findRule = (rules: PricingRule[], value: number): PricingRule | undefined => {
  return rules.find(rule => 
    rule.unit === 'flat' || // For flat rates, the first rule usually applies unless more complex logic is needed
    (rule.range && value >= rule.range.min && value <= rule.range.max)
  );
};

