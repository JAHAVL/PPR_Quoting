exports.id = 6878;
exports.ids = [6878];
exports.modules = {

/***/ 4600:
/***/ ((module) => {

// Exports
module.exports = {
	"button": "Button_button__vidhW",
	"fullWidth": "Button_fullWidth__ewNSl",
	"primary": "Button_primary___Ovxd",
	"secondary": "Button_secondary__CPz0Q",
	"accent": "Button_accent__5Fd9s",
	"small": "Button_small__5SUDH",
	"medium": "Button_medium__xFkmq",
	"large": "Button_large__saJb8"
};


/***/ }),

/***/ 2092:
/***/ ((module) => {

// Exports
module.exports = {
	"formGroup": "TextField_formGroup__dl_kT",
	"label": "TextField_label__O7PgL",
	"required": "TextField_required__6_v0x",
	"input": "TextField_input__8YABb"
};


/***/ }),

/***/ 1250:
/***/ ((module) => {

// Exports
module.exports = {
	"container": "Home_container__Ennsq",
	"main": "Home_main__EtNt2",
	"footer": "Home_footer__7dKhS",
	"title": "Home_title__FX7xZ",
	"subtitle": "Home_subtitle__xVO9d",
	"grid": "Home_grid__c_g6N",
	"card": "Home_card__7oz7W",
	"formGroup": "Home_formGroup__2XSFL",
	"button": "Home_button__69vwW",
	"quoteItem": "Home_quoteItem___6e8k",
	"sectionHeader": "Home_sectionHeader__fHtmb",
	"price": "Home_price__yNfja",
	"divider": "Home_divider__TlqY0",
	"featureSection": "Home_featureSection__SYTd1",
	"featureHeader": "Home_featureHeader__SzvqX",
	"featureIcon": "Home_featureIcon__3oN_J",
	"featureContent": "Home_featureContent__zN7Bb",
	"quoteTotalContainer": "Home_quoteTotalContainer__Jpi4h",
	"quoteTotal": "Home_quoteTotal__F0VLC",
	"totalPrice": "Home_totalPrice__SRJZm",
	"pricePerSqFt": "Home_pricePerSqFt__2vuE3",
	"buttonMarginTop": "Home_buttonMarginTop__OLnyw",
	"navigation": "Home_navigation__ZnU_e",
	"navContainer": "Home_navContainer__SQ1A6",
	"navLink": "Home_navLink__h63PF",
	"activeTab": "Home_activeTab__Uw3xz",
	"loadingContainer": "Home_loadingContainer__9hOUs",
	"loadingSpinner": "Home_loadingSpinner___p4J4",
	"spin": "Home_spin__6wCPX",
	"fullWidth": "Home_fullWidth__R96nl",
	"selectWithButton": "Home_selectWithButton__wcQEt",
	"clientSelect": "Home_clientSelect__fKmK0",
	"addNewOption": "Home_addNewOption__aKBCr"
};


/***/ }),

/***/ 4038:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Button_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4600);
/* harmony import */ var _Button_module_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Button_module_css__WEBPACK_IMPORTED_MODULE_2__);



const Button = ({ children , onClick , type ="button" , disabled =false , variant ="primary" , size ="medium" , fullWidth =true , className ="" ,  })=>{
    const buttonClasses = [
        (_Button_module_css__WEBPACK_IMPORTED_MODULE_2___default().button),
        (_Button_module_css__WEBPACK_IMPORTED_MODULE_2___default())[variant],
        (_Button_module_css__WEBPACK_IMPORTED_MODULE_2___default())[size],
        fullWidth ? (_Button_module_css__WEBPACK_IMPORTED_MODULE_2___default().fullWidth) : "",
        className, 
    ].filter(Boolean).join(" ");
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
        className: buttonClasses,
        onClick: onClick,
        type: type,
        disabled: disabled,
        children: children
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Button);


/***/ }),

/***/ 3630:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _TextField_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2092);
/* harmony import */ var _TextField_module_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_TextField_module_css__WEBPACK_IMPORTED_MODULE_2__);



const TextField = ({ id , label , type ="text" , value , onChange , placeholder , min , max , step , required , disabled , className ,  })=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: `${(_TextField_module_css__WEBPACK_IMPORTED_MODULE_2___default().formGroup)} ${className || ""}`,
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                htmlFor: id,
                className: (_TextField_module_css__WEBPACK_IMPORTED_MODULE_2___default().label),
                children: label
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                id: id,
                type: type,
                value: value,
                onChange: onChange,
                placeholder: placeholder,
                min: min,
                max: max,
                step: step,
                required: required,
                disabled: disabled,
                className: (_TextField_module_css__WEBPACK_IMPORTED_MODULE_2___default().input)
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TextField);


/***/ }),

/***/ 8081:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "x": () => (/* binding */ formatCurrency)
/* harmony export */ });
const formatCurrency = (value)=>{
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(value);
};


/***/ })

};
;