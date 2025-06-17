"use strict";
(() => {
var exports = {};
exports.id = 4646;
exports.ids = [4646];
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

/***/ 706:
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
                // Get all projects with client information
                const projects = db.prepare(`
          SELECT p.*, c.name as clientName 
          FROM projects p
          LEFT JOIN clients c ON p.clientId = c.id
          ORDER BY p.startDate DESC
        `).all();
                return res.status(200).json(projects);
            case "POST":
                // Create a new project
                const { clientId , address , startDate , endDate , total , status , type , squareFootage  } = req.body;
                if (!clientId) {
                    return res.status(400).json({
                        error: "Client ID is required"
                    });
                }
                // Check if client exists
                const clientExists = db.prepare("SELECT id FROM clients WHERE id = ?").get(clientId);
                if (!clientExists) {
                    return res.status(400).json({
                        error: "Client not found"
                    });
                }
                const id = (0,_lib_db__WEBPACK_IMPORTED_MODULE_0__/* .generateId */ .Ox)();
                const insertProject = db.prepare(`
          INSERT INTO projects (id, clientId, address, startDate, endDate, total, status, type, squareFootage)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
                insertProject.run(id, clientId, address || null, startDate || new Date().toISOString().split("T")[0], endDate || null, total || 0, status || "pending", type || null, squareFootage || null);
                const newProject = db.prepare(`
          SELECT p.*, c.name as clientName 
          FROM projects p
          LEFT JOIN clients c ON p.clientId = c.id
          WHERE p.id = ?
        `).get(id);
                return res.status(201).json(newProject);
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
var __webpack_exports__ = __webpack_require__.X(0, [4095], () => (__webpack_exec__(706)));
module.exports = __webpack_exports__;

})();