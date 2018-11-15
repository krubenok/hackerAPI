"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    newHackerValidator: [
        // status will be added automatically
        VALIDATOR.mongoIdValidator("body", "accountId", false),
        VALIDATOR.nameValidator("body", "school", false),
        VALIDATOR.nameValidator("body", "gender", false),
        VALIDATOR.booleanValidator("body", "needsBus", false),
        VALIDATOR.applicationValidator("body", "application", false),
        VALIDATOR.nameValidator("body", "ethnicity", false),
        VALIDATOR.nameValidator("body", "major", false),
        VALIDATOR.integerValidator("body", "graduationYear", false, 2019, 2030),
        VALIDATOR.booleanValidator("body", "codeOfConduct", false),
    ],

    // untested
    updateHackerValidator: [
        VALIDATOR.mongoIdArrayValidator("body", "accountId", true),
        VALIDATOR.hackerStatusValidator("body", "status", true),
        VALIDATOR.nameValidator("body", "school", true),
        VALIDATOR.nameValidator("body", "gender", true),
        VALIDATOR.applicationValidator("body", "application", true),
        VALIDATOR.booleanValidator("body", "needsBus", true)
    ],
    uploadResumeValidator: [
        VALIDATOR.mongoIdValidator("param", "id", false)
    ],
    downloadResumeValidator: [
        VALIDATOR.mongoIdValidator("param", "id", false)
    ],
    updateStatusValidator: [
        VALIDATOR.mongoIdValidator("param", "id", false)
    ]
};