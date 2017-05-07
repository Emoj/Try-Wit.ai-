'use strict';

let Wit = null;
let interactive = null;

var net = require('net');

var HOST = '127.0.0.1';
var PORT = 8558;

try {
    Wit = require('../../../').Wit;
    interactive = require('../../../').interactive;
} catch (e) {
    Wit = require('node-wit').Wit;
    interactive = require('node-wit').interactive;
}

const accessToken = "TQM3ZVMNNQL6XFWTFXWXJAT7XIHLZFR3"

const firstEntityValue = (entities, entity) => {

    const val = entities && entities[entity] && Array.isArray(entities[entity]) && entities[entity].length > 0 && entities[entity][0].value;

    if (!val) {

        return null;
    }

    return typeof val === 'object' ? val.value : val;
};

const actions = {

    send(request, response) {

        const {sessionId, context, entities} = request;
        const {text, quickreplies} = response;
        console.log('sending... ', JSON.stringify(response));
    },

    checkProfLog({context, entities}) {

        var contact = firstEntityValue(entities, 'contact');

        if (contact) {

            context.prof_log = contact.charAt(0).toUpperCase() + contact.slice(1).toLowerCase() + ' arrived the office at 8:30 am'; // we should call a weather API here
            delete context.missing_prof;
        }
        else {

            context.missing_prof = true;
            delete context.prof_log;
        }

        console.log('intent' + JSON.stringify(entities));
        delete entities.intent
        return context;
    },
};

const wit = new Wit({ accessToken, actions });

net.createServer(function (sock) {

    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

    sock.on('data', function (data) {

        console.log('\n\nDATA ' + sock.remoteAddress + ': ' + data);
        sock.write('you said "' + data + '"');

        wit.runActions('yoopow-01', data, {})
            .then((context) => {
                console.log('The session state is now: ' + JSON.stringify(context));
            })

    });

    sock.on('close', function (data) {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST + ':' + PORT);