// EXPRESS
const express = require('express');
const app = express();

// Setting the View Engine (EJS)
app.set('view engine', 'ejs');

// Setting the public directory
app.use('/resources', express.static('public'))
app.use('/resources', express.static(__dirname + '/public'))

// Setting urlencoded to prevent errors from the form
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// DOTENV
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'})

// Setting the router
app.use('/', require('./routes/router'))

// Trusting the Proxy to ascess the client's IPs
app.set('trust proxy', true)

// CORS
const cors = require('cors');
app.use(cors({
    origin: '*',
}));

// Starting the server
const server = app.listen(process.env.PORT, '0.0.0.0', (req, res) => {
    console.log('SERVER RUNNING')
})

// SOCEKT.IO
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
socketController = require('./controllers/socketController')(io)