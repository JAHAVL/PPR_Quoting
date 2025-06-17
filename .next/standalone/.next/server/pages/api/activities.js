"use strict";
(() => {
var exports = {};
exports.id = 3720;
exports.ids = [3720];
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

/***/ 6910:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4095);

function handler(req, res) {
    try {
        const db = (0,_lib_db__WEBPACK_IMPORTED_MODULE_0__/* .getDb */ .zA)();
        switch(req.method){
            case "GET":
                // Default to getting all activities if no clientId is provided
                const activities = db.prepare(`
          SELECT * FROM activities 
          ORDER BY timestamp DESC
        `).all();
                return res.status(200).json(activities);
            case "POST":
                // Create a new activity
                const { clientId , userId , type , content , eventType , details  } = req.body;
                if (!clientId) {
                    return res.status(400).json({
                        error: "Client ID is required"
                    });
                }
                if (!type || ![
                    "system",
                    "user",
                    "other"
                ].includes(type)) {
                    return res.status(400).json({
                        error: "Valid type is required"
                    });
                }
                if (!content) {
                    return res.status(400).json({
                        error: "Content is required"
                    });
                }
                const id = (0,_lib_db__WEBPACK_IMPORTED_MODULE_0__/* .generateId */ .Ox)();
                const timestamp = new Date().toISOString();
                const insertActivity = db.prepare(`
          INSERT INTO activities (id, clientId, userId, type, content, timestamp, eventType, details)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
                insertActivity.run(id, clientId, userId || null, type, content, timestamp, eventType || null, details || null);
                const newActivity = db.prepare("SELECT * FROM activities WHERE id = ?").get(id);
                return res.status(201).json(newActivity);
            default:
                res.setHeader("Allow", [
                    "GET",
                    "POST"
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
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [4095], () => (__webpack_exec__(6910)));
module.exports = __webpack_exports__;

})();