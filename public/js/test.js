const socket = io();

socket.on('head?', () => {
    socket.emit('head', {ip: window.clientIP, isHead: window.isHead})
});

socket.on('redirect', (destination) => {
    window.location.href = destination;
});

socket.on('offer?', () => {
    const config = {
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
        ],
    };

    const localConnection = new RTCPeerConnection(config);
    const dataChannel = localConnection.createDataChannel("dataChannel");

    dataChannel.onmessage = e => console.log(e.data);
    dataChannel.onopen = e => console.log("Connected");

    localConnection.onicecandidate = e => socket.emit('offer', {offer: JSON.stringify(localConnection.localDescription)});
    //localConnection.onicecandidate = e => console.log(JSON.stringify(localConnection.localDescription));
    localConnection.createOffer().then(offer => localConnection.setLocalDescription(offer));
});