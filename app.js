var redis = require("redis");
var io = require('socket.io').listen(3333);
client = redis.createClient();




io.sockets.on('connection', function (socket) {
    client.get("yanlis_count", function(err, reply) {
        socket.emit('connect_yanlis', { yanlis_count : reply.toString() } );
    });
});

http_server = require('./http');
http_server();


tweets = require('./tweets'); 
tweets(io,client);