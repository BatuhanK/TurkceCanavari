var redis = require("redis");
var io = require('socket.io').listen(3333);
client = redis.createClient();




io.sockets.on('connection', function (socket) {
    client.get("yanlis_count", function(err, reply) {
        socket.emit('connect_yanlis', { yanlis_count : reply.toString() } );
    });
});


// HTTP server kullanmak istemiyorsanız bu kısmı silin, web klasörünü herhangi bir sunucuda çalıştırabilirsiniz

http_server = require('./http');
http_server();

// * HTTP server kullanmak istemiyorsanız bu kısmı silin


tweets = require('./tweets'); 
tweets(io,client);