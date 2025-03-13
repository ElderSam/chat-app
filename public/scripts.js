var socket = io('https://chat-app2-node-a9c1feced251.herokuapp.com/'); //conecta com o Socket do backend, ouve essa conexão
//var socket = io('http://localhost:3000');   

var objDiv = document.querySelector(".messages");

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
        author = 'eu'   
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
