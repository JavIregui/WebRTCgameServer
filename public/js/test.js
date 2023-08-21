const socket = io('http://localhost:1903');

socket.on('head?', () => {
    socket.emit('head', window.isHead)
});

socket.on('redirect', (destination) => {
    window.location.href = destination;
});

socket.on('offer?', () => {
    console.log("Offer requested")
});