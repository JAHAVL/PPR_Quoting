"use strict";
(() => {
var exports = {};
exports.id = 3320;
exports.ids = [3320];
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

/***/ 655:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4095);

function handler(req, res) {
    try {
        const db = (0,_lib_db__WEBPACK_IMPORTED_MODULE_0__/* .getDb */ .zA)();
        const { id  } = req.query;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                error: "Valid activity ID is required"
            });
        }
        // Check if the activity exists
        const activity = db.prepare("SELECT * FROM activities WHERE id = ?").get(id);
        if (!activity) {
            return res.status(404).json({
                error: "Activity not found"
            });
        }
        switch(req.method){
            case "GET":
                // Return the activity details
                return res.status(200).json(activity);
            case "DELETE":
                // Delete the activity
                db.prepare("DELETE FROM activities WHERE id = ?").run(id);
                return res.status(200).json({
                    message: "Activity deleted successfully"
                });
            default:
                res.setHeader("Allow", [
                    "GET",
                    "DELETE"
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
var __webpack_require__ = require("../../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [4095], () => (__webpack_exec__(655)));
module.exports = __webpack_exports__;

})();