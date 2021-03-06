"use strict";

/**
 * File
 * @description :: Model for storing File records
 */

const shortId = require('shortid');
const fs = require('fs');
const _ = require('lodash');

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
        fileName: {
            type: 'string',
            unique: true,
            size: 15
        },
        name: {
            type: 'string',
            required: true,
            unique: true,
            size: 150,
            minLength: 1
        },
        description: {
            type: 'string',
            size: 350
        },
        notes: {
            type: 'string',
            size: 500
        },
        visible: {
            type: 'boolean',
            defaultsTo: false
        },
        url: {
            type: 'string',
            url: true,
            size: 500
        },
        deletedAt: {
            type: 'datetime'
        },
        publishedAt: {
            type: 'datetime'
        },
        unPublishedAt: {
            type: 'datetime'
        },
        rejectedAt: {
            type: 'datetime'
        },
        cancelledAt: {
            type: 'datetime'
        },
        reviewedAt: {
            type: 'datetime'
        },
        maps: {
            collection: 'map',
            via: 'file'
        },
        charts: {
            collection: 'chart',
            via: 'file'
        },
        gatheringDate: {
            type: 'date'
        },
        layout: {
            type: 'boolean',
            defaultsTo: false
        },
        updated: {
            type: 'boolean',
            defaultsTo: false
        },
        type: {
            model: 'filetype'
                // required: true
        },
        updateFrequency: {
            model: 'updatefrequency',
            required: true
        },
        status: {
            model: 'status'
        },
        organization: {
            model: 'organization',
            required: true
        },
        optionals: {
            type: 'json'
        },
        dataset: {
            model: 'dataset'
                // required: true
        },
        restService: {
            model: 'restservice'
        },
        soapService: {
            model: 'soapservice'
        },
        tags: {
            collection: 'tag',
            via: 'files',
            dominant: true
        },
        owner: {
            model: 'user',
            required: true
        },
        createdBy: {
            model: 'user'
                // required: true
        },

        toJSON() {
            return this.toObject();
        }
    },

    searchables: ['name', 'description'],

    beforeUpdate: (values, next) => {
        if (values.fileName) values.url = sails.config.odin.baseUrl + '/files/' +
            values.fileName + '/download';
        next()
    },
    beforeCreate: (values, next) => {
        if (_.endsWith(values.url, '/id')) {
            values.url = _.replace(values.url, 'model', 'files');
            values.url = _.replace(values.url, 'id', values.fileName);
            values.url = values.url + '/download';
        }

        if (!values.status) {
            Config.findOne({
                    key: 'defaultStatus'
                })
                .then(record => {
                    values.status = record.value;
                    next();
                });
        } else {
            next();
        }
    },
    afterUpdate: (values, next) => {
        if (values.dataset) ZipService.createZip(values.dataset);
        next();
    },
    afterCreate: (values, next) => {
        if (values.dataset) ZipService.createZip(values.dataset);
        next();
    },
    afterDestroy: (destroyedRecords, next) => {
        if (!_.isEmpty(destroyedRecords)) {
            destroyedRecords = destroyedRecords[0];
            UnpublishService.unpublish(destroyedRecords);
            UploadService.deleteFile(destroyedRecords.dataset, destroyedRecords.fileName, next);
        }
        next();
    }
};
