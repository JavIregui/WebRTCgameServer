const axios = require('axios');

// Lista de Salas
var rooms = [];

module.exports.gameRooms = rooms;

// Generador de códigos
var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
function generateCode(length, chars) {
    var code = '';
    for (var i = length; i > 0; --i) code += chars[Math.floor(Math.random() * chars.length)];
    result = code.toUpperCase()
    return result;
}

// Crear sala
exports.createRoom = async (req, res, next) => {
    roomIndex = rooms.length;
    rooms.push({
        code: generateCode(6,chars),
        private: true,
        canBeJoined: true,
        head: await getPublicIP(),
        members : [],
    });
    rooms[roomIndex].members.push(rooms[roomIndex].head);
    req.room = rooms[roomIndex]
    return next();
}
// Unirse a una sala
exports.joinRoom = async (req, res) => {
    const code = req.body.roomCode.toUpperCase();
    const roomIndex = rooms.map(function(e) { return e.code; }).indexOf(code);
    const ip = await getPublicIP();
    if(roomIndex < 0){
        res.redirect('/')
    } else {
        if(rooms[roomIndex].members.includes(ip)){
            req.room = rooms[roomIndex]
            res.redirect('/room/' + code)
        }
        else{
            if(rooms[roomIndex].canBeJoined && rooms[roomIndex].members.length < 5){
                rooms[roomIndex].members.push(ip);
                req.room = rooms[roomIndex]
                res.redirect('/room/' + code)
            }
            else{
                res.redirect('/')
            }
        }
    }
}
// Buscar sala disponible
exports.findRoom = async (req, res, next) => {
    if(rooms.length == 0){
        rooms.push({
            code: generateCode(6,chars),
            private: false,
            canBeJoined: true,
            head: await getPublicIP(),
            members : [],
        });
        rooms[0].members.push(rooms[0].head);
        req.room = rooms[0]
        return next();
    } else {
        const ip = await getPublicIP();
        for(i = 0; i < rooms.length; i++){
            if(!rooms[i].private && rooms[i].canBeJoined && rooms[i].members.length < 5 && !rooms[i].members.includes(ip)){
                rooms[i].members.push(ip);
                req.room = rooms[i]
                return next();
            }
        }
        roomIndex = rooms.length;
        rooms.push({
            code: generateCode(6,chars),
            private: false,
            canBeJoined: true,
            head: await getPublicIP(),
            members : [],
        });
        rooms[roomIndex].members.push(rooms[roomIndex].head);
        req.room = rooms[roomIndex]
        return next();
    }
}

exports.getRoom = (req, res, next) =>{
    const code = req.params.room;
    const roomIndex = rooms.map(function(e) { return e.code; }).indexOf(code);
    if(roomIndex < 0){
        res.redirect('/')
    }
    else{
        req.room = rooms[roomIndex];
        return next();
    }
}
exports.isMember = async (req, res, next) =>{
    const ip = await getPublicIP();
    if(req.room.members.includes(ip)){
        return next();
    }
    else{
        res.redirect('/');
    }
}
exports.isHead = async (req, res, next) => {
    const ip = await getPublicIP();
    req.isHead = req.room.head == ip;
}

async function getPublicIP() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        throw error;
    }
}