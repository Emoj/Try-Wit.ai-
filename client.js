'use strict';
var net = require('net');

var HOST = '127.0.0.1';
var PORT = 8558;

var client = new net.Socket();

const msg = (() => {
  if (process.argv.length !== 3) {
    console.log('enter msg as parameter');
    process.exit(1);
  }
  return process.argv[2];
})();

client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write(msg);

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
    
    console.log('DATA: ' + data);
    // Close the client socket completely
    client.destroy();
    
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});