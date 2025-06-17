exports.id = 4108;
exports.ids = [4108];
exports.modules = {

/***/ 9672:
/***/ ((module) => {

// Exports
module.exports = {
	"actionButton": "ActionButton_actionButton__XXIzS",
	"actionButtons": "ActionButton_actionButtons__VdfjX",
	"actionButtonContainer": "ActionButton_actionButtonContainer__UKTnL",
	"callOptions": "ActionButton_callOptions__k86p9",
	"callOptionButton": "ActionButton_callOptionButton__C8c4u",
	"copyPopup": "ActionButton_copyPopup____4n_",
	"fadeIn": "ActionButton_fadeIn__UklIP",
	"phoneNumberDisplay": "ActionButton_phoneNumberDisplay__I43vV",
	"copyButton": "ActionButton_copyButton__cVu_r"
};


/***/ }),

/***/ 3151:
/***/ ((module) => {

// Exports
module.exports = {
	"clientsTable": "ClientsTable_clientsTable__whbj_",
	"centerAlign": "ClientsTable_centerAlign__vPrZQ",
	"rightAlign": "ClientsTable_rightAlign__z__kH",
	"statusBadge": "ClientsTable_statusBadge__67yIQ",
	"actionButtons": "ClientsTable_actionButtons___o8np",
	"actionButton": "ClientsTable_actionButton__eHIOH"
};


/***/ }),

/***/ 9025:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9672);
/* harmony import */ var _ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _services_activityService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9283);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_services_activityService__WEBPACK_IMPORTED_MODULE_2__]);
_services_activityService__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];




