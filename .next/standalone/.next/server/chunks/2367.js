"use strict";
exports.id = 2367;
exports.ids = [2367];
exports.modules = {

/***/ 2367:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Gf": () => (/* binding */ QuotesProvider),
/* harmony export */   "vR": () => (/* binding */ useQuotes)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3903);



// Create the context with default values
const QuotesContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({
    quotes: [],
    loading: false,
    error: null,
    fetchQuotes: async ()=>{},
    lastUpdated: 0
});
// Provider component
const QuotesProvider = ({ children  })=>{
    const { 0: quotes , 1: setQuotes  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const { 0: loading , 1: setLoading  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: error , 1: setError  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const { 0: lastUpdated , 1: setLastUpdated  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(Date.now());
    // Function to fetch quotes
    const fetchQuotes = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async ()=>{
        try {
            setLoading(true);
            setError(null);
            console.log("QuotesContext: Fetching quotes...");
            const data = await _lib_api__WEBPACK_IMPORTED_MODULE_2__/* .quotesAPI.getAll */ .Go.getAll();
            console.log("QuotesContext: Quotes fetched:", data);
            setQuotes(data || []);
            setLastUpdated(Date.now());
        } catch (err) {
            console.error("QuotesContext: Error fetching quotes:", err);
            setError("Failed to fetch quotes");
        } finally{
            setLoading(false);
        }
    }, []);
    // Fetch quotes on mount
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        fetchQuotes();
    }, [
        fetchQuotes
    ]);
    // Provide the context value
    const value = {
        quotes,
        loading,
        error,
        fetchQuotes,
        lastUpdated
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(QuotesContext.Provider, {
        value: value,
        children: children
    });
};
// Custom hook to use the quotes context
const useQuotes = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(QuotesContext);
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (QuotesContext)));


/***/ })

};
;