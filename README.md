# chat-app


Aplicação de Chat em tempo real (back-end em Node.js)

OBS: o front-end está na pasta public e todo o resto é o back-end. Fiz isso para colocar tudo em um mesmo repositório e ser reconhecido pelo Heroku quando inicia o node server na pasta raíz.

-------------------------
ATENÇÃO!!!
Se você for tentar rodar o App localmente, precisa mudar os endereços para funcionar;

no arquivo /public/script.js mude o endereço para local, conforme mostrado abaixo:
    var socket = io('http://localhost:3000');  

-------------------------
Saiba mais como fazer o Deploy da aplicação no Heroku:
    https://www.youtube.com/watch?v=-j7vLmBMsEU
