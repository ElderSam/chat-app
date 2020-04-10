
var socket = io('http://localhost:3000'); //conecta com o Socket do backend, ouve essa conexão
    
var objDiv = document.querySelector(".messages");

function renderMessage(message){
    $('.messages').append('<div class="message"><strong>'+ message.author + '</strong>: '+ message.message + '</div>')
    
    objDiv.scrollTop = objDiv.scrollHeight; //arrasta o Scroll sempre para baixo, para mostrar as últimas mensagens

}

//newUser = $('input[name=username]');
const newUser = prompt('Qual o seu nome?')
msgJoin('Você entrou!');
socket.emit('newUser', newUser);

function msgJoin(msg){
    $('.messages').append(`<div class="msgJoin">${msg}</div>`);
    
}

socket.on('userConnected', function(name) {
    msgJoin(`${name} entrou`);
});

socket.on('userDisconnected', function(name) {
    msgJoin(`${name} saiu`);
});

/*
socket.on('previousMessages', function(messages){
    for(message of messages){
        renderMessage(message);
    }
});*/

socket.on('receivedMessage', function(message){
    renderMessage(message);
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

        renderMessage(messageObject) //mostra a mensagem na tela
        
        response = socket.emit('sendMessage', messageObject); //envia a mensagem
        if(!response.connected){
            console.warn('ERRO! Conexão perdida')
            alert('ERRO! Conexão Perdida')
        }   

        $('input[name=username]').hide();
        $('input[name=message]').val(''); //limpa o input de mensagem

    }else if(!author.length){
        alert('Informe um nome de usuário!');
        $('input[name=username]').addClass('redBorder').focus();

    }else{
        alert('Escreva uma mensagem!');
    }
});
