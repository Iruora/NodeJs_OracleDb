const http = require('http');
const express = require('express');
const webServerConfig = require('../config/web-server.js');
const router = require('./router.js');
const morgan = require('morgan');

let httpServer;

function initialize() {
    return new Promise(
        (resolve, reject) => {
            // create express app
            const app = express();
            // create HTTP server that uses the express app
            httpServer = http.createServer(app);
            app.use(express.json({
                reviver: reviveJson
            }));
            app.use(morgan('combined'));
            app.use('/api', router);
            // bind the http server to the port defined in the configuration
            console.log(webServerConfig);
            httpServer.listen(webServerConfig.port)
                .on('listening', () => {
                    console.log(`Web Server listening on localhost:${webServerConfig.port}`);

                    resolve();
                })
                .on('error', err => {
                    reject(err);
                });
        }
    );
}
// ---------------------------------------------------------------------------------------------------
function close() {
    return new Promise(
        (resolve, reject) => {
            httpServer.close(err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        }
    );
}
// ---------------------------------------------------------------------------------------------------
const iso8601RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

function reviveJson(key, value) {
    if (typeof value === 'string' && iso8601RegExp.test(value)) {
        return new Date(value);
    } else {
        return value;
    }
}
// ---------------------------------------------------------------------------------------------------
module.exports.initialize = initialize;
module.exports.close = close;