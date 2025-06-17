exports.id = 7609;
exports.ids = [7609];
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

/***/ 831:
/***/ ((module) => {

// Exports
module.exports = {
	"tableContainer": "DataTable_tableContainer__G9n3a",
	"tableWrapper": "DataTable_tableWrapper__G_oJk",
	"table": "DataTable_table__Gt_63",
	"tableHeader": "DataTable_tableHeader__BvfuQ",
	"headerContent": "DataTable_headerContent__UYWqg",
	"sortable": "DataTable_sortable__OW9dJ",
	"sortAsc": "DataTable_sortAsc__ECBFf",
	"sortDesc": "DataTable_sortDesc__N9hQF",
	"clickableRow": "DataTable_clickableRow__CHypJ",
	"emptyMessage": "DataTable_emptyMessage__GLjh4",
	"loading": "DataTable_loading__gcydQ",
	"pagination": "DataTable_pagination__lUPNv",
	"pageButton": "DataTable_pageButton__3lzCp",
	"activePage": "DataTable_activePage__VDLBU",
	"statusPending": "DataTable_statusPending__59nQr",
	"statusApproved": "DataTable_statusApproved__CfJek",
	"statusRejected": "DataTable_statusRejected__UCaJI",
	"statusCompleted": "DataTable_statusCompleted__hTXzh"
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

/***/ 2519:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony export DataTable */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _DataTable_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(831);
/* harmony import */ var _DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2__);



function DataTable({ columns , data , keyField , emptyMessage ="No data available" , onRowClick , className ="" , isLoading =false , sortable =true , pagination =true , itemsPerPage =10  }) {
    const { 0: sortField , 1: setSortField  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const { 0: sortDirection , 1: setSortDirection  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("asc");
    const { 0: currentPage , 1: setCurrentPage  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
    // Handle sorting
    const handleSort = (field)=>{
        if (!sortable) return;
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };
    // Sort data
    const sortedData = react__WEBPACK_IMPORTED_MODULE_1___default().useMemo(()=>{
        if (!sortField) return data;
        return [
            ...data
        ].sort((a, b)=>{
            const aValue = a[sortField];
            const bValue = b[sortField];
            if (aValue === bValue) return 0;
            // Handle different data types
            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            if (aValue === null || aValue === undefined) return sortDirection === "asc" ? -1 : 1;
            if (bValue === null || bValue === undefined) return sortDirection === "asc" ? 1 : -1;
            return sortDirection === "asc" ? aValue < bValue ? -1 : 1 : aValue < bValue ? 1 : -1;
        });
    }, [
        data,
        sortField,
        sortDirection
    ]);
    // Pagination
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = pagination ? sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : sortedData;
    // Render cell content
    const renderCell = (item, column)=>{
        if (typeof column.accessor === "function") {
            return column.accessor(item);
        }
        return item[column.accessor];
    };
    // Handle page change
    const handlePageChange = (page)=>{
        setCurrentPage(page);
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: `${(_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default().tableContainer)} ${className}`,
        children: isLoading ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            className: (_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default().loading),
            children: "Loading..."
        }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: (_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default().tableWrapper),
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("table", {
                        className: (_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default().table),
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("thead", {
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("tr", {
                                    children: columns.map((column, index)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("th", {
                                            className: `${(_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default().tableHeader)} ${column.className || ""} ${sortable ? (_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default().sortable) : ""}`,
                                            onClick: ()=>typeof column.accessor === "string" && handleSort(column.accessor),
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                className: (_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default().headerContent),
                                                children: [
                                                    column.header,
                                                    sortable && typeof column.accessor === "string" && sortField === column.accessor && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                        className: sortDirection === "asc" ? (_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default().sortAsc) : (_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default().sortDesc),
                                                        children: sortDirection === "asc" ? "▲" : "▼"
                                                    })
                                                ]
                                            })
                                        }, index))
                                })
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("tbody", {
                                children: paginatedData.length > 0 ? paginatedData.map((item)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("tr", {
                                        onClick: ()=>onRowClick && onRowClick(item),
                                        className: onRowClick ? (_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default().clickableRow) : "",
                                        children: columns.map((column, cellIndex)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("td", {
                                                className: column.className || "",
                                                children: renderCell(item, column)
                                            }, cellIndex))
                                    }, String(item[keyField]))) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("tr", {
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("td", {
                                        colSpan: columns.length,
                                        className: (_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default().emptyMessage),
                                        children: emptyMessage
                                    })
                                })
                            })
                        ]
                    })
                }),
                pagination && totalPages > 1 && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: (_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default().pagination),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                            className: (_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default().pageButton),
                            disabled: currentPage === 1,
                            onClick: ()=>handlePageChange(currentPage - 1),
                            children: "<"
                        }),
                        Array.from({
                            length: totalPages
                        }, (_, i)=>i + 1).map((page)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                className: `${(_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default().pageButton)} ${currentPage === page ? (_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default().activePage) : ""}`,
                                onClick: ()=>handlePageChange(page),
                                children: page
                            }, page)),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                            className: (_DataTable_module_css__WEBPACK_IMPORTED_MODULE_2___default().pageButton),
                            disabled: currentPage === totalPages,
                            onClick: ()=>handlePageChange(currentPage + 1),
                            children: ">"
                        })
                    ]
                })
            ]
        })
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DataTable);


/***/ })

};
;