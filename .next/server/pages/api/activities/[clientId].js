"use strict";
(() => {
var exports = {};
exports.id = 9991;
exports.ids = [9991];
exports.modules = {

/***/ 5890:
/***/ ((module) => {

module.exports = require("better-sqlite3");

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 3219:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4095);

function handler(req, res) {
    try {
        const db = (0,_lib_db__WEBPACK_IMPORTED_MODULE_0__/* .getDb */ .zA)();
        const { clientId  } = req.query;
        if (!clientId || typeof clientId !== "string") {
            return res.status(400).json({
                error: "Valid client ID is required"
            });
        }
        switch(req.method){
            case "GET":
                // Get all activities for a specific client, sorted by most recent first
                const activities = db.prepare(`
          SELECT * FROM activities 
          WHERE clientId = ? 
          ORDER BY timestamp DESC
        `).all(clientId);
                return res.status(200).json(activities);
            default:
                res.setHeader("Allow", [
                    "GET"
                ]);
                return res.status(405).json({
                    error: `Method ${req.method} Not Allowed`
                });
        }
    } catch (error) {
        console.error("API error:", error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [4095], () => (__webpack_exec__(3219)));
module.exports = __webpack_exports__;

})();