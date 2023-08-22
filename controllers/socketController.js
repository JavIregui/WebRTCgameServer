const roomController = require('./roomController');

const ipToSocketMap = new Map();

exports = module.exports = function(io){
    io.sockets.on('connection', async (socket) => {
        console.log("Connected")

        socket.emit('head?');

        socket.on('head', (head) => {
            console.log(head)
            const clientIP = head.ip;
            ipToSocketMap.set(clientIP, socket);

            if(!head.isHead){
                console.log("NOT Head")
                const roomHead = findRoomHead(clientIP)
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

function findRoomHead(clientIP) {
    console.log(roomController.gameRooms)
    for (let i = 0; i < roomController.gameRooms.length; i++) { 
        console.log(roomController.gameRooms[i].head);
        if (roomController.gameRooms[i].members.includes(clientIP)) {
            return roomController.gameRooms[i].head;
        }
    }
    return null;
}