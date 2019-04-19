const http = require('http');
const express = require('express');
const webServerConfig = require('../config/web-server.js');

let httpServer;

function initialize() {
    return new Promise(
        (resolve, reject) => {
            // create express app
            const app = express();
            // create HTTP server that uses the express app
            httpServer = http.createServer(app);
            // the '/' route will end with a response message 'Hello World !'
            app.get('/', (req, res) => {
                res.end('Hello World !');
            });
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

module.exports.initialize = initialize;