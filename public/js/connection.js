const socket = io();

const config = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
    ],
};

var RTConnections = [];

socket.on('head?', () => {
    socket.emit('head', {ip: window.clientIP, isHead: window.isHead})
});

socket.on('redirect', (destination) => {
    window.location.href = destination;
});

socket.on('offer?', (data) => {
    const RTConnection = new RTCPeerConnection(config);
    RTConnections.push(RTConnection);
    RTConnection.dataChannel = RTConnection.createDataChannel("dataChannel");

    RTConnection.dataChannel.onmessage = e => console.log(e.data);
    RTConnection.dataChannel.onopen = e => {
        console.log("Connected");
        RTConnection.dataChannel.send("Hola soy Head hablandole al Cliente")
        window.connections =  window.connections + 1;
        ChangeNum();
        RTConnection.dataChannel.send({type: "numPlayers", data: window.connections})
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
    RTConnections.push(RTConnection);
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
                window.connections = e.data.data;
                ChangeNum();
            }
            else{
                console.log(e.data)
            }
        }

        RTConnection.dataChannel.onopen = e => {
            console.log("Connected");
            RTConnection.dataChannel.send("Hola soy el Cliente hablandole a Head")
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

socket.on('ice-candidate', iceCandidate => {
    RTConnection.addIceCandidate(new RTCIceCandidate(iceCandidate))
    .catch(error => {
        console.error('Error al agregar el candidato ICE:', error);
    });
});

socket.on('RTConnect', (data) => {
    const answer = data.answer;
    RTConnection.setRemoteDescription(answer);
});

socket.on('playerLeft', () => {
    window.connections = window.connections - 1;
    ChangeNum();
})

function ChangeNum(){
    document.getElementById('num').innerHTML = "TOTAL MEMBERS: " + window.connections;
}