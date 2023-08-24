var rooms = [];

module.exports.gameRooms = rooms;

// Code Generator
var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
function generateCode(length, chars) {
    var code = '';
    for (var i = length; i > 0; --i) code += chars[Math.floor(Math.random() * chars.length)];
    result = code.toUpperCase()
    return result;
}

// Create Room
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
    return next();
}
// Join Room
exports.joinRoom = (req, res) => {
    const code = req.body.roomCode.toUpperCase();
    const roomIndex = rooms.map(function(e) { return e.code; }).indexOf(code);
    if(roomIndex < 0){
        res.redirect('/')
    } else {
        if(rooms[roomIndex].members.includes(req.ip)){
            req.room = rooms[roomIndex]
            res.redirect('/room/' + code)
        }
        else{
            if(rooms[roomIndex].canBeJoined && rooms[roomIndex].members.length < 5){
                rooms[roomIndex].members.push(req.ip);
                req.room = rooms[roomIndex]
                res.redirect('/room/' + code)
            }
            else{
                res.redirect('/')
            }
        }
    }
}
// Find avaliable Room
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
        return next();
    } else {
        for(i = 0; i < rooms.length; i++){
            if(!rooms[i].private && rooms[i].canBeJoined && rooms[i].members.length < 5 && !rooms[i].members.includes(req.ip)){
                rooms[i].members.push(req.ip);
                req.room = rooms[i]
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