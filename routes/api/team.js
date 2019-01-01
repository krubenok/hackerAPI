"use strict";

const express = require("express");

const Controllers = {
    Team: require("../../controllers/team.controller")
};
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
        Team: require("../../middlewares/validators/team.validator"),
        RouteParam: require("../../middlewares/validators/routeParam.validator"),
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.middleware"),
    Team: require("../../middlewares/team.middleware"),
    Auth: require("../../middlewares/auth.middleware"),
};

module.exports = {
    activate: function (apiRouter) {
        const teamRouter = new express.Router();

        /**
         * @api {post} /team/ create a new team consisting of only the logged in user
         * @apiName createTeam
         * @apiGroup Team
         * @apiVersion 0.0.8
         * 
         * @apiParam (body) {String} name Name of the team.
         * @apiParam (body) {String} [devpostURL] Devpost link to hack. Once the link is sent, the hack will be considered to be submitted.
         * @apiParam (body) {String} projectName Name of the team.
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Team object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Team creation successful", 
                    "data": {...}
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Error while creating team", "data": {}}
         */
        teamRouter.route("/").post(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),
            // Validators
            Middleware.Validator.Team.newTeamValidator,
            Middleware.parseBody.middleware,

            Middleware.Team.parseTeam,

            Middleware.Team.createTeam,
            Controllers.Team.createdTeam
        );

        /**
         * @api {patch} /team/join/ Allows a logged in hacker to join a team by name
         * @apiName patchJoinTeam
         * @apiGroup Team
         * @apiVersion 1.1.1
         * 
         * @apiParam (body) {string} [teamName] Name of the team to join
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data {}
         * @apiSuccessExample {object} Success-Response: 
         *      {
         *          "message": "Team join successful.", 
         *          "data": {}
         *      }
         * @apiPermission Administrator
         */
        teamRouter.route("/join/").patch(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),

            Middleware.Validator.Team.joinTeamValidator,
            // need to check that the team is not full
            Middleware.Team.ensureSpace,

            Middleware.Team.updateHackerTeam,

            Controllers.Team.joinedTeam
        );

        /**
         * @api {get} /team/:id get a team's information
         * @apiName getTeam
         * @apiGroup Team
         * @apiVersion 0.0.8
         * 
         * @apiParam (param) {ObjectId} id a team's unique mongoId
         * 
         * @apiSuccess {String} message Success message
         * @apiSuccess {Object} data Sponsor object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Successfully retrieved team information", 
                    "data": {...}
                }

         * @apiError {String} message Error message
         * @apiError {Object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Team not found", "data": {}}
         */
        teamRouter.route("/:id").get(
            Middleware.Validator.RouteParam.idValidator,
            Middleware.parseBody.middleware,

            Middleware.Team.findById,
            Controllers.Team.showTeam
        );

        apiRouter.use("/team", teamRouter);
    }
};