"use strict";
(() => {
var exports = {};
exports.id = 9802;
exports.ids = [9802];
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

/***/ 9648:
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
                error: "Invalid client ID"
            });
        }
        switch(req.method){
            case "GET":
                // Get a single client
                const client = db.prepare("SELECT * FROM clients WHERE id = ?").get(id);
                if (!client) {
                    return res.status(404).json({
                        error: "Client not found"
                    });
                }
                return res.status(200).json(client);
            case "PUT":
                // Update a client
                const { name , email , phone , address , status  } = req.body;
                if (!name) {
                    return res.status(400).json({
                        error: "Name is required"
                    });
                }
                const updateClient = db.prepare(`
          UPDATE clients 
          SET name = ?, email = ?, phone = ?, address = ?, status = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
                updateClient.run(name, email || null, phone || null, address || null, status || "prospect", id);
                const updatedClient = db.prepare("SELECT * FROM clients WHERE id = ?").get(id);
                if (!updatedClient) {
                    return res.status(404).json({
                        error: "Client not found"
                    });
                }
                return res.status(200).json(updatedClient);
            case "DELETE":
                // Delete a client
                const checkClient = db.prepare("SELECT id FROM clients WHERE id = ?").get(id);
                if (!checkClient) {
                    return res.status(404).json({
                        error: "Client not found"
                    });
                }
                db.prepare("DELETE FROM clients WHERE id = ?").run(id);
                return res.status(200).json({
                    message: "Client deleted successfully"
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
var __webpack_exports__ = __webpack_require__.X(0, [4095], () => (__webpack_exec__(9648)));
module.exports = __webpack_exports__;

})();