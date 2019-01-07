"use strict";
const Role = require("../models/role.model");
const logger = require("./logger.service");
const mongoose = require("mongoose");

/**
 * @function createRole
 * @param {{_id: ObjectId, name: String, routes: route[]}} roleDetails 
 * @return {Promise<Role>} The promise will resolve to a role object if save was successful.
 * @description Adds a new role to database.
 */
function createRole(roleDetails) {
    const role = new Role(roleDetails);

    return role.save();
}

/**
 * @function getRole
 * @param {string} roleName The name of the role that you're looking for.
 * @description 
 * Returns the role defined by the role name
 */
function getRole(roleName) {
    const TAG = "[Role Service # getRole]:";
    const query = {
        name: roleName
    };
    //get the roleBinding for account
    //Populate roles for roleBinding
    return Role.findOne(query, logger.queryCallbackFactory(TAG, "role", query));
}

/**
 * @function getById
 * @param {ObjectId} id The role id
 * @description 
 * Returns the role specified by the id.
 */
function getById(id) {
    const TAG = "[Role Service # getById]:";
    const query = {
        _id: id
    };
    //get the roleBinding for account
    //Populate roles for roleBinding
    return Role.findById(query, logger.queryCallbackFactory(TAG, "role", query));
}

/**
 * @function getAll
 * @description 
 * Returns all the roles in the database
 */
function getAll() {
    const TAG = "[Role Service # getAll]:";
    return Role.find({}, logger.queryCallbackFactory(TAG, "role", {}));
}

/**
 * @function addRoutes
 * @param {*} query
 * @param {route[]} addRoutes
 * @return {DocumentQuery} The document query will resolve to role or null.
 * @description Adds routes in addRoutes to a role specified by the query.
 */
function addRoutes(query, addRoutes) {
    const TAG = `[Role Service # addRoutes ]:`;

    return Role.findOneAndUpdate(query, {
        $push: {
            routes: addRoutes
        }
    });
}

/**
 * @function removeRoutes
 * @param {*} query
 * @param {route[]} removeRoutes
 * @return {DocumentQuery} The document query will resolve to role or null.
 * @description removes routes in removeRoutes from a role specified by the query.
 */
function removeRoutes(query, removeRoutes) {
    const TAG = `[Role Service # removeRoutes ]:`;

    return Role.findOneAndUpdate(query, {
        $pull: {
            routes: removeRoutes
        }
    });
}



module.exports = {
    getRole: getRole,
    getById: getById,
    getAll: getAll,
    createRole: createRole,
    addRoutes: addRoutes,
    removeRoutes: removeRoutes,
};