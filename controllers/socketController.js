const roomController = require('./roomController');

const ipToSocketMap = new Map();

exports = module.exports = function(io){
    io.sockets.on('connection', (socket) => {
        const clientIP = socket.handshake.address;
        ipToSocketMap.set(clientIP, socket);

        socket.emit('head?');

        socket.on('head', (head) => {
            if(!head){
                const roomHead = findRoomHead(clientIP, roomController.gameRooms)
                if(!roomHead){
                    socket.emit('redirect', "/");
                }
                else{
                    const headSocket = ipToSocketMap.get(roomHead)
                    if(!headSocket){
                        socket.emit('redirect', "/");
                    }
                    else{
                        headSocket.emit('offer?');
                    }
                }
            }
        });

        
    });
}

function findRoomHead(clientIP, rooms) {
    for (const room of rooms) {
      if (room.members.includes(clientIP)) {
        return room.head;
      }
    }
    return null;
}