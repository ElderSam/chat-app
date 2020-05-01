
var socket = io('http://localhost:3000'); //conecta com o Socket do backend, ouve essa conexão
    
var objDiv = document.querySelector(".messages");

function renderMessage(message, type){
    //$('.messages').append(`<div class="message ${type}"><strong> ${message.author} </strong>: ${message.message} </div>`)

    // Obtém a data/hora atual
    var data = new Date();

    // Guarda cada pedaço em uma variável
    var dia     = data.getDate();           // 1-31
    var dia_sem = data.getDay();            // 0-6 (zero=domingo)
    var mes     = data.getMonth();          // 0-11 (zero=janeiro)
    var ano2    = data.getYear();           // 2 dígitos
    var ano4    = data.getFullYear();       // 4 dígitos
    var hora    = data.getHours();          // 0-23
    var min     = data.getMinutes();        // 0-59
    var seg     = data.getSeconds();        // 0-59
    var mseg    = data.getMilliseconds();   // 0-999
    var tz      = data.getTimezoneOffset(); // em minutos

    // Formata a data e a hora (note o mês + 1)
    var str_data = dia + '/' + (mes+1) + '/' + ano4;
    var str_hora = hora + ':' + min + ':' + seg;

    if(type == 'received'){
        align = ''
        float = ''      
        
    }else{
        align = 'align-right'
        float = 'float-right'
        message.author = 'eu'   
    }

    $('.messages').append(
        `<li class="clearfix">
            <div class="message-data ${align}">
              <span class="message-data-time" >${str_hora}, Hoje</span> &nbsp; &nbsp;
              <span class="message-data-name" ><strong>${message.author}</strong> </span> <i class="fa fa-circle me"></i>
              
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
