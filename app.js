// Invocamos EXPRESS
const express = require('express');
const app = express();

// Seteamos el motor de plantillas
app.set('view engine', 'ejs');

// Seteamos el directorio público
app.use('/resources', express.static('public'))
app.use('/resources', express.static(__dirname + '/public'))

// Seteamos urlencoded para que no haya errores al capturar los datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'})

// Llamar al Router
app.use('/', require('./routes/router'))

// Confiar en Proxy para poder acceder a las IPs de los clientes
app.set('trust proxy', true)

const cors = require('cors');
app.use(cors({
    origin: '*',
  }));

// Iniciamos Socket.io
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
socketController = require('./controllers/socketController')(io)

// Iniciamos el servidor
const server = app.listen(process.env.PORT, (req, res) => {
  console.log('SERVER RUNNING')
})