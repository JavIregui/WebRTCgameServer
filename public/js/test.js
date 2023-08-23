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
    dataChannel.onopen = e => console.log("Connected");

    RTConnection.onicecandidate = e => socket.emit('offer', {client: data.client, head: data.head, offer: JSON.stringify(RTConnection.localDescription)});
    RTConnection.createOffer().then(offer => RTConnection.setLocalDescription(offer));
});

socket.on('answer?', (data) => {
    const offer = data.offer;

    RTConnection.onicecandidate = e => socket.emit('answer', {client: data.client, head: data.head, answer: JSON.stringify(RTConnection.localDescription)});
    RTConnection.ondatachannel = e => {
        dataChannel = e.channel
        dataChannel.onmessage = e => console.log(e.data)
        dataChannel.onopen = e => console.log("Connected")
    };

    RTConnection.setRemoteDescription(data.offer);

    RTConnection.createAnswer().then(answer => RTConnection.setLocalDescription(answer));
});

socket.on('RTConnect', (data) => {
    const answer = data.answer;
    RTConnection.setRemoteDescription(answer);
    dataChannel.send("HOLA");
});