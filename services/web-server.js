const http = require('http');
const express = require('express');
const webServerConfig = require('../config/web-server.js');
const database = require('./database.js');
const morgan = require('morgan');

let httpServer;

function initialize() {
    return new Promise(
        (resolve, reject) => {
            // create express app
            const app = express();
            // create HTTP server that uses the express app
            httpServer = http.createServer(app);
            // the '/' route will end with a response message 'Hello World !'
            app.use(morgan('combined'));
            app.get('/', async (req, res) => {
                const result = await database.simpleExecute("select user, systimestamp from dual");
                const user = result.rows[0].USER;
                const date = result.rows[0].SYSTIMESTAMP;

                res.end(`DB user : ${user}\nDate: ${date}`);
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
module.exports.initialize = initialize;
module.exports.close = close;