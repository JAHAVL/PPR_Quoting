"use strict";
exports.id = 3903;
exports.ids = [3903];
exports.modules = {

/***/ 3903:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Go": () => (/* binding */ quotesAPI),
/* harmony export */   "HG": () => (/* binding */ employeesAPI),
/* harmony export */   "NF": () => (/* binding */ clientsAPI),
/* harmony export */   "Qu": () => (/* binding */ updateClient),
/* harmony export */   "eI": () => (/* binding */ createClient),
/* harmony export */   "hY": () => (/* binding */ projectsAPI),
/* harmony export */   "hi": () => (/* binding */ api),
/* harmony export */   "mz": () => (/* binding */ getClientById),
/* harmony export */   "oJ": () => (/* binding */ activityCommentsAPI),
/* harmony export */   "r8": () => (/* binding */ createEmployee),
/* harmony export */   "tW": () => (/* binding */ activitiesAPI)
/* harmony export */ });
/* unused harmony exports createProject, createQuote */
/**
 * API utility functions for interacting with the backend
 */ // Base API URL
const API_BASE = "/api";
// Generic fetch wrapper with error handling
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json"
        },
        ...options
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "An error occurred while fetching data");
    }
    return response.json();
}
// Client API functions
const clientsAPI = {
    getAll: ()=>fetchAPI("/clients"),
    getById: (id)=>fetchAPI(`/clients/${id}`),
    create: (data)=>fetchAPI("/clients", {
            method: "POST",
            body: JSON.stringify(data)
        }),
    update: (id, data)=>fetchAPI(`/clients/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }),
    delete: (id)=>fetchAPI(`/clients/${id}`, {
            method: "DELETE"
        })
};
// Project API functions
const projectsAPI = {
    getAll: ()=>fetchAPI("/projects"),
    getById: (id)=>fetchAPI(`/projects/${id}`),
    create: (data)=>fetchAPI("/projects", {
            method: "POST",
            body: JSON.stringify(data)
        }),
    update: (id, data)=>fetchAPI(`/projects/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }),
    delete: (id)=>fetchAPI(`/projects/${id}`, {
            method: "DELETE"
        })
};
// Quote API functions
const quotesAPI = {
    getAll: ()=>fetchAPI("/quotes"),
    getById: (id)=>fetchAPI(`/quotes/${id}`),
    create: (data)=>fetchAPI("/quotes", {
            method: "POST",
            body: JSON.stringify(data)
        }),
    update: (id, data)=>fetchAPI(`/quotes/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }),
    delete: (id)=>fetchAPI(`/quotes/${id}`, {
            method: "DELETE"
        })
};
// Employee API functions
const employeesAPI = {
    getAll: ()=>fetchAPI("/employees"),
    getById: (id)=>fetchAPI(`/employees/${id}`),
    create: (data)=>fetchAPI("/employees", {
            method: "POST",
            body: JSON.stringify(data)
        }),
    update: (id, data)=>fetchAPI(`/employees/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }),
    delete: (id)=>fetchAPI(`/employees/${id}`, {
            method: "DELETE"
        })
};
// Activity API functions
const activitiesAPI = {
    getAll: ()=>fetchAPI("/activities"),
    getByClientId: (clientId)=>fetchAPI(`/activities/${clientId}`),
    getById: (id)=>fetchAPI(`/activities/activity/${id}`),
    create: (data)=>fetchAPI("/activities", {
            method: "POST",
            body: JSON.stringify(data)
        }),
    update: (id, data)=>fetchAPI(`/activities/activity/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }),
    delete: (id)=>fetchAPI(`/activities/activity/${id}`, {
            method: "DELETE"
        })
};
// Activity Comments API functions (for notes on system messages)
const activityCommentsAPI = {
    getByActivityId: (activityId)=>fetchAPI(`/activity-comments/by-activity-id?activityId=${activityId}`),
    create: (data)=>fetchAPI("/activity-comments", {
            method: "POST",
            body: JSON.stringify(data)
        }),
    update: (id, data)=>fetchAPI(`/activity-comments/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }),
    delete: (id)=>fetchAPI(`/activity-comments/${id}`, {
            method: "DELETE"
        })
};
// Export all APIs
const api = {
    clients: clientsAPI,
    projects: projectsAPI,
    quotes: quotesAPI,
    employees: employeesAPI,
    activities: activitiesAPI,
    activityComments: activityCommentsAPI
};
// Helper functions for direct use in components
const createClient = (data)=>clientsAPI.create(data);
const updateClient = (id, data)=>clientsAPI.update(id, data);
const getClientById = (id)=>clientsAPI.getById(id);
const createEmployee = (data)=>employeesAPI.create(data);
const createProject = (data)=>projectsAPI.create(data);
const createQuote = (data)=>quotesAPI.create(data);


/***/ })

};
;