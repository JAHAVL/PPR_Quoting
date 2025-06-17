"use strict";
(() => {
var exports = {};
exports.id = 338;
exports.ids = [338];
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

/***/ 1603:
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
                // Get all clients
                const clients = db.prepare("SELECT * FROM clients ORDER BY name").all();
                return res.status(200).json(clients);
            case "POST":
                // Create a new client
                const { name , email , phone , address , status  } = req.body;
                if (!name) {
                    return res.status(400).json({
                        error: "Name is required"
                    });
                }
                const id = (0,_lib_db__WEBPACK_IMPORTED_MODULE_0__/* .generateId */ .Ox)();
                const joinDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
                const insertClient = db.prepare(`
          INSERT INTO clients (id, name, email, phone, address, joinDate, status)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
                insertClient.run(id, name, email || null, phone || null, address || null, joinDate, status || "prospect");
                const newClient = db.prepare("SELECT * FROM clients WHERE id = ?").get(id);
                return res.status(201).json(newClient);
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
var __webpack_exports__ = __webpack_require__.X(0, [4095], () => (__webpack_exec__(1603)));
module.exports = __webpack_exports__;

})();