// Function to format phone number for WhatsApp (remove spaces, dashes, etc.)
const formatPhoneForWhatsApp = (phone)=>{
    // Remove all non-digit characters
    return phone.replace(/\D/g, "");
};
// Function to check if the device is mobile
const isMobileDevice = ()=>{
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
const CallButton = ({ phone , className ="" , clientId ,  })=>{
    const { 0: showOptions , 1: setShowOptions  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: showCopyPopup , 1: setShowCopyPopup  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: isCopied , 1: setIsCopied  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const longPressTimer = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const buttonRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    // Track if we're handling a long press
    const { 0: isLongPress , 1: setIsLongPress  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    // Handle click for normal press
    const handleCall = (e)=>{
        e.stopPropagation();
        // Only proceed if this wasn't a long press
        if (!isLongPress) {
            // On mobile, show options menu or directly use native dialer
            if (isMobileDevice()) {
                window.location.href = `tel:${phone}`;
            } else {
                // On desktop, toggle options menu
                setShowOptions(!showOptions);
            }
        }
        // Reset long press state
        setIsLongPress(false);
    };
    // Handle mouse down for long press
    const handleMouseDown = (e)=>{
        e.stopPropagation();
        longPressTimer.current = setTimeout(()=>{
            setIsLongPress(true);
            setShowCopyPopup(true);
        }, 500); // 500ms for long press
    };
    // Handle mouse up to clear timer
    const handleMouseUp = (e)=>{
        e.stopPropagation();
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };
    // Handle touch events for mobile
    const handleTouchStart = (e)=>{
        e.stopPropagation();
        longPressTimer.current = setTimeout(()=>{
            setIsLongPress(true);
            setShowCopyPopup(true);
        }, 500); // 500ms for long press
    };
    const handleTouchEnd = (e)=>{
        e.stopPropagation();
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };
    // Copy phone number to clipboard
    const copyToClipboard = ()=>{
        navigator.clipboard.writeText(phone).then(()=>{
            setIsCopied(true);
            setTimeout(()=>{
                setIsCopied(false);
                setShowCopyPopup(false);
            }, 1500);
        }).catch((err)=>{
            console.error("Failed to copy: ", err);
        });
    };
    // Close popup when clicking outside
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const handleClickOutside = (event)=>{
            if (buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowCopyPopup(false);
            }
        };
        if (showCopyPopup) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return ()=>{
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [
        showCopyPopup
    ]);
    const handleWhatsAppCall = (e)=>{
        e.stopPropagation();
        // Format phone number for WhatsApp URL (remove non-digit characters)
        const formattedPhone = phone.replace(/\D/g, "");
        window.open(`https://wa.me/${formattedPhone}`, "_blank");
        setShowOptions(false);
        // Log the call activity
        (0,_services_activityService__WEBPACK_IMPORTED_MODULE_2__/* .addCallActivity */ .Ot)(clientId, "WhatsApp", phone);
    };
    const handlePhoneCall = (e)=>{
        e.stopPropagation();
        window.location.href = `tel:${phone}`;
        setShowOptions(false);
        // Log the call activity
        (0,_services_activityService__WEBPACK_IMPORTED_MODULE_2__/* .addCallActivity */ .Ot)(clientId, "Phone", phone);
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3___default().actionButtonContainer),
        style: {
            position: "relative"
        },
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                ref: buttonRef,
                className: `${(_ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3___default().actionButton)} ${className}`,
                onClick: handleCall,
                onMouseDown: handleMouseDown,
                onMouseUp: handleMouseUp,
                onMouseLeave: handleMouseUp,
                onTouchStart: handleTouchStart,
                onTouchEnd: handleTouchEnd,
                "aria-label": "Call client",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 24 24",
                    fill: "currentColor",
                    width: "18",
                    height: "18",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                        d: "M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"
                    })
                })
            }),
            showCopyPopup && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3___default().copyPopup),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: (_ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3___default().phoneNumberDisplay),
                        children: phone
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                        onClick: copyToClipboard,
                        className: (_ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3___default().copyButton),
                        children: isCopied ? "Copied!" : "Copy"
                    })
                ]
            }),
            showOptions && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3___default().callOptions),
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                        className: (_ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3___default().callOptionButton),
                        onClick: handleWhatsAppCall,
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                viewBox: "0 0 24 24",
                                width: "18",
                                height: "18",
                                fill: "#25D366",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                                    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                                })
                            }),
                            "WhatsApp Call"
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                        onClick: handlePhoneCall,
                        className: (_ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3___default().callOptionButton),
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px",
                            backgroundColor: "transparent",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            color: "#fff",
                            width: "100%",
                            textAlign: "left"
                        },
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                viewBox: "0 0 24 24",
                                fill: "#1E73BE",
                                width: "18",
                                height: "18",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                                    d: "M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"
                                })
                            }),
                            "Phone Call"
                        ]
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CallButton);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2390:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9672);
/* harmony import */ var _ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _services_activityService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9283);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_services_activityService__WEBPACK_IMPORTED_MODULE_2__]);
_services_activityService__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];




