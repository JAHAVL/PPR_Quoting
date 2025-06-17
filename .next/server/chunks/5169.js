exports.id = 5169;
exports.ids = [5169];
exports.modules = {

/***/ 7563:
/***/ ((module) => {

// Exports
module.exports = {
	"formGroup": "SelectField_formGroup__5t_Tu",
	"label": "SelectField_label__5IsfY",
	"required": "SelectField_required__FbVkY",
	"select": "SelectField_select__2GUUV"
};


/***/ }),

/***/ 4153:
/***/ ((module) => {

// Exports
module.exports = {
	"toggleSwitchContainer": "ToggleSwitch_toggleSwitchContainer__1hVUT",
	"label": "ToggleSwitch_label__hQS8T",
	"switchWrapper": "ToggleSwitch_switchWrapper__cfkG7",
	"checkbox": "ToggleSwitch_checkbox___pHyp",
	"slider": "ToggleSwitch_slider___tFAM"
};


/***/ }),

/***/ 8380:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _SelectField_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7563);
/* harmony import */ var _SelectField_module_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_SelectField_module_css__WEBPACK_IMPORTED_MODULE_2__);


 // Using dedicated select styles
const SelectField = ({ id , label , value , onChange , options , required =false , disabled =false , className ="" ,  })=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: `${(_SelectField_module_css__WEBPACK_IMPORTED_MODULE_2___default().formGroup)} ${className}`,
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", {
                htmlFor: id,
                className: (_SelectField_module_css__WEBPACK_IMPORTED_MODULE_2___default().label),
                children: [
                    label,
                    required && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: (_SelectField_module_css__WEBPACK_IMPORTED_MODULE_2___default().required),
                        children: "*"
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", {
                id: id,
                value: value,
                onChange: onChange,
                required: required,
                disabled: disabled,
                className: (_SelectField_module_css__WEBPACK_IMPORTED_MODULE_2___default().select),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("option", {
                        value: "",
                        children: "Select an option"
                    }),
                    options.map((option)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("option", {
                            value: option.value,
                            children: option.label
                        }, option.value))
                ]
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SelectField);


/***/ }),

/***/ 4694:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ToggleSwitch_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4153);
/* harmony import */ var _ToggleSwitch_module_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_ToggleSwitch_module_css__WEBPACK_IMPORTED_MODULE_2__);



const ToggleSwitch = ({ id , label , checked , onChange , disabled =false , className ="" ,  })=>{
    const handleChange = (event)=>{
        onChange(event.target.checked);
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: `${(_ToggleSwitch_module_css__WEBPACK_IMPORTED_MODULE_2___default().toggleSwitchContainer)} ${className}`,
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                htmlFor: id,
                className: (_ToggleSwitch_module_css__WEBPACK_IMPORTED_MODULE_2___default().label),
                children: label
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_ToggleSwitch_module_css__WEBPACK_IMPORTED_MODULE_2___default().switchWrapper),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                        type: "checkbox",
                        id: id,
                        checked: checked,
                        onChange: handleChange,
                        disabled: disabled,
                        className: (_ToggleSwitch_module_css__WEBPACK_IMPORTED_MODULE_2___default().checkbox)
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: (_ToggleSwitch_module_css__WEBPACK_IMPORTED_MODULE_2___default().slider)
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ToggleSwitch);


/***/ }),

/***/ 5212:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1250);
/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _icons_QuoteIcon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(528);
/* harmony import */ var _buttons_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4038);
/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8081);






/**
 * PriceSummary - A reusable component for displaying the final price summary
 * with enhanced visual styling
 */ const PriceSummary = ({ finalPrice , squareFootage , onViewFullQuote , showViewQuoteButton =true  })=>{
    const pricePerSqFt = squareFootage > 0 ? finalPrice / squareFootage : 0;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4___default().quoteTotalContainer),
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4___default().quoteTotal),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        children: "FINAL CUSTOMER PRICE:"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4___default().totalPrice),
                        children: (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_5__/* .formatCurrency */ .x)(finalPrice)
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4___default().pricePerSqFt),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        children: "Price per Square Foot:"
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                        children: [
                            (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_5__/* .formatCurrency */ .x)(pricePerSqFt),
                            "/sq ft"
                        ]
                    })
                ]
            }),
            showViewQuoteButton && onViewFullQuote && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_buttons_Button__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z, {
                onClick: onViewFullQuote,
                className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4___default().buttonMarginTop),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_icons_QuoteIcon__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z, {
                        size: "small"
                    }),
                    "VIEW FULL QUOTE"
                ]
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PriceSummary);


/***/ })

};
;