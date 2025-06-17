exports.id = 677;
exports.ids = [677];
exports.modules = {

/***/ 993:
/***/ ((module) => {

// Exports
module.exports = {
	"tag": "Tag_tag__5LV1t",
	"install": "Tag_install__jOf2D",
	"clean": "Tag_clean__nzR0m",
	"seal": "Tag_seal__GpnPm",
	"repair": "Tag_repair__Y_yAr",
	"approved": "Tag_approved__qSupX",
	"pending": "Tag_pending__v59b8",
	"completed": "Tag_completed__aYC5U",
	"rejected": "Tag_rejected__grynf",
	"default": "Tag_default__rWEz5"
};


/***/ }),

/***/ 9130:
/***/ ((module) => {

// Exports
module.exports = {
	"main": "DetailPage_main__IA27p",
	"pageHeader": "DetailPage_pageHeader__RKB3a",
	"detailContainer": "DetailPage_detailContainer__NZxZz",
	"tableContainer": "DetailPage_tableContainer__TT_9m",
	"section": "DetailPage_section__9U5UC",
	"titleContainer": "DetailPage_titleContainer__FgUkl",
	"titleActions": "DetailPage_titleActions__3pXwy",
	"actionButton": "DetailPage_actionButton__UanH9",
	"pageIcon": "DetailPage_pageIcon__htFsx",
	"pageTitle": "DetailPage_pageTitle__kFQmM",
	"header": "DetailPage_header__fH9Oj",
	"detailsHeader": "DetailPage_detailsHeader__7iX2e",
	"headerLeft": "DetailPage_headerLeft__51xRV",
	"clientDetails": "DetailPage_clientDetails__3tA9i",
	"lifetimeValue": "DetailPage_lifetimeValue__LJQ2S",
	"valueAmount": "DetailPage_valueAmount__p_ryn",
	"headerRight": "DetailPage_headerRight__F8Ss3",
	"title": "DetailPage_title__8R2pE",
	"tags": "DetailPage_tags__nk0pG",
	"totalAmount": "DetailPage_totalAmount__ogLrk",
	"editButton": "DetailPage_editButton__d_DtL",
	"infoGrid": "DetailPage_infoGrid__pcygk",
	"infoCard": "DetailPage_infoCard__PE23i",
	"viewButton": "DetailPage_viewButton__7aiWD",
	"sectionContainer": "DetailPage_sectionContainer__LvOnw",
	"descriptionBox": "DetailPage_descriptionBox__T_fj6",
	"lineItemsTable": "DetailPage_lineItemsTable__uGLTc",
	"totalLabel": "DetailPage_totalLabel__I9Ekc",
	"totalValue": "DetailPage_totalValue__8FUE5",
	"footer": "DetailPage_footer__BuDoH",
	"backButton": "DetailPage_backButton__LBUZr",
	"metaInfo": "DetailPage_metaInfo___qyCN",
	"loadingContainer": "DetailPage_loadingContainer__vhCSm",
	"loadingSpinner": "DetailPage_loadingSpinner___c6TB",
	"spin": "DetailPage_spin__qinUm",
	"errorContainer": "DetailPage_errorContainer__MKWkh",
	"notFoundContainer": "DetailPage_notFoundContainer__cMgbl",
	"retryButton": "DetailPage_retryButton__WRQ3M",
	"emptyState": "DetailPage_emptyState__UgkNc",
	"activityContainer": "DetailPage_activityContainer__5hHzD",
	"chatMessages": "DetailPage_chatMessages__b5V_J",
	"activityItem": "DetailPage_activityItem__o1JbF",
	"fadeIn": "DetailPage_fadeIn__7sFOq",
	"systemMessage": "DetailPage_systemMessage__HECvN",
	"userMessage": "DetailPage_userMessage__x6wiE",
	"activityIcon": "DetailPage_activityIcon__90Hj1",
	"activityContent": "DetailPage_activityContent__FJ3YH",
	"activityTitle": "DetailPage_activityTitle__McBJu",
	"activityDate": "DetailPage_activityDate__VINa6",
	"chatInputContainer": "DetailPage_chatInputContainer__q9ux_",
	"chatInput": "DetailPage_chatInput__jMYKS",
	"sendButton": "DetailPage_sendButton__qZ3ZN"
};


/***/ }),

/***/ 7257:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony export Tag */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Tag_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(993);
/* harmony import */ var _Tag_module_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Tag_module_css__WEBPACK_IMPORTED_MODULE_2__);



const Tag = ({ type , label , className =""  })=>{
    // Capitalize first letter of the label
    const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
        className: `${(_Tag_module_css__WEBPACK_IMPORTED_MODULE_2___default().tag)} ${(_Tag_module_css__WEBPACK_IMPORTED_MODULE_2___default())[type]} ${className}`,
        children: capitalizedLabel
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tag);


/***/ }),

/***/ 6794:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "p": () => (/* binding */ formatDate),
/* harmony export */   "x": () => (/* binding */ formatCurrency)
/* harmony export */ });
/**
 * Utility functions for formatting data
 */ /**
 * Format a number as currency (USD)
 */ const formatCurrency = (amount)=>{
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format(amount);
};
/**
 * Format a date string to a readable format
 */ const formatDate = (dateString)=>{
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
};


/***/ })

};
;