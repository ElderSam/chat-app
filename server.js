const express = require('express'); //para fazer a tratamento para mostrar um arquivo estático, só para Rota
const path = require('path');

const app = express();
const server = require('http').createServer(app); //cria o protocolo http
const io = require('socket.io')(server); //define o protocolo WSS para o WebSocket, mandando o server

app.use(express.static(path.join(__dirname, 'public'))); //define uma pasta onde fica os arquivos públicos da aplicação
app.set('views', path.join(__dirname, 'public')); //para indicar que estamos utilizando as Views como html
app.engine('html', require('ejs').renderFile); //para quando precisamoa utilizar o html
app.set('view engine', 'html'); 

app.use('/', (req, res) => { //quando acessar o endereço do servidor padrão, renderiza a view index.html
    res.render('index.html');
}); 

const users = {}
let messages = [];

io.on('connection', socket => { //define a forma de conexão com o WebSocket
    
    //console.log(`Socket conectado ${socket.id}`);

    socket.on('newUser', name => {
        console.log('newuser: ' + name);
        users[socket.id] = name
        socket.broadcast.emit('userConnected', name);
    });


    //socket.emit('previousMessages', messages); //emite o evento com as mensagens

    socket.on('sendMessage', data => { //ao receber a mensagem
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data); //envia a mensagem para todos conectados
        console.log(data); //imprime o objeto recebido
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('userDisconnected', users[socket.id])
        delete users[socket.id]
    });
});


server.listen(3000); //ouve a porta 3000