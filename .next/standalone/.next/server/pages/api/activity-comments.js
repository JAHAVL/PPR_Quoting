"use strict";
(() => {
var exports = {};
exports.id = 1579;
exports.ids = [1579];
exports.modules = {

/***/ 6555:
/***/ ((module) => {

module.exports = import("uuid");;

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 7797:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6555);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([uuid__WEBPACK_IMPORTED_MODULE_0__]);
uuid__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



// Path to the activity comments database file
const activityCommentsDbPath = path__WEBPACK_IMPORTED_MODULE_2___default().join(process.cwd(), "data", "activityComments.json");
// Print the file path to verify it's correct
console.log("Activity comments DB path:", activityCommentsDbPath);
// Ensure the data directory exists
const dataDir = path__WEBPACK_IMPORTED_MODULE_2___default().join(process.cwd(), "data");
console.log("Data directory path:", dataDir);
try {
    // Create data directory if it doesn't exist
    if (!fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(dataDir)) {
        console.log("Data directory does not exist, creating...");
        fs__WEBPACK_IMPORTED_MODULE_1___default().mkdirSync(dataDir, {
            recursive: true
        });
        console.log("Data directory created successfully");
    } else {
        console.log("Data directory already exists");
    }
    // Create the activity comments file if it doesn't exist
    if (!fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(activityCommentsDbPath)) {
        console.log("Activity comments file does not exist, creating...");
        fs__WEBPACK_IMPORTED_MODULE_1___default().writeFileSync(activityCommentsDbPath, JSON.stringify([]));
        console.log("Activity comments file created successfully");
    } else {
        console.log("Activity comments file already exists");
        // Check if the file is readable
        const fileContent = fs__WEBPACK_IMPORTED_MODULE_1___default().readFileSync(activityCommentsDbPath, "utf-8");
        try {
            const parsedContent = JSON.parse(fileContent);
            console.log(`Activity comments file is readable and contains ${parsedContent.length} items`);
        } catch (parseError) {
            console.error("Activity comments file exists but contains invalid JSON:", parseError);
            // Reset the file with empty array if it contains invalid JSON
            fs__WEBPACK_IMPORTED_MODULE_1___default().writeFileSync(activityCommentsDbPath, JSON.stringify([]));
            console.log("Activity comments file reset with empty array due to invalid JSON");
        }
    }
} catch (err) {
    console.error("Error during file/directory setup:", err);
}
// Helper function to get all activity comments
const getActivityComments = ()=>{
    try {
        const fileContent = fs__WEBPACK_IMPORTED_MODULE_1___default().readFileSync(activityCommentsDbPath, "utf-8");
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading activity comments file:", error);
        return [];
    }
};
// Helper function to save activity comments
const saveActivityComments = (comments)=>{
    try {
        fs__WEBPACK_IMPORTED_MODULE_1___default().writeFileSync(activityCommentsDbPath, JSON.stringify(comments, null, 2));
    } catch (error) {
        console.error("Error writing to activity comments file:", error);
    }
};
function handler(req, res) {
    // Handle POST request to add a new comment
    if (req.method === "POST") {
        try {
            console.log("POST request received on /api/activity-comments:", req.body);
            const { activityId , content , userId ="system"  } = req.body;
            if (!activityId || !content) {
                console.error("Missing required fields:", {
                    activityId,
                    content
                });
                return res.status(400).json({
                    error: "Activity ID and content are required"
                });
            }
            const comments = getActivityComments();
            console.log(`Retrieved ${comments.length} existing comments from file`);
            // Create a new comment object
            const newComment = {
                id: (0,uuid__WEBPACK_IMPORTED_MODULE_0__.v4)(),
                activityId,
                content,
                userId,
                timestamp: new Date().toISOString()
            };
            console.log("Created new comment:", newComment);
            // Add the new comment to the array
            comments.push(newComment);
            // Save the updated comments
            console.log(`Saving updated comments array with ${comments.length} items`);
            saveActivityComments(comments);
            // Verify the comment was saved by reading the file again
            const verifyComments = getActivityComments();
            console.log(`After save: File has ${verifyComments.length} comments`);
            const savedComment = verifyComments.find((c)=>c.id === newComment.id);
            console.log("Was comment saved successfully:", !!savedComment);
            // Return the new comment
            return res.status(201).json(newComment);
        } catch (error) {
            console.error("Error creating activity comment:", error);
            return res.status(500).json({
                error: "Failed to create activity comment"
            });
        }
    } else if (req.method === "GET") {
        try {
            const comments1 = getActivityComments();
            return res.status(200).json(comments1);
        } catch (error1) {
            console.error("Error retrieving activity comments:", error1);
            return res.status(500).json({
                error: "Failed to retrieve activity comments"
            });
        }
    } else {
        res.setHeader("Allow", [
            "GET",
            "POST"
        ]);
        return res.status(405).json({
            error: `Method ${req.method} Not Allowed`
        });
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(7797));
module.exports = __webpack_exports__;

})();