//conecta com o Socket do backend, ouve essa conexão
var socket = io('http://localhost:3000');   
isConnected();

const messages = {
    portuguese: {
        question1: "Qual é o seu nome?",
        youJoined: 'Você entrou',
        joined: 'entrou',
        left: 'saiu',
        me: 'Eu',
        writeAMessage: 'Escreva uma mensagem!',
        errorConnectionLost: 'Conexão perdida, tente novamente mais tarde.'
    },
    english: {
        question1: "What is your name?",
        youJoined: 'You joined',
        joined: 'joined',
        left: 'left',
        me: 'Me',
        writeAMessage: 'Write a message!',
        errorConnectionLost: 'Connection lost, please try again later.'
    }
}

const language = (navigator.language ==='pt-BR') ? messages.portuguese : messages.english; //muda o idioma para português, se quiser mudar para inglês, basta trocar para messages.english

var objDiv = document.querySelector(".messages");
console.log('objDiv.baseURI: ', objDiv.baseURI);

function renderMessage(message, type){
    //$('.messages').append(`<div class="message ${type}"><strong> ${message.author} </strong>: ${message.message} </div>`)

    // Obtém a data/hora atual
    var data = new Date();

    // Guarda cada pedaço em uma variável
    var hora    = data.getHours();          // 0-23
    var min     = data.getMinutes();        // 0-59
    var seg     = data.getSeconds();        // 0-59

    // Formata a hora
    var str_hora = hora + ':' + min + ':' + seg;
    
    
    if(type == 'received'){
        align = ''
        float = '' 
        author = message.author
        
    }else{
        align = 'align-right'
        float = 'float-right'
        author = language.me
    }

    $('.messages').append(
        `<li class="clearfix">
            <div class="message-data ${align}">
                <span class="message-data-name" ><strong>${author}</strong> </span> <i class="fa fa-circle me"></i>      
                <span class="message-data-time" >${str_hora}</span> &nbsp; &nbsp;             
            </div>
            <div class="message ${float} ${type}">
            ${message.message}
            </div>
    </li>`);
    
    objDiv.scrollTop = objDiv.scrollHeight; //arrasta o Scroll sempre para baixo, para mostrar as últimas mensagens

}

function isConnected(){
    console.log('socket.connected', socket.connected); //verifica se está conectado
}

//newUser = $('input[name=username]');
const newUser = prompt(language.question1)
console.log({ newUser })

msgJoin(`${language.youJoined}!`);
socket.emit('newUser', newUser);

function msgJoin(msg){
    $('.messages').append(`<div class="msgJoin">${msg}</div>`);
}

socket.on('userConnected', function(name) {
    msgJoin(`${name} ${language.joined}`);
    isConnected();
});

socket.on('userDisconnected', function(name) {
    msgJoin(`${name} ${language.left}`);
    isConnected();
});

/*
socket.on('previousMessages', function(messages){
    for(message of messages){
        renderMessage(message);
    }
});*/

socket.on('receivedMessage', function(message){
    renderMessage(message, 'received');
});

$('#chat').submit(function(event){ //quando eu enviar a mensagem
    event.preventDefault(); //para não atualizar a página

    var author = newUser
    var message = $('input[name=message]').val();

    if(author.length && message.length){
        var messageObject = { //envia o objeto por WebSocket
            author: author,
            message: message,
        };

        renderMessage(messageObject, 'send') //mostra a mensagem na tela
        
        response = socket.emit('sendMessage', messageObject); //envia a mensagem

        if(!response.connected){
            console.warn(language.errorConnectionLost)
            alert(language.errorConnectionLost)
        }

        $('input[name=username]').hide();
        $('input[name=message]').val(''); //limpa o input de mensagem

    }else if(!author.length){
        alert(language.writeAMessage);
        $('input[name=username]').addClass('redBorder').focus();

    }else{
        alert(language.writeAMessage);
    }
});
