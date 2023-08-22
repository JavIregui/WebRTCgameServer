const socket = io('http://webrtcgameserver-production.up.railway.app:1903', { transports: ["websocket"] });

socket.on('head?', () => {
    socket.emit('head', window.isHead)
});

socket.on('redirect', (destination) => {
    window.location.href = destination;
});

socket.on('offer?', () => {
    console.log("Offer requested")
});