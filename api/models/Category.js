"use strict";

/**
 * Category
 * @description :: Model for storing Category records
 */

const shortId = require('shortid');
const slug = require('slug');
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
        name: {
            type: 'string',
            unique: true,
            required: true,
            size: 150,
            minLength: 1
        },
        slug: {
            type: 'string',
            unique: true,
            size: 150
        },
        description: {
            type: 'string',
            size: 350
        },
        color: {
            type: 'string',
            size: 6
        },
        active: {
            type: 'boolean',
            defaultsTo: true
        },
        createdBy: {
            model: 'user',
            required: true
        },
        fileName: {
            type: 'string',
            size: 150
        },
        deletedAt: {
            type: 'datetime'
        },
        datasets: {
            collection: 'dataset',
            via: 'categories'
        },
        datasetsSubcategories: {
            collection: 'dataset',
            via: 'subcategories'
        },
        parent: {
            model: 'category'
        },
        subcategories: {
            collection: 'category',
            via: 'parent'
        },

        toJSON() {
            return this.toObject();
        }
    },

    searchables: ['name', 'description'],

    beforeValidate: (values, next) => {
        if (values.parent) {
            Category
                .findOneById(values.parent)
                .then(parentCategory => {
                    next(parentCategory.parent ? new Error('The parent category cannot be a subcategory') : null);
                });
        } else {
            next();
        }
    },
    beforeUpdate: (values, next) => {
        if(values.name) {
            values.slug = slug(values.name, { lower: true });
        }
        next();
    },
    beforeCreate: (values, next) => {
        if(values.name) {
            values.slug = slug(values.name, { lower: true });
        }
        if (_.endsWith(values.image, '/id')) {

            values.image = _.replace(values.url, 'model', 'categories');
            values.image = _.replace(values.image, 'id', values.id);
            values.image = values.image + '/image';
        }

        next();
    }
};
