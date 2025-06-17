exports.id = 2590;
exports.ids = [2590];
exports.modules = {

/***/ 1148:
/***/ ((module) => {

// Exports
module.exports = {
	"navigation": "Navigation_navigation__jkNaV",
	"quoteNavigation": "Navigation_quoteNavigation__QsNTF",
	"toggleContainer": "Navigation_toggleContainer__O_pBZ",
	"selectionPill": "Navigation_selectionPill__jvG9z",
	"pillText": "Navigation_pillText__XkAVO",
	"pillLeft": "Navigation_pillLeft__CyGt3",
	"pillRight": "Navigation_pillRight__J49lB",
	"leftLink": "Navigation_leftLink__IyfsC",
	"rightLink": "Navigation_rightLink__hgml7",
	"linkArea": "Navigation_linkArea__vrBPK",
	"sideText": "Navigation_sideText__7bFNp",
	"visuallyHidden": "Navigation_visuallyHidden__grvPg",
	"toggleButton": "Navigation_toggleButton__9TqdX",
	"navContainer": "Navigation_navContainer__zZm_l",
	"navLink": "Navigation_navLink__jA_2o",
	"activeTab": "Navigation_activeTab__kxSFT"
};


/***/ }),

/***/ 1745:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Navigation_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1148);
/* harmony import */ var _Navigation_module_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Navigation_module_css__WEBPACK_IMPORTED_MODULE_3__);




const QuoteNavigation = ({ className =""  })=>{
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    const currentPath = router.pathname;
    const isInstallQuoteActive = currentPath === "/install-quote";
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("nav", {
        className: `${(_Navigation_module_css__WEBPACK_IMPORTED_MODULE_3___default().navigation)} ${className} ${(_Navigation_module_css__WEBPACK_IMPORTED_MODULE_3___default().quoteNavigation)}`,
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: (_Navigation_module_css__WEBPACK_IMPORTED_MODULE_3___default().toggleContainer),
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: `${(_Navigation_module_css__WEBPACK_IMPORTED_MODULE_3___default().selectionPill)} ${isInstallQuoteActive ? (_Navigation_module_css__WEBPACK_IMPORTED_MODULE_3___default().pillLeft) : (_Navigation_module_css__WEBPACK_IMPORTED_MODULE_3___default().pillRight)}`
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: (_Navigation_module_css__WEBPACK_IMPORTED_MODULE_3___default().toggleLinks),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                            href: "/install-quote",
                            className: (_Navigation_module_css__WEBPACK_IMPORTED_MODULE_3___default().leftLink),
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                className: (_Navigation_module_css__WEBPACK_IMPORTED_MODULE_3___default().linkArea),
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                    className: (_Navigation_module_css__WEBPACK_IMPORTED_MODULE_3___default().sideText),
                                    children: "Install"
                                })
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                            href: "/clean-seal-quote",
                            className: (_Navigation_module_css__WEBPACK_IMPORTED_MODULE_3___default().rightLink),
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                className: (_Navigation_module_css__WEBPACK_IMPORTED_MODULE_3___default().linkArea),
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                    className: (_Navigation_module_css__WEBPACK_IMPORTED_MODULE_3___default().sideText),
                                    children: "MX"
                                })
                            })
                        })
                    ]
                })
            ]
        })
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QuoteNavigation);


/***/ }),

