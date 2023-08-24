const socket = io();

const config = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
    ],
};

const RTConnection = new RTCPeerConnection(config);
var dataChannel;

socket.on('head?', () => {
    socket.emit('head', {ip: window.clientIP, isHead: window.isHead})
});

socket.on('redirect', (destination) => {
    window.location.href = destination;
});

socket.on('offer?', (data) => {
    dataChannel = RTConnection.createDataChannel("dataChannel");

    dataChannel.onmessage = e => console.log(e.data);
    dataChannel.onopen = e => {
        console.log("Connected");
        dataChannel.send("Hola soy Head hablandole al Cliente")
        console.log("Había " + window.connections + " conexiones");
        window.connections =  window.connections + 1;
        console.log("Ahora hay " + window.connections + " conexiones");
        dataChannel.send({type: "numPlayers", data: window.connections})
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
        dataChannel = e.channel
        dataChannel.onmessage = e => console.log(e.data)
        dataChannel.onopen = e => {
            console.log("Connected");
            dataChannel.send("Hola soy el Cliente hablandole a Head")
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