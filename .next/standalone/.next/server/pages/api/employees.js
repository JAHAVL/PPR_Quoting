"use strict";
(() => {
var exports = {};
exports.id = 7175;
exports.ids = [7175];
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

/***/ 1092:
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
                // Get all employees
                const employees = db.prepare("SELECT * FROM employees ORDER BY name").all();
                return res.status(200).json(employees);
            case "POST":
                // Create a new employee
                const { name , email , phone , position , clockHours , hireDate , status  } = req.body;
                if (!name) {
                    return res.status(400).json({
                        error: "Name is required"
                    });
                }
                const id = (0,_lib_db__WEBPACK_IMPORTED_MODULE_0__/* .generateId */ .Ox)();
                const employeeHireDate = hireDate || new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
                const insertEmployee = db.prepare(`
          INSERT INTO employees (id, name, email, phone, position, clockHours, hireDate, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
                insertEmployee.run(id, name, email || null, phone || null, position || null, clockHours || 0, employeeHireDate, status || "active");
                const newEmployee = db.prepare("SELECT * FROM employees WHERE id = ?").get(id);
                return res.status(201).json(newEmployee);
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
var __webpack_exports__ = __webpack_require__.X(0, [4095], () => (__webpack_exec__(1092)));
module.exports = __webpack_exports__;

})();