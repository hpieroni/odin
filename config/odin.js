const path = require('path');
const sails = require('sails');

module.exports.odin = {
    baseUrl: 'http://localhost:3000',
    kongHost: 'http://kongexample.com',
    kongAdmin: 'http://kongexample.com:8001',
    recaptchaSecret: '6LetbAcUAAAAADUH2850T6PNg_d1EXV04Sv48mZP',
    uploadFolder: 'files',
    datasetZipFolder: 'datasets',

    defaultEncoding: 'utf8',
    dataStorage: {
        host: 'localhost',
        port: '27017'
    },
    logFile: 'sailsApp.log',
    logFolder: 'logs',
    logLevel: 'error',

    statisticsPath: 'stats'
};