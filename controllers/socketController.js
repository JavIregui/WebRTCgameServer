const roomController = require('./roomController');

const ipToSocketMap = new Map();

exports = module.exports = function(io){
    io.sockets.on('connection', (socket) => {
        console.log("Connected")
        const clientIP = socket.handshake.address;
        ipToSocketMap.set(clientIP, socket);

        socket.emit('head?');

        socket.on('head', (head) => {
            if(!head){
                console.log("NOT Head")
                const roomHead = findRoomHead(clientIP, roomController.gameRooms)
                console.log("ClientIP = " + clientIP)
                console.log("HeadIP = " + roomHead)
                if(!roomHead){
                    console.log("HEAD NOT FOUND")
                    socket.emit('redirect', "/");
                }
                else{
                    const headSocket = ipToSocketMap.get(roomHead)
                    if(!headSocket){
                        console.log("HEAD SOCKET NOT FOUND")
                        socket.emit('redirect', "/");
                    }
                    else{
                        headSocket.emit('offer?');
                        console.log("WAITING FOR OFFER")
                    }
                }
            }
            else{
                console.log("Head")
            }
        });


    });
}

function findRoomHead(clientIP, rooms) {
    for (room in rooms) {
      //if (room.members.includes(clientIP)) {
        //return room.head;
      //}
      console.log(room)
    }
    return null;
}