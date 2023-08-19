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
exports.createRoom = (req, res, next) => {
    roomIndex = rooms.length;
    rooms.push({
        code: generateCode(6,chars),
        private: true,
        canBeJoined: true,
        head: req.ip,
        members : [],
    });
    rooms[roomIndex].members.push(req.ip);
    req.room = rooms[roomIndex]
    console.log(rooms)
    return next();
}
// Unirse a una sala
exports.joinRoom = (req, res) => {
    const code = req.body.roomCode.toUpperCase();
    console.log(code)
    const roomIndex = rooms.map(function(e) { return e.code; }).indexOf(code);
    if(roomIndex < 0){
        res.redirect('/')
        console.log("ROOM NOT FOUND")
    } else {
        console.log("ROOM FOUND")
        if(rooms[roomIndex].members.includes(req.ip)){
            req.room = rooms[roomIndex]
            console.log(rooms)
            res.redirect('/room/' + code)
        }
        else{
            if(rooms[roomIndex].canBeJoined && rooms[roomIndex].members.length < process.env.PLAYERS){
                rooms[roomIndex].members.push(req.ip);
                req.room = rooms[roomIndex]
                console.log(rooms)
                res.redirect('/room/' + code)
            }
            else{
                console.log("ROOM CAN'T BE JOINED")
                res.redirect('/')
            }
        }
    }
}
// Buscar sala disponible
exports.findRoom = (req, res, next) => {
    if(rooms.length == 0){
        rooms.push({
            code: generateCode(6,chars),
            private: false,
            canBeJoined: true,
            head: req.ip,
            members : [],
        });
        rooms[0].members.push(req.ip);
        req.room = rooms[0]
        console.log(rooms)
        return next();
    } else {
        for(i = 0; i < rooms.length; i++){
            if(!rooms[i].private && rooms[i].canBeJoined && rooms[i].members.length < process.env.PLAYERS && !rooms[i].members.includes(req.ip)){
                rooms[i].members.push(req.ip);
                req.room = rooms[i]
                console.log(rooms)
                return next();
            }
        }
        roomIndex = rooms.length;
        rooms.push({
            code: generateCode(6,chars),
            private: false,
            canBeJoined: true,
            head: req.ip,
            members : [],
        });
        rooms[roomIndex].members.push(req.ip);
        req.room = rooms[roomIndex]
        console.log(rooms)
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
exports.isMember = (req, res, next) =>{
    if(req.room.members.includes(req.ip)){
        return next();
    }
    else{
        res.redirect('/');
    }
}