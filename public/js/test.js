const socket = io('104.196.232.237:443');

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