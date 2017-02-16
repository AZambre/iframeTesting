'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Path = require('path');
const Hoek = require('hoek');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 3000 
});

// Add the route
server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/secure/page/js/{name}',
        handler: function (request, reply) {
            reply.file('./web/js/' + request.params.name);
        }
    });

    server.route({
        method: 'GET',
        path: '/secure/page/css/{name}',
        handler: function (request, reply) {
            reply.file('./web/css/' + request.params.name);
        }
    });
});

server.route({
    method: 'GET',
    path: '/secure/data/getRequest',
    handler: function (request, reply) {
        reply({
        	"para": "Get request is working"
        });
    }
});

server.route({
    method: 'POST',
    path: '/secure/data/postRequest',
    handler: function (request, reply) {
        
    }
});

// Add templating handler
server.register(require('vision'), (err) => {

    Hoek.assert(!err, err);

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: './web/html'
    });

    server.route({
        method: 'GET',
        path: '/secure/page/{name}',
        handler: function (request, reply) {
            reply.view(request.params.name);
        }
    });
});

// Add log file
server.register({
    register: Good,
    options: {
        reporters: {
        	myFileReporter: [{
	            module: 'good-squeeze',
	            name: 'Squeeze',
	            args: [{ 
	            	ops: '*',
	            	response: '*',
                    log: '*'
                }]
	        }, {
	            module: 'good-squeeze',
	            name: 'SafeJson'
	        }, {
	            module: 'good-file',
	            args: ['./log/logFile.txt']
	        }]
        }
    }
}, (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    // Start the server
    server.start((err) => {

        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});