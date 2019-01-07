"use strict";
const mongoose = require("mongoose");
const Services = {
    Role: require("../services/role.service"),
};
const Constants = {
    Error: require("../constants/error.constant"),
};
const Middleware = {
    Util: require("../middlewares/util.middleware"),
};

/**
 * @function parseRole
 * @param {{body: name: String, routes: route[]}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description 
 * Moves name and routes from req.body to req.body.roleDetails.
 * Adds _id to roleDetails.
 */
function parseRole(req, res, next) {
    const roleDetails = {
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        routes: req.body.routes,
    };

    delete req.body.name;
    delete req.body.routes;

    req.body.roleDetails = roleDetails;

    return next();
}

/**
 * @function createRole
 * @param {{body: {roleDetails: object}}} req 
 * @param {*} res 
 * @param {(err?)=>void} next 
 * @return {void}
 * @description
 * Creates role document
 */
async function createRole(req, res, next) {
    const roleDetails = req.body.roleDetails;

    const role = await Services.Role.createRole(roleDetails);

    if (!!role) {
        delete req.body.roleDetails;
        req.body.role = role;
        return next();
    } else {
        return next({
            status: 500,
            message: Constants.Error.ROLE_CREATE_500_MESSAGE,
            data: {}
        });
    }
}

async function updateRole(req, res, next) {
    let role = addRoutes(req, next);
    role = removeRoutes(req, next);

    req.body.role = role;
    next();
}

async function addRoutes(req, next) {
    const role = await Services.Role.addRoutes({
        name: req.body.roleName
    }, req.body.roleDetails.addRoutes);

    if (!role) {
        return next({
            status: 500,
            message: Constants.Error.ROLE_UPDATE_500_MESSAGE,
            data: {}
        });
    }

    return role;
}

async function removeRoutes(req, next) {
    const role = await Services.Role.removeRoutes({
        name: req.body.roleName
    }, req.body.roleDetails.removeRoutes);

    if (!role) {
        return next({
            status: 500,
            message: Constants.Error.ROLE_UPDATE_500_MESSAGE,
            data: {}
        });
    }

    return role;
}

function parsePatch(req, res, next) {
    const roleDetails = {
        name: req.body.roleName,
        addRoutes: req.body.addRoutes,
        removeRoutes: req.body.removeRoutes,
    };

    delete req.body.name;
    delete req.body.addRoutes;
    delete req.body.removeRoutes;

    req.body.roleDetails = roleDetails;
    return next();
}

module.exports = {
    parseRole: parseRole,
    parsePatch: parsePatch,
    createRole: Middleware.Util.asyncMiddleware(createRole),
    updateRole: Middleware.Util.asyncMiddleware(updateRole),
};