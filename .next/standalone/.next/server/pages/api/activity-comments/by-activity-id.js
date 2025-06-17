"use strict";
(() => {
var exports = {};
exports.id = 9732;
exports.ids = [9732];
exports.modules = {

/***/ 7147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 9129:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);


// Path to the activity comments database file
const activityCommentsDbPath = path__WEBPACK_IMPORTED_MODULE_1___default().join(process.cwd(), "data", "activityComments.json");
// Ensure the data directory exists
const dataDir = path__WEBPACK_IMPORTED_MODULE_1___default().join(process.cwd(), "data");
if (!fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(dataDir)) {
    fs__WEBPACK_IMPORTED_MODULE_0___default().mkdirSync(dataDir, {
        recursive: true
    });
}
// Create the activity comments file if it doesn't exist
if (!fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(activityCommentsDbPath)) {
    fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(activityCommentsDbPath, JSON.stringify([]));
}
// Helper function to get all activity comments
const getActivityComments = ()=>{
    try {
        const fileContent = fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(activityCommentsDbPath, "utf-8");
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading activity comments file:", error);
        return [];
    }
};
// Helper function to save activity comments
const saveActivityComments = (comments)=>{
    try {
        fs.writeFileSync(activityCommentsDbPath, JSON.stringify(comments, null, 2));
    } catch (error) {
        console.error("Error writing to activity comments file:", error);
    }
};
function handler(req, res) {
    const { activityId  } = req.query;
    if (typeof activityId !== "string") {
        return res.status(400).json({
            error: "Invalid activity ID"
        });
    }
    // Handle GET request to retrieve comments for a specific activity
    if (req.method === "GET") {
        try {
            console.log(`GET request for activityId: ${activityId} (type: ${typeof activityId})`);
            const allComments = getActivityComments();
            console.log(`Retrieved ${allComments.length} total comments from database`);
            // Log some sample activity IDs to check format match
            if (allComments.length > 0) {
                console.log("Sample activity IDs in database:", allComments.slice(0, 3).map((c)=>({
                        id: c.id,
                        activityId: c.activityId,
                        idType: typeof c.activityId
                    })));
            }
            const activityComments = allComments.filter((comment)=>{
                const match = comment.activityId === activityId;
                if (match) console.log(`Found matching comment: ${comment.id} for activity ${activityId}`);
                return match;
            });
            console.log(`Found ${activityComments.length} comments for activity ID: ${activityId}`);
            return res.status(200).json(activityComments);
        } catch (error) {
            console.error("Error retrieving activity comments:", error);
            return res.status(500).json({
                error: "Failed to retrieve activity comments"
            });
        }
    } else {
        res.setHeader("Allow", [
            "GET"
        ]);
        return res.status(405).json({
            error: `Method ${req.method} Not Allowed`
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
var __webpack_exports__ = (__webpack_exec__(9129));
module.exports = __webpack_exports__;

})();