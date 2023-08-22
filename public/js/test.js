const socket = io('https://webrtcgameserver-production.up.railway.app:1903', { enabledTransports: ['ws', 'wss'] });

socket.on('head?', () => {
    console.log("kk")
    socket.emit('head', window.isHead)
});

socket.on('redirect', (destination) => {
    //window.location.href = destination;
});

socket.on('offer?', () => {
    console.log("Offer requested")
});