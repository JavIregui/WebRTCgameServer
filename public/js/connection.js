const socket = io();

const config = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
    ],
};

const RTConnections = new Map();

socket.on('head?', () => {
    socket.emit('head', {ip: window.clientIP, isHead: window.isHead})
});

socket.on('redirect', (destination) => {
    window.location.href = destination;
});

socket.on('offer?', (data) => {
    const RTConnection = new RTCPeerConnection(config);
    RTConnections.set(data.client, RTConnection);
    RTConnection.dataChannel = RTConnection.createDataChannel("dataChannel");

    RTConnection.dataChannel.onmessage = e => {
        if(e.data.type == "numPlayers"){
            window.connections = e.data.msg;
            ChangeNum();
        }
        else {
            console.log(e.data)
        }
    }
    
    RTConnection.dataChannel.onopen = e => {
        console.log("Connected");
        window.connections =  window.connections + 1;
        ChangeNum();

        for (const [key, value] of RTConnections) {
            value.dataChannel.send({type: "numPlayers", msg: window.connections});
        }
    }

    RTConnection.onicecandidate = e => {
        if (e.candidate) {
            socket.emit('newICEcandidate', {
                client: data.client,
                head: data.head,
                candidate: e.candidate
            });
        }
    };

    RTConnection.createOffer()
    .then(offer => {
        return RTConnection.setLocalDescription(offer);
    })
    .then(() => {
        socket.emit('offer', { client: data.client, head: data.head, offer: RTConnection.localDescription });
    })
});

socket.on('answer?', (data) => {
    const RTConnection = new RTCPeerConnection(config);
    RTConnections.set(data.head, RTConnection);
    const offer = data.offer;

    RTConnection.onicecandidate = e => {
        if (e.candidate) {
            socket.emit('newICEcandidate', {
                client: data.client,
                head: data.head,
                candidate: e.candidate
            });
        }
    };

    RTConnection.ondatachannel = e => {
        RTConnection.dataChannel = e.channel
        RTConnection.dataChannel.onmessage = e => {
            if(e.data.type == "numPlayers"){
                window.connections = e.data.msg;
                ChangeNum();
            }
            else {
                console.log(e.data)
            }
        }

        RTConnection.dataChannel.onopen = e => {
            console.log("Connected");
        }
    };

    RTConnection.setRemoteDescription(offer);

    RTConnection.createAnswer()
    .then(answer => {
        return RTConnection.setLocalDescription(answer);
    })
    .then(() => {
        socket.emit('answer', { client: data.client, head: data.head, answer: RTConnection.localDescription });
    })
});

socket.on('ice-candidate', data => {
    var connection;
    if(!window.isHead){
        connection = RTConnections.get(data.head);
    }
    else{
        connection = RTConnections.get(data.client);
    }
    connection.addIceCandidate(new RTCIceCandidate(data.candidate))
    .catch(error => {
        console.error('Error al agregar el candidato ICE:', error);
    });
});

socket.on('RTConnect', (data) => {
    var connection = RTConnections.get(data.client);
    const answer = data.answer;
    connection.setRemoteDescription(answer);
});

socket.on('playerLeft', () => {
    window.connections = window.connections - 1;
    ChangeNum();
    
    for (const [key, value] of RTConnections) {
        value.dataChannel.send({type: "numPlayers", msg: window.connections});
    }
})

function ChangeNum(){
    document.getElementById('num').innerHTML = "TOTAL MEMBERS: " + window.connections;
}