const EmailButton = ({ email , className ="" , clientId ,  })=>{
    const { 0: showCopyPopup , 1: setShowCopyPopup  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: isCopied , 1: setIsCopied  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const longPressTimer = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const buttonRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    // Track if we're handling a long press
    const { 0: isLongPress , 1: setIsLongPress  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    // Handle click for normal press
    const handleEmailClick = (e)=>{
        e.stopPropagation();
        // Only proceed if this wasn't a long press
        if (!isLongPress) {
            window.location.href = `mailto:${email}`;
            // Log the email activity
            (0,_services_activityService__WEBPACK_IMPORTED_MODULE_2__/* .addEmailActivity */ .yW)(clientId, email);
        }
        // Reset long press state
        setIsLongPress(false);
    };
    // Handle mouse down for long press
    const handleMouseDown = (e)=>{
        e.stopPropagation();
        longPressTimer.current = setTimeout(()=>{
            setIsLongPress(true);
            setShowCopyPopup(true);
        }, 500); // 500ms for long press
    };
    // Handle mouse up to clear timer
    const handleMouseUp = (e)=>{
        e.stopPropagation();
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };
    // Handle touch events for mobile
    const handleTouchStart = (e)=>{
        e.stopPropagation();
        longPressTimer.current = setTimeout(()=>{
            setIsLongPress(true);
            setShowCopyPopup(true);
        }, 500); // 500ms for long press
    };
    const handleTouchEnd = (e)=>{
        e.stopPropagation();
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };
    // Copy email to clipboard
    const copyToClipboard = ()=>{
        navigator.clipboard.writeText(email).then(()=>{
            setIsCopied(true);
            setTimeout(()=>{
                setIsCopied(false);
                setShowCopyPopup(false);
            }, 1500);
        }).catch((err)=>{
            console.error("Failed to copy: ", err);
        });
    };
    // Close popup when clicking outside
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const handleClickOutside = (event)=>{
            if (buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowCopyPopup(false);
            }
        };
        if (showCopyPopup) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return ()=>{
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [
        showCopyPopup
    ]);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3___default().actionButtonContainer),
        style: {
            position: "relative"
        },
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                ref: buttonRef,
                className: `${(_ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3___default().actionButton)} ${className}`,
                onClick: handleEmailClick,
                onMouseDown: handleMouseDown,
                onMouseUp: handleMouseUp,
                onMouseLeave: handleMouseUp,
                onTouchStart: handleTouchStart,
                onTouchEnd: handleTouchEnd,
                "aria-label": "Send email",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 24 24",
                    fill: "currentColor",
                    width: "18",
                    height: "18",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                        d: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                    })
                })
            }),
            showCopyPopup && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3___default().copyPopup),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: (_ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3___default().phoneNumberDisplay),
                        children: email
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                        onClick: copyToClipboard,
                        className: (_ActionButton_module_css__WEBPACK_IMPORTED_MODULE_3___default().copyButton),
                        children: isCopied ? "Copied!" : "Copy"
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EmailButton);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6759:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const ClientIcon = ({ className =""  })=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
        className: className,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        width: "24",
        height: "24",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                d: "M0 0h24v24H0z",
                fill: "none"
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ClientIcon);


/***/ }),

/***/ 9283:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EU": () => (/* binding */ activityEventBus),
/* harmony export */   "Ot": () => (/* binding */ addCallActivity),
/* harmony export */   "yW": () => (/* binding */ addEmailActivity)
/* harmony export */ });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6555);
/* harmony import */ var _lib_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3903);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([uuid__WEBPACK_IMPORTED_MODULE_0__]);
uuid__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


// Event bus for activity messages
class ActivityEventBus {
    listeners = {};
    subscribe(clientId, callback) {
        if (!this.listeners[clientId]) {
            this.listeners[clientId] = [];
        }
        this.listeners[clientId].push(callback);
        // Return unsubscribe function
        return ()=>{
            this.listeners[clientId] = this.listeners[clientId].filter((cb)=>cb !== callback);
        };
    }
    publish(clientId, message) {
        // Save to backend first
        _lib_api__WEBPACK_IMPORTED_MODULE_1__/* .activitiesAPI.create */ .tW.create(message).then(()=>{
            // Then notify any listeners
            if (this.listeners[clientId]) {
                this.listeners[clientId].forEach((callback)=>callback(message));
            }
        }).catch((error)=>{
            console.error("Failed to save activity:", error);
        });
    }
}
const activityEventBus = new ActivityEventBus();
// Activity service functions
const addCallActivity = (clientId, callType, phoneNumber)=>{
    const message = {
        id: (0,uuid__WEBPACK_IMPORTED_MODULE_0__.v4)(),
        clientId,
        type: "system",
        content: "Client Call",
        timestamp: new Date().toISOString(),
        eventType: "call",
        details: `${callType} call initiated to ${phoneNumber}`
    };
    activityEventBus.publish(clientId, message);
};
const addEmailActivity = (clientId, emailAddress)=>{
    const message = {
        id: (0,uuid__WEBPACK_IMPORTED_MODULE_0__.v4)(),
        clientId,
        type: "system",
        content: "Email Sent",
        timestamp: new Date().toISOString(),
        eventType: "email",
        details: `Email initiated to ${emailAddress}`
    };
    activityEventBus.publish(clientId, message);
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;