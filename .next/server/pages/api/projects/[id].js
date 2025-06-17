"use strict";
(() => {
var exports = {};
exports.id = 5728;
exports.ids = [5728];
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

/***/ 8035:
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
        if (typeof id !== "string") {
            return res.status(400).json({
                error: "Invalid project ID"
            });
        }
        switch(req.method){
            case "GET":
                // Get a single project with client information
                const project = db.prepare(`
          SELECT p.*, c.name as clientName 
          FROM projects p
          LEFT JOIN clients c ON p.clientId = c.id
          WHERE p.id = ?
        `).get(id);
                if (!project) {
                    return res.status(404).json({
                        error: "Project not found"
                    });
                }
                // Get assigned employees for this project
                const assignedEmployees = db.prepare(`
          SELECT e.id, e.name, e.position, pa.role, pa.hoursLogged
          FROM project_assignments pa
          JOIN employees e ON pa.employeeId = e.id
          WHERE pa.projectId = ?
        `).all(id);
                // Get quotes associated with this project
                const quotes = db.prepare(`
          SELECT id, title, date, total, status, type
          FROM quotes
          WHERE projectId = ?
        `).all(id);
                // Add the related data to the project
                project.employees = assignedEmployees;
                project.quotes = quotes;
                return res.status(200).json(project);
            case "PUT":
                // Update a project
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
                const updateProject = db.prepare(`
          UPDATE projects 
          SET clientId = ?, address = ?, startDate = ?, endDate = ?, 
              total = ?, status = ?, type = ?, squareFootage = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
                updateProject.run(clientId, address || null, startDate || null, endDate || null, total || 0, status || "pending", type || null, squareFootage || null, id);
                const updatedProject = db.prepare(`
          SELECT p.*, c.name as clientName 
          FROM projects p
          LEFT JOIN clients c ON p.clientId = c.id
          WHERE p.id = ?
        `).get(id);
                if (!updatedProject) {
                    return res.status(404).json({
                        error: "Project not found"
                    });
                }
                return res.status(200).json(updatedProject);
            case "DELETE":
                // Delete a project
                const checkProject = db.prepare("SELECT id FROM projects WHERE id = ?").get(id);
                if (!checkProject) {
                    return res.status(404).json({
                        error: "Project not found"
                    });
                }
                db.prepare("DELETE FROM projects WHERE id = ?").run(id);
                return res.status(200).json({
                    message: "Project deleted successfully"
                });
            default:
                res.setHeader("Allow", [
                    "GET",
                    "PUT",
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
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [4095], () => (__webpack_exec__(8035)));
module.exports = __webpack_exports__;

})();