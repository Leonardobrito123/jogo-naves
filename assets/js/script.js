function start(){ //inicio função start

    //variaveis jogo
    var jogo = {};
    var fimDeJogo = false;
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334)
    var podeAtirar = true;
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var energiaAtual = 3;
    var TECLA = {W: 87, S: 83, D: 68}

    jogo.pressionou = [];

    // variaveis som
    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameOver = document.getElementById("somGameOver");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    //loop de musica 
    musica.addEventListener("ended",function(){
        musica.currentTime = 0;
        musica.play();
    }, false);
    musica.play();

    $("#inicio").hide();

    //criação de novas divs na fundoGame
    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>")
    $("#fundoGame").append("<div id='energia'></div>")

    //game loop
    //a cada 30ms irá chamar a função loop
    jogo.timer = setInterval(loop, 30)

    function loop(){
        moveFundo();
        moveJogador();
        moveInimigo1();
        moveInimigo2();
        moveAmigo();
        colisao();
        placar();
        energia();
    } 

    function moveFundo(){
        //pegar posição do fundo e diminuir 1 para o fundo se mexer, atualizando a cada 30ms entrando num loop
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda - 1);
    } //fim game loop

    //Verificar se o usuário pressionou as teclas
    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });

    //verificar se não existe teclas pressionadas
    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });

    //função de mover jogador
    //se apertar W jogador, irá pegar o valor top do jogador, adicionar a variavel topo e irá se move para cima, diminuindo o valor. Se apertar S move para baixo
    function moveJogador(){
        if(jogo.pressionou[TECLA.W]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo - 10);

                // impedir que o jogador saia da tela
                if(topo <= 0){
                    $('#jogador').css("top", topo + 10)
                }
        }

        if(jogo.pressionou[TECLA.S]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo + 10);

                if(topo >= 437){
                    $('#jogador').css("top", topo - 10)
                }
        }

        if(jogo.pressionou[TECLA.D]){
            disparo();
        }
     }  //Fim função jogador

    // Função mover inimigo1
    function moveInimigo1(){
        //pegar valor left do inimigo1 e subtrair pela velocidade, como estará em loop, ele andará para esquerda
        //adicionar posicaoY ao top, para aparecer em um valor randomico

        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left", posicaoX - velocidade);
        $("#inimigo1").css("top", posicaoY);

        //verificação para o inimigo não sair da tela, recriando a variavel posicaoY, para ele reaparecer num valor randomico na tela e voltar para posicao left
        if(posicaoX <= 0){
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }
    } //Fim função mover inimigo1

    //função mover inimigo2
    function moveInimigo2(){
        //pegar valor de left do inimigo 2 e substrair para ele mover para esquerda.
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoX - 3);

        //verificação para reposicionar inimigo2
        if(posicaoX <= 0){
            $("#inimigo2").css("left", 775);
        }
    } //fim função move inimigo2

    // função mover amigo
    function moveAmigo(){
        // Pegar valor de left do amigo e fazer ele mover para direita
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX + 1);

        //verificando para reposicionar amigo
        if(posicaoX > 906){
            $("#amigo").css("left", 0);
        }
    } //Fim função move amigo

    //função disparo
    function disparo(){
        //verificar se pode atirar, caso possa atirar, não poderá atirar seguidamente. Indicar a posição do jogador para saber da onde sairá os tiros, criar div do disparo e posicionar o disparo para sair na frente do jogador
        if(podeAtirar == true){
            somDisparo.play();
            podeAtirar = false;
            topo = parseInt ($("#jogador").css("top"));
            posicaoX = parseInt($("#jogador").css("left"));

            tiroX = posicaoX + 190;
            topoTiro = topo + 37;

            $("#fundoGame").append("<div id='disparo'></div>");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);

            var tempoDisparo = window.setInterval(executaDisparo, 30)
        } //fim Pode atirar

        //função para o disparo caminhar pela tela
        function executaDisparo(){
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX + 15);

            //verificação para reposicionar o disparo
            if(posicaoX > 900){
                window.clearInterval(tempoDisparo)
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            } 
        }//fim executaDisparo
    } //fim função disparo

    //função de colisão
    function colisao(){
        //verificar se houve colisao, se houver, irá ocorrer a explosão do inimigo e reposicionar ele aleatoriamente
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 =($("#disparo").collision($("#inimigo1")));
        var colisao4 =($("#disparo").collision($("#inimigo2")));
        var colisao5 =($("#jogador").collision($("#amigo")));
        var colisao6 =($("#inimigo2").collision($("#amigo")));
        
        //colisão jogador - inimigo1
        if(colisao1.length > 0){
            energiaAtual--;
            
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

            posicaoY = parseInt (Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

        //colisão jogador - inimigo2
        if(colisao2.length > 0){
            energiaAtual--;

            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);

            $("#inimigo2").remove();

            reposicionaInimigo2();
        }

        //colisão disparo - inimigo1 
        if(colisao3.length > 0){
            pontos += 100;
            velocidade += 0.5;

            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);
            $("#disparo").css("left", 950);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

        //colisão disparo - inimigo2
        if(colisao4.length > 0){
            pontos += 100;

            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();

            explosao2(inimigo2X, inimigo2Y);
            $("#disparo").css("left", 950);          

            reposicionaInimigo2();
        }

        //colisão jogador - amigo
        if(colisao5.length > 0){
            salvos++;

            somResgate.play();
            reposicionaAmigo();
            $("#amigo").remove();
        }

        //colisão inimigo2 - amigo
        if(colisao6.length > 0){
            perdidos++;

            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX, amigoY);

            $("#amigo").remove();
            reposicionaAmigo();
        }

    } //fim função de colisão

    function explosao1(inimigo1X, inimigo1Y){
        somExplosao.play();

        // criar div de explosao, indicar aonde a div irá aparecer (mesma posicao do inimigo) e após isso, animar a explosao
        $("#fundoGame").append("<div id='explosao1'></div>");
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");
        var div = $("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width: 200, opacity: 0}, "slow");

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

        //função remover explosao
        function removeExplosao(){
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        } //fim função remove explosao

    } //Fim função explosao1

    //função explosao2
    function explosao2(inimigo2X, inimigo2Y){
        somExplosao.play();

        $("#fundoGame").append("<div id='explosao2'></div>");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)");
        var div2 = $("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width: 200, opacity: 0}, "slow");

        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

        function removeExplosao2(){
            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;
        }
    }

    //função explosao3
    function explosao3(amigoX, amigoY){
        somPerdido.play();

        $("#fundoGame").append("<div id='explosao3' class='anima4'></div>");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);
        
        var tempoExplosao3 = window.setInterval(removeExplosao3, 1000);

        function removeExplosao3(){
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
        }
    }
    //fim função explosao3


    //função reposiciona inimigo2
    //inimigo irá ser reposicionado a cada 5 segundos, porém, só se o jogo não estiver acabado
    function reposicionaInimigo2(){
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4(){
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if(fimDeJogo == false){
                $("#fundoGame").append("<div id='inimigo2'></div>")
            }
        }
    }//fim função reposiciona inimigo2

    //função reposiciona amigo
    //amigo irá ser reposicionado a cada 6 segundos, porém, só se o jogo não estiver acabado
    function reposicionaAmigo(){
        var tempoAmigo = window.setInterval(reposiciona6, 6000);
        
        function reposiciona6(){
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            if(fimDeJogo == false){
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            }
        }
    }    //fim função reposiciona amigo

    //função para atualizar o placar
    function placar() {
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    } //fim função para atualizar o placar

    //função para atualizar a energia
    function energia(){
        if(energiaAtual == 3){
            $("#energia").css("background-image","url(imgs/energia3.png)");
        } 
        
        if(energiaAtual == 2){
            $("#energia").css("background-image","url(imgs/energia2.png)");
        }

        if(energiaAtual == 1){
            $("#energia").css("background-image","url(imgs/energia1.png)");            
        }

        if(energiaAtual == 0){
            $("#energia").css("background-image","url(imgs/energia0.png)");            

            gameOver();
        }
    }//fim função para atualizar a energia 
    
    //Função gameOver
    //quando o jogo acabar, musica de fundo irá parar, remover todas entidades e dar a opção de jogar novamente, além de parar o loop do jogo
    function gameOver(){
        fimDeJogo = true;
        musica.pause();
        somGameOver.play();

        window.clearInterval(jogo.timer);
        jogo.timer = null;

        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();

        $("#fundoGame").append("<div id='fim'></div>");

        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><button>Jogar Novamente</button></div>");
    }    //fim Função gameOver

} //fim função start

//função para reiniciar jogo
function reiniciaJogo(){
    somGameOver.pause();
    $("#fim").remove();
    start();
} //fim função para reiniciar jogo