/***/ 6246:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$d": () => (/* binding */ costAllocationPercentages),
/* harmony export */   "B8": () => (/* binding */ disposalFees),
/* harmony export */   "Dg": () => (/* binding */ findRule),
/* harmony export */   "H6": () => (/* binding */ cleanSealServices),
/* harmony export */   "K6": () => (/* binding */ paverServices)
/* harmony export */ });
/* unused harmony exports concreteServices, wallCapAddonRule, wallConstruction, additionalServices */
const paverServices = {
    standardInstallation: [
        {
            serviceName: "Standard Paver Installation",
            rate: 1.75,
            unit: "sq ft",
            notes: "Standard paver installation service with fixed material costs ($2.50/sqft paver, $1.00/sqft sand/concrete)."
        }, 
    ]
};
const concreteServices = {
    installation: [
        {
            serviceName: "Concrete Installation (< 1,000 sq ft)",
            range: {
                min: 0,
                max: 999
            },
            rate: 6.00,
            unit: "sq ft",
            notes: "Standard rate"
        },
        {
            serviceName: "Concrete Installation (1,000-2,000 sq ft)",
            range: {
                min: 1000,
                max: 2000
            },
            rate: 6.00,
            unit: "sq ft",
            notes: "Consistent pricing"
        },
        {
            serviceName: "Concrete Installation (> 3,000 sq ft)",
            range: {
                min: 3001,
                max: Infinity
            },
            rate: 6.00,
            unit: "sq ft",
            notes: "Volume pricing"
        }
    ]
};
const wallCapAddonRule = {
    serviceName: "Wall Cap Add-on",
    rate: 2.00,
    unit: "linear ft",
    notes: "Add-on for wall cap installation, priced per linear foot of wall."
};
const wallConstruction = {
    retainingWallWithCap: [
        {
            serviceName: "Retaining Wall (With Cap)",
            rate: 8.00,
            unit: "linear ft"
        }, 
    ],
    retainingWallWithoutCap: [
        {
            serviceName: "Retaining Wall (Without Cap)",
            rate: 6.00,
            unit: "linear ft"
        }, 
    ]
};
const additionalServices = {
    sodRemoval: {
        rate: 1.00,
        unit: "sq ft",
        notes: "Complete removal"
    },
    materialHandler: {
        rate: 17.00,
        unit: "hour",
        notes: "Based on project size"
    }
};
const disposalFees = {
    ratesPerTon: {
        mixedConstructionDebris: 69.00,
        cleanConcrete: 32.00,
        yardWaste: 32.00
    },
    minimumFee: 10.00,
    sqFtToWeightConversion: {
        // Using average of 12-15 lbs for pavers/concrete, 10-12 for dirt/gravel as per doc
        // For simplicity, using a general 'mixed debris' default if not specified
        paversAndBase: {
            lbsPerSqFt: 13.5,
            materialType: "mixedConstructionDebris"
        },
        concrete: {
            lbsPerSqFt: 13.5,
            materialType: "cleanConcrete"
        },
        dirtGravel: {
            lbsPerSqFt: 11,
            materialType: "mixedConstructionDebris"
        },
        mixedDebrisGeneral: {
            lbsPerSqFt: 12,
            materialType: "mixedConstructionDebris"
        }
    },
    poundsPerTon: 2000
};
const cleanSealServices = {
    cleanSandSeal: [
        {
            serviceName: "Clean/Sand/Seal (< 500 sq ft)",
            range: {
                min: 0,
                max: 500
            },
            rate: 1250,
            unit: "flat",
            notes: "Minimum charge"
        },
        {
            serviceName: "Clean/Sand/Seal (501-1,000 sq ft)",
            range: {
                min: 501,
                max: 1000
            },
            rate: 2.14,
            unit: "sq ft",
            notes: "Volume discount"
        },
        {
            serviceName: "Clean/Sand/Seal (1,001-1,500 sq ft)",
            range: {
                min: 1001,
                max: 1500
            },
            rate: 1.80,
            unit: "sq ft",
            notes: "Volume discount"
        },
        {
            serviceName: "Clean/Sand/Seal (1,501-2,000 sq ft)",
            range: {
                min: 1501,
                max: 2000
            },
            rate: 1.62,
            unit: "sq ft",
            notes: "Volume discount"
        },
        {
            serviceName: "Clean/Sand/Seal (> 2,000 sq ft)",
            range: {
                min: 2001,
                max: Infinity
            },
            rate: 1.44,
            unit: "sq ft",
            notes: "Best value"
        }, 
    ],
    strippingAddOn: [
        {
            serviceName: "Stripping (Add-on)",
            rate: 0.60,
            unit: "sq ft",
            notes: "$300 minimum",
            minJobPrice: 300
        }
    ]
};
const costAllocationPercentages = {
    // Default cost percentages if not specified by a service rule
    defaultMaterialCost: 0.25,
    defaultLaborCost: 0.35,
    // Sales tax rate applied to material costs
    salesTaxRate: 0.06,
    // Allocations as a percentage of (Raw Service Cost + Disposal Cost)
    // These names are simplified for easier use in calculation logic
    marketing: 0.10,
    contingency: 0.05,
    otherOperatingExpenses: 0.07,
    profit: 0.399,
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
    _profitToReserves_ref: 0.20
};
// Helper function to find the correct pricing rule
const findRule = (rules, value)=>{
    return rules.find((rule)=>rule.unit === "flat" || // For flat rates, the first rule usually applies unless more complex logic is needed
        rule.range && value >= rule.range.min && value <= rule.range.max);
};


/***/ })

};
;