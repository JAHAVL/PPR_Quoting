"use strict";
exports.id = 7052;
exports.ids = [7052];
exports.modules = {

/***/ 7052:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _common_Modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3989);
/* harmony import */ var _FormModals_module_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3400);
/* harmony import */ var _FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _lib_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3903);





const AddClientModal = ({ isOpen , onClose , onClientAdded  })=>{
    const { 0: formData , 1: setFormData  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        status: "prospect"
    });
    const { 0: isSubmitting , 1: setIsSubmitting  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: error , 1: setError  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const handleChange = (e)=>{
        const { name , value  } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            // Validate form
            if (!formData.name.trim()) {
                throw new Error("Client name is required");
            }
            // Address formatting is handled above
            // Format address for Google Maps compatibility
            const formattedAddress = [
                formData.street,
                formData.city,
                formData.state,
                formData.zipCode
            ].filter(Boolean).join(", ");
            // Submit to API with formatted address
            await (0,_lib_api__WEBPACK_IMPORTED_MODULE_3__/* .createClient */ .eI)({
                ...formData,
                address: formattedAddress
            });
            // Reset form and close modal
            setFormData({
                name: "",
                email: "",
                phone: "",
                street: "",
                city: "",
                state: "",
                zipCode: "",
                status: "prospect"
            });
            onClientAdded();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add client");
        } finally{
            setIsSubmitting(false);
        }
    };
    // Define inline styles for buttons
    const cancelButtonStyle = {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        color: "rgba(255, 255, 255, 0.7)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "var(--radius-sm)",
        padding: "10px 20px",
        fontSize: "var(--font-md)",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "var(--font-primary)",
        minHeight: "44px"
    };
    const submitButtonStyle = {
        backgroundColor: "var(--ppr-primary)",
        color: "white",
        border: "none",
        borderRadius: "var(--radius-sm)",
        padding: "10px 20px",
        fontSize: "var(--font-md)",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "var(--font-primary)",
        minHeight: "44px"
    };
    const modalFooter = /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                type: "button",
                className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().cancelButton),
                style: cancelButtonStyle,
                onClick: onClose,
                disabled: isSubmitting,
                children: "Cancel"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                type: "submit",
                className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().submitButton),
                style: submitButtonStyle,
                onClick: handleSubmit,
                disabled: isSubmitting,
                children: isSubmitting ? "Adding..." : "Add Client"
            })
        ]
    });
    // Define form styles
    const formStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    };
    const formGroupStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    };
    const labelStyle = {
        fontSize: "var(--font-sm)",
        fontWeight: 500,
        color: "rgba(255, 255, 255, 0.9)",
        fontFamily: "var(--font-primary)"
    };
    const inputStyle = {
        padding: "10px 12px",
        border: "1px solid rgba(30, 115, 190, 0.4)",
        borderRadius: "var(--radius-sm)",
        fontSize: "var(--font-md)",
        transition: "all 0.2s ease",
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        color: "white",
        fontFamily: "var(--font-primary)"
    };
    const errorMessageStyle = {
        backgroundColor: "rgba(255, 107, 0, 0.2)",
        color: "rgba(255, 180, 120, 1)",
        padding: "10px",
        borderRadius: "var(--radius-sm)",
        fontSize: "var(--font-sm)",
        marginBottom: "12px",
        borderLeft: "3px solid var(--ppr-accent)"
    };
    const requiredStyle = {
        color: "var(--ppr-accent)",
        marginLeft: "2px"
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_common_Modal__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z, {
        isOpen: isOpen,
        onClose: onClose,
        title: "Add New Client",
        footer: modalFooter,
        size: "medium",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", {
            className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().form),
            style: formStyle,
            onSubmit: handleSubmit,
            children: [
                error && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().errorMessage),
                    style: errorMessageStyle,
                    children: error
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().formGroup),
                    style: formGroupStyle,
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", {
                            htmlFor: "name",
                            className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().label),
                            style: labelStyle,
                            children: [
                                "Client Name ",
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                    className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().required),
                                    style: requiredStyle,
                                    children: "*"
                                })
                            ]
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            id: "name",
                            name: "name",
                            type: "text",
                            value: formData.name,
                            onChange: handleChange,
                            className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().input),
                            style: inputStyle,
                            placeholder: "Enter client name",
                            required: true
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().formGroup),
                    style: formGroupStyle,
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                            htmlFor: "email",
                            className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().label),
                            style: labelStyle,
                            children: "Email"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            id: "email",
                            name: "email",
                            type: "email",
                            value: formData.email,
                            onChange: handleChange,
                            className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().input),
                            style: inputStyle,
                            placeholder: "Enter email address"
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().formGroup),
                    style: formGroupStyle,
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                            htmlFor: "phone",
                            className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().label),
                            style: labelStyle,
                            children: "Phone"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            id: "phone",
                            name: "phone",
                            type: "tel",
                            value: formData.phone,
                            onChange: handleChange,
                            className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().input),
                            style: inputStyle,
                            placeholder: "Enter phone number"
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().formGroup),
                    style: formGroupStyle,
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                            htmlFor: "street",
                            className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().label),
                            style: labelStyle,
                            children: "Street Address"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            id: "street",
                            name: "street",
                            type: "text",
                            value: formData.street,
                            onChange: handleChange,
                            className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().input),
                            style: inputStyle,
                            placeholder: "Enter street address"
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().formRow),
                    style: {
                        display: "flex",
                        gap: "16px"
                    },
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().formGroup),
                            style: {
                                ...formGroupStyle,
                                flex: 1
                            },
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                                    htmlFor: "city",
                                    className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().label),
                                    style: labelStyle,
                                    children: "City"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                                    id: "city",
                                    name: "city",
                                    type: "text",
                                    value: formData.city,
                                    onChange: handleChange,
                                    className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().input),
                                    style: inputStyle,
                                    placeholder: "Enter city"
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().formGroup),
                            style: {
                                ...formGroupStyle,
                                width: "100px"
                            },
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                                    htmlFor: "state",
                                    className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().label),
                                    style: labelStyle,
                                    children: "State"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                                    id: "state",
                                    name: "state",
                                    type: "text",
                                    value: formData.state,
                                    onChange: handleChange,
                                    className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().input),
                                    style: inputStyle,
                                    placeholder: "State",
                                    maxLength: 2
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().formGroup),
                            style: {
                                ...formGroupStyle,
                                width: "120px"
                            },
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                                    htmlFor: "zipCode",
                                    className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().label),
                                    style: labelStyle,
                                    children: "Zip Code"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                                    id: "zipCode",
                                    name: "zipCode",
                                    type: "text",
                                    value: formData.zipCode,
                                    onChange: handleChange,
                                    className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().input),
                                    style: inputStyle,
                                    placeholder: "Zip code",
                                    maxLength: 10
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().formGroup),
                    style: formGroupStyle,
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                            htmlFor: "status",
                            className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().label),
                            style: labelStyle,
                            children: "Status"
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", {
                            id: "status",
                            name: "status",
                            value: formData.status,
                            onChange: handleChange,
                            className: (_FormModals_module_css__WEBPACK_IMPORTED_MODULE_4___default().select),
                            style: inputStyle,
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("option", {
                                    value: "prospect",
                                    children: "Prospect"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("option", {
                                    value: "active",
                                    children: "Active"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("option", {
                                    value: "inactive",
                                    children: "Inactive"
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AddClientModal);


/***/ })

};
;