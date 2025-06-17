exports.id = 8190;
exports.ids = [8190];
exports.modules = {

/***/ 3838:
/***/ ((module) => {

// Exports
module.exports = {
	"backButton": "BackButton_backButton__lrPw1"
};


/***/ }),

/***/ 3857:
/***/ ((module) => {

// Exports
module.exports = {
	"searchBarContainer": "SearchBar_searchBarContainer__JLhh5",
	"searchForm": "SearchBar_searchForm__ssP1v",
	"searchInput": "SearchBar_searchInput__fIzc3",
	"searchButton": "SearchBar_searchButton__m7VDl"
};


/***/ }),

/***/ 9447:
/***/ ((module) => {

// Exports
module.exports = {
	"pageContainer": "PageContainer_pageContainer__ntg2Q"
};


/***/ }),

/***/ 9251:
/***/ ((module) => {

// Exports
module.exports = {
	"header": "PageHeader_header__gojWM",
	"title": "PageHeader_title___y8_d",
	"logoContainer": "PageHeader_logoContainer__D4hn_",
	"logo": "PageHeader_logo__dMaFB",
	"subHeader": "PageHeader_subHeader__LT60k",
	"searchSection": "PageHeader_searchSection__efZqS",
	"backButton": "PageHeader_backButton__iTUwa",
	"backButtonContainer": "PageHeader_backButtonContainer__5cNxx"
};


/***/ }),

/***/ 734:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _PageContainer_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9447);
/* harmony import */ var _PageContainer_module_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_PageContainer_module_css__WEBPACK_IMPORTED_MODULE_2__);



const PageContainer = ({ children  })=>{
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: (_PageContainer_module_css__WEBPACK_IMPORTED_MODULE_2___default().pageContainer),
        children: children
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PageContainer);


/***/ }),

/***/ 6345:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ layout_PageHeader)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: ./src/components/layout/PageHeader.module.css
var PageHeader_module = __webpack_require__(9251);
var PageHeader_module_default = /*#__PURE__*/__webpack_require__.n(PageHeader_module);
// EXTERNAL MODULE: ./src/components/fields/SearchBar.module.css
var SearchBar_module = __webpack_require__(3857);
var SearchBar_module_default = /*#__PURE__*/__webpack_require__.n(SearchBar_module);
;// CONCATENATED MODULE: ./src/components/fields/SearchBar.tsx



const SearchBar = ({ placeholder ="Search..." , onSearch  })=>{
    const { 0: query , 1: setQuery  } = (0,external_react_.useState)("");
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        }
    };
    return /*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: (SearchBar_module_default()).searchBarContainer,
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("form", {
            onSubmit: handleSubmit,
            className: (SearchBar_module_default()).searchForm,
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx("input", {
                    type: "text",
                    className: (SearchBar_module_default()).searchInput,
                    placeholder: placeholder,
                    value: query,
                    onChange: (e)=>setQuery(e.target.value)
                }),
                /*#__PURE__*/ jsx_runtime_.jsx("button", {
                    type: "submit",
                    className: (SearchBar_module_default()).searchButton,
                    children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "16",
                        height: "16",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("circle", {
                                cx: "11",
                                cy: "11",
                                r: "8"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("line", {
                                x1: "21",
                                y1: "21",
                                x2: "16.65",
                                y2: "16.65"
                            })
                        ]
                    })
                })
            ]
        })
    });
};
/* harmony default export */ const fields_SearchBar = (SearchBar);

// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./src/components/buttons/BackButton.module.css
var BackButton_module = __webpack_require__(3838);
var BackButton_module_default = /*#__PURE__*/__webpack_require__.n(BackButton_module);
;// CONCATENATED MODULE: ./src/components/buttons/BackButton.tsx




const BackButton = ({ href  })=>{
    return /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
        href: href,
        passHref: true,
        legacyBehavior: true,
        children: /*#__PURE__*/ jsx_runtime_.jsx("a", {
            className: (BackButton_module_default()).backButton,
            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("line", {
                        x1: "19",
                        y1: "12",
                        x2: "5",
                        y2: "12"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("polyline", {
                        points: "12 19 5 12 12 5"
                    })
                ]
            })
        })
    });
};
/* harmony default export */ const buttons_BackButton = (BackButton);

;// CONCATENATED MODULE: ./src/components/layout/PageHeader.tsx






const PageHeader = ({ title ="PPR" , showSearch =true , children , showBackButton =false , backHref ="/admin-dashboard"  })=>{
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("header", {
                className: (PageHeader_module_default()).header,
                children: [
                    showBackButton && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: (PageHeader_module_default()).backButton,
                        children: /*#__PURE__*/ jsx_runtime_.jsx(buttons_BackButton, {
                            href: backHref
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: (PageHeader_module_default()).logoContainer,
                        children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                            href: "/",
                            children: /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                className: (PageHeader_module_default()).logoLink,
                                children: /*#__PURE__*/ jsx_runtime_.jsx("img", {
                                    src: "/images/Logo.png",
                                    alt: "PPR Logo",
                                    className: (PageHeader_module_default()).logo,
                                    title: title
                                })
                            })
                        })
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: (PageHeader_module_default()).subHeader,
                children: [
                    children,
                    showSearch && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: (PageHeader_module_default()).searchSection,
                        children: /*#__PURE__*/ jsx_runtime_.jsx(fields_SearchBar, {
                            placeholder: "Search quotes, clients, projects..."
                        })
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const layout_PageHeader = (PageHeader);


/***/ })

};
;