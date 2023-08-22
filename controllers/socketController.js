const roomController = require('./roomController');
const axios = require('axios');

const ipToSocketMap = new Map();

exports = module.exports = function(io){
    io.sockets.on('connection', (socket) => {
        console.log("Connected")
        const clientIP = getPublicIP();
        ipToSocketMap.set(clientIP, socket);

        socket.emit('head?');

        socket.on('head', (head) => {
            if(!head){
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
    }
    //for (room in roomController.gameRooms) {
      //if (room.members.includes(clientIP)) {
        //return room.head;
      //}
      //console.log()
    //}
    return null;
}

async function getPublicIP() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        throw error;
    }
}