const roomController = require('./roomController');

exports = module.exports = function(io){
    io.sockets.on('connection', (socket) => {
        socket.room = '';
        socket.on('join', (msg) => {
            socket.room = msg.room;
            socket.clientIP = socket.handshake.address;
        });
        socket.on('disconnect', function() {
            const roomIndex = roomController.gameRooms.map(function(e) { return e.code; }).indexOf(socket.room);
            const clientIndex = roomController.gameRooms[roomIndex].members.indexOf(socket.clientIP);

            roomController.gameRooms[roomIndex].members.splice(clientIndex, 1);

            if(roomController.gameRooms[roomIndex].members.length == 0){
                roomController.gameRooms.splice(roomIndex, 1);
            }
            else{
                if(roomController.gameRooms[roomIndex].head == socket.clientIP){
                    roomController.gameRooms[roomIndex].head = roomController.gameRooms[roomIndex].members[0]
                }
            }
            console.log(roomController.gameRooms)
        });
    });
}

// Comprobar que está saliendo la gente y se está cambiando la cabeza