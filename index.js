const webServer = require('./services/web-server.js');
async function startup() {
    console.log('Starting application');

    try {
        console.log('Initializing web server module');

        await webServer.initialize();
    } catch (err) {
        console.log(err);

        process.exit(1);
    }
}

startup();