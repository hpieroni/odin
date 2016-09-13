"use strict";

/**
 * Config
 * @description :: Model for storing Config records
 */

var shortId = require('shortid');

module.exports = {
    schema: true,

    attributes: {
        id: {
            type: 'string',
            unique: true,
            index: true,
            defaultsTo: shortId.generate,
            primaryKey: true,
            size: 15
        },
        description: {
            type: 'string',
            required: true,
            unique: true,
            size: 250,
            minLength: 3
        },
        type: {
            type: 'string',
            required: true,
            enum: ['bool', 'string', 'integer', 'float', 'model']
        },
        multiple: {
            type: 'boolean',
            boolean: true
        },
        key: {
            type: 'string',
            required: true,
            size: 100,
            minLength: 1
        },
        value: {
            type: 'string',
            size: 250
        },
        model: {
            type: 'string',
            size: 50
        },
        updatedBy: {
            model: 'user'
        },

        toJSON() {
            return this.toObject();
        }
    },

    searchables: ['description'],

    beforeCreate(values, next) {
        values.updatedBy = values.createdBy;
        delete values.createdBy;
        next();
    },
    beforeUpdate(values, next) {
        values.updatedBy = values.createdBy;
        delete values.createdBy;
        next();
    }
};