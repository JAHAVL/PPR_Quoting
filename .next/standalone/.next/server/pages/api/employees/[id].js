"use strict";
(() => {
var exports = {};
exports.id = 7240;
exports.ids = [7240];
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

/***/ 4254:
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
                error: "Invalid employee ID"
            });
        }
        switch(req.method){
            case "GET":
                // Get a single employee
                const employee = db.prepare("SELECT * FROM employees WHERE id = ?").get(id);
                if (!employee) {
                    return res.status(404).json({
                        error: "Employee not found"
                    });
                }
                // Get project assignments for this employee
                const projectAssignments = db.prepare(`
          SELECT pa.*, p.address, p.status as projectStatus
          FROM project_assignments pa
          JOIN projects p ON pa.projectId = p.id
          WHERE pa.employeeId = ?
        `).all(id);
                // Add the project assignments to the employee
                employee.projectAssignments = projectAssignments;
                return res.status(200).json(employee);
            case "PUT":
                // Update an employee
                const { name , email , phone , position , clockHours , hireDate , status  } = req.body;
                if (!name) {
                    return res.status(400).json({
                        error: "Name is required"
                    });
                }
                const updateEmployee = db.prepare(`
          UPDATE employees 
          SET name = ?, email = ?, phone = ?, position = ?, 
              clockHours = ?, hireDate = ?, status = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
                updateEmployee.run(name, email || null, phone || null, position || null, clockHours || 0, hireDate || null, status || "active", id);
                const updatedEmployee = db.prepare("SELECT * FROM employees WHERE id = ?").get(id);
                if (!updatedEmployee) {
                    return res.status(404).json({
                        error: "Employee not found"
                    });
                }
                return res.status(200).json(updatedEmployee);
            case "DELETE":
                // Delete an employee
                const checkEmployee = db.prepare("SELECT id FROM employees WHERE id = ?").get(id);
                if (!checkEmployee) {
                    return res.status(404).json({
                        error: "Employee not found"
                    });
                }
                db.prepare("DELETE FROM employees WHERE id = ?").run(id);
                return res.status(200).json({
                    message: "Employee deleted successfully"
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
var __webpack_exports__ = __webpack_require__.X(0, [4095], () => (__webpack_exec__(4254)));
module.exports = __webpack_exports__;

})();