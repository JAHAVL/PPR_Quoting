exports.id = 3060;
exports.ids = [3060];
exports.modules = {

/***/ 2243:
/***/ ((module) => {

// Exports
module.exports = {
	"modalOverlay": "Modal_modalOverlay__ydbcy",
	"fadeIn": "Modal_fadeIn__5UE9U",
	"modalContainer": "Modal_modalContainer__l_SPa",
	"slideIn": "Modal_slideIn__vqqnD",
	"small": "Modal_small__PvTRg",
	"medium": "Modal_medium__QaCzZ",
	"large": "Modal_large__uEHZt",
	"modalHeader": "Modal_modalHeader__Bu8is",
	"modalTitle": "Modal_modalTitle__G5VDf",
	"closeButton": "Modal_closeButton__e9znE",
	"modalContent": "Modal_modalContent__xzOCj",
	"modalFooter": "Modal_modalFooter___AoH1"
};


/***/ }),

/***/ 3400:
/***/ ((module) => {

// Exports
module.exports = {
	"form": "FormModals_form__yWUwu",
	"formGroup": "FormModals_formGroup__Ol63z",
	"label": "FormModals_label__camRF",
	"required": "FormModals_required__qDUIR",
	"input": "FormModals_input__mWgyN",
	"select": "FormModals_select__5TqsA",
	"textarea": "FormModals_textarea__WJFKq",
	"errorMessage": "FormModals_errorMessage___VTMc",
	"submitButton": "FormModals_submitButton___OiP2",
	"cancelButton": "FormModals_cancelButton__XtOwO"
};


/***/ }),

/***/ 3989:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Modal_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2243);
/* harmony import */ var _Modal_module_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Modal_module_css__WEBPACK_IMPORTED_MODULE_2__);



const Modal = ({ isOpen , onClose , title , children , size ="medium" , footer  })=>{
    const modalRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    // Close modal when clicking outside
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const handleClickOutside = (event)=>{
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            // Prevent scrolling when modal is open
            document.body.style.overflow = "hidden";
        }
        return ()=>{
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "auto";
        };
    }, [
        isOpen,
        onClose
    ]);
    // Close modal with ESC key
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const handleEscKey = (event)=>{
            if (event.key === "Escape") {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscKey);
        }
        return ()=>{
            document.removeEventListener("keydown", handleEscKey);
        };
    }, [
        isOpen,
        onClose
    ]);
    if (!isOpen) return null;
    // Define inline styles to ensure they override any cached CSS
    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)"
    };
    const containerStyle = {
        backgroundColor: "rgba(18, 24, 38, 0.7)",
        backgroundImage: "linear-gradient(to bottom right, rgba(30, 115, 190, 0.15), rgba(18, 24, 38, 0.7))",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-lg)",
        border: "1px solid rgba(30, 115, 190, 0.3)",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        width: size === "small" ? "320px" : size === "medium" ? "450px" : "650px",
        maxWidth: "90vw",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)"
    };
    const headerStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: "1px solid rgba(30, 115, 190, 0.3)",
        background: "linear-gradient(to right, rgba(30, 115, 190, 0.2), transparent)"
    };
    const titleStyle = {
        margin: 0,
        fontSize: "var(--font-lg)",
        fontWeight: 600,
        color: "white",
        fontFamily: "var(--font-primary)"
    };
    const closeButtonStyle = {
        background: "none",
        border: "none",
        fontSize: "1.5rem",
        cursor: "pointer",
        color: "rgba(255, 255, 255, 0.7)",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        transition: "all 0.2s ease"
    };
    const contentStyle = {
        padding: "20px",
        overflowY: "auto",
        flex: 1,
        color: "rgba(255, 255, 255, 0.9)"
    };
    const footerStyle = {
        padding: "16px 20px",
        borderTop: "1px solid rgba(30, 115, 190, 0.3)",
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        background: "linear-gradient(to right, transparent, rgba(30, 115, 190, 0.2))"
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: (_Modal_module_css__WEBPACK_IMPORTED_MODULE_2___default().modalOverlay),
        style: overlayStyle,
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: `${(_Modal_module_css__WEBPACK_IMPORTED_MODULE_2___default().modalContainer)} ${(_Modal_module_css__WEBPACK_IMPORTED_MODULE_2___default())[size]}`,
            style: containerStyle,
            ref: modalRef,
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "modal-title",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: (_Modal_module_css__WEBPACK_IMPORTED_MODULE_2___default().modalHeader),
                    style: headerStyle,
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h2", {
                            id: "modal-title",
                            className: (_Modal_module_css__WEBPACK_IMPORTED_MODULE_2___default().modalTitle),
                            style: titleStyle,
                            children: title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                            className: (_Modal_module_css__WEBPACK_IMPORTED_MODULE_2___default().closeButton),
                            style: closeButtonStyle,
                            onClick: onClose,
                            "aria-label": "Close modal",
                            children: "\xd7"
                        })
                    ]
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: (_Modal_module_css__WEBPACK_IMPORTED_MODULE_2___default().modalContent),
                    style: contentStyle,
                    children: children
                }),
                footer && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: (_Modal_module_css__WEBPACK_IMPORTED_MODULE_2___default().modalFooter),
                    style: footerStyle,
                    children: footer
                })
            ]
        })
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Modal);


/***/ })

};
;