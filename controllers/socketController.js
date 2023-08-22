const roomController = require('./roomController');

const ipToSocketMap = new Map();

exports = module.exports = function(io){
    io.sockets.on('connection', async (socket) => {

        socket.emit('head?');

        socket.on('head', (head) => {
            const clientIP = head.ip;
            ipToSocketMap.set(clientIP, socket);

            if(!head.isHead){
                const roomHead = findRoomHead(clientIP)
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

function findRoomHead(clientIP) {
    for (let i = 0; i < roomController.gameRooms.length; i++) { 
        if (roomController.gameRooms[i].members.includes(clientIP)) {
            return roomController.gameRooms[i].head;
        }
    }
    return null;
}