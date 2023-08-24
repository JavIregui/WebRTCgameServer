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
                        headSocket.emit('offer?', {client: clientIP, head: roomHead});
                    }
                }
            }
        });

        socket.on('offer', (data) => {
            const clientSocket = ipToSocketMap.get(data.client)
            clientSocket.emit('answer?', {client: data.client, head: data.head, offer: data.offer})
        });

        socket.on('answer', (data) => {
            const headSocket = ipToSocketMap.get(data.head)
            headSocket.emit('RTConnect', {client: data.client, head: data.head, answer: data.answer})
        });

        socket.on('newICEcandidate', data => {
            var targetSocket
            if(socket == ipToSocketMap.get(data.head)){
                targetSocket = ipToSocketMap.get(data.client)
            } else {
                targetSocket = ipToSocketMap.get(data.head)
            }
            
            if (targetSocket) {
                targetSocket.emit('ice-candidate', data.candidate);
            }
        });

        socket.on('disconnect', () => {
            const clientIP = getIPfromSocket(ipToSocketMap, socket)
            const roomHead = findRoomHead(clientIP)
            if(roomHead == clientIP){
                // Head Change
                // or
                // Send every ember of the room to "/"
                // I'll use OPTION 2

                members = findMembers(clientIP)
                for (let index = 0; index < members.length; index++) {
                    target = ipToSocketMap.get(members[i])
                    target.emit('redirect', "/");
                    ipToSocketMap.delete(members[i]);
                }

                for (let i = 0; i < roomController.gameRooms.length; i++) { 
                    if (roomController.gameRooms[i].head == clientIP) {
                        roomController.gameRooms.splice(i, 1);
                    }
                }

            }
            else{
                DeleteFromRoom(clientIP);
                ipToSocketMap.delete(clientIP);
                headSocket = ipToSocketMap.get(roomHead);
                headSocket.emit('playerLeft');
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

function getIPfromSocket(map, socket) {
    for (let [key, value] of map.entries()) {
      if (value === socket)
        return key;
    }
}

function findMembers(headIP){
    for (let i = 0; i < roomController.gameRooms.length; i++) { 
        if (roomController.gameRooms[i].head == headIP) {
            return roomController.gameRooms[i].members;
        }
    }
}

function DeleteFromRoom(client){
    for (let i = 0; i < roomController.gameRooms.length; i++) { 
        if (roomController.gameRooms[i].members.includes(client)) {
            for (let j = 0; j < roomController.gameRooms[i].members.length; j++) {
                if(roomController.gameRooms[i].members[j] == client) {
                    roomController.gameRooms[i].members.splice(j, 1);
                }
                
            }
        }
    }
}