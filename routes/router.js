// Invocamos Express
const express = require('express');
const router = express.Router()

// Invocamos a UserAgent
const useragent = require('express-useragent');
router.use(useragent.express());

// Invocamos a los controladores
const roomController = require('../controllers/roomController')

router.get('/', (req, res) => {
    res.render('index')
});
router.get('/findRoom', roomController.findRoom, (req, res) => {
    res.redirect('/room/' + req.room.code)
});
router.get('/createRoom', roomController.createRoom, (req, res) => {
    res.redirect('/room/' + req.room.code)
});
router.post('/joinRoom', roomController.joinRoom)

router.get('/room', (req, res) => {
    res.redirect('/');
});
router.get('/room/:room', roomController.getRoom, roomController.isMember, (req, res) => {
    res.render('room', {room: req.room, players: req.room.members.length, isHead: req.room.head == req.ip})
});

// Exportamos el router
module.exports = router;