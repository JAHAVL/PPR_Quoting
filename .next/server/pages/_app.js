(() => {
var exports = {};
exports.id = 2888;
exports.ids = [2888];
exports.modules = {

/***/ 795:
/***/ ((module) => {

// Exports
module.exports = {
	"backgroundAnimation": "BackgroundAnimation_backgroundAnimation__9ChYi",
	"borderRotate": "BackgroundAnimation_borderRotate__J_710",
	"waveTopGlow": "BackgroundAnimation_waveTopGlow__hL_de",
	"waveRightGlow": "BackgroundAnimation_waveRightGlow__01aLv",
	"waveBottomGlow": "BackgroundAnimation_waveBottomGlow__skfyz",
	"waveLeftGlow": "BackgroundAnimation_waveLeftGlow__B0dRu"
};


/***/ }),

/***/ 74:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ _app)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: ./src/components/layout/BackgroundAnimation.module.css
var BackgroundAnimation_module = __webpack_require__(795);
var BackgroundAnimation_module_default = /*#__PURE__*/__webpack_require__.n(BackgroundAnimation_module);
;// CONCATENATED MODULE: ./src/components/layout/BackgroundAnimation.tsx



const BackgroundAnimation = ()=>{
    return /*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: (BackgroundAnimation_module_default()).backgroundAnimation
    });
};
/* harmony default export */ const layout_BackgroundAnimation = (BackgroundAnimation);

// EXTERNAL MODULE: ./src/contexts/QuotesContext.tsx
var QuotesContext = __webpack_require__(2367);
;// CONCATENATED MODULE: ./src/pages/_app.tsx




function MyApp({ Component , pageProps  }) {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(layout_BackgroundAnimation, {}),
            /*#__PURE__*/ jsx_runtime_.jsx(QuotesContext/* QuotesProvider */.Gf, {
                children: /*#__PURE__*/ jsx_runtime_.jsx(Component, {
                    ...pageProps
                })
            })
        ]
    });
}
/* harmony default export */ const _app = (MyApp);


/***/ }),

/***/ 6689:
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ 997:
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [3903,2367], () => (__webpack_exec__(74)));
module.exports = __webpack_exports__;

})();