// Variables para el tamaño del juego y elementos del juego
var w=800;
var h=400;
var jugador;
var fondo;

var bala, bala2, balaD=false, balaC=false, nave;

var salto;
var menu;
var movizq;
var movder;

var velocidadBala;
var despBala;
var despBala2
var estatusAire;
var estatuSuelo;

var nnNetwork , nnEntrenamiento, nnSalida, datosEntrenamiento=[];
var modoAuto = false, eCompleto=false;



var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render:render});


//Carga los recursos necesarios para el juego, como imágenes y hojas de sprites.
function preload() {
    juego.load.image('fondo', 'assets/game/fondonieve.jpg');
    juego.load.spritesheet('mono', 'assets/sprites/altair.png',32 ,48);
    juego.load.image('nave', 'assets/game/ufo.png');
    juego.load.image('bala', 'assets/sprites/purple_ball.png');
    juego.load.image('bala2', 'assets/sprites/purple_ball.png');
    juego.load.image('menu', 'assets/game/menu.png');
}


// aquí
//Inicializa el sistema de física y configura la gravedad.
//se crea y posiciona elementos como el fondo, la nave, la bala, y el jugador.
//se establece animaciones para el jugador.
//se configura la entrada del teclado y crea una red neuronal artificial utilizando la biblioteca Synaptic.
function create() {

    juego.physics.startSystem(Phaser.Physics.ARCADE);
    juego.physics.arcade.gravity.y = 800;
    juego.time.desiredFps = 30;

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');
    nave = juego.add.sprite(w-100, h-70, 'nave');
    bala = juego.add.sprite(w-100, h, 'bala');
    bala2 = juego.add.sprite(w-500, h-500, 'bala2');
    jugador = juego.add.sprite(50, h, 'mono');


    juego.physics.enable(jugador);
    jugador.body.collideWorldBounds = true;
    var corre = jugador.animations.add('corre',[8,9,10,11]);
    jugador.animations.play('corre', 10, true);

    juego.physics.enable(bala);
    bala.body.collideWorldBounds = true;

    juego.physics.enable(bala2);
    //bala2.body.collideWorldBounds = true;

    pausaL = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausaL.inputEnabled = true;
    pausaL.events.onInputUp.add(pausa, self);
    juego.input.onDown.add(mPausa, self);

    salto = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    movizq = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    movder = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    
    nnNetwork =  new synaptic.Architect.Perceptron(2, 6, 6, 2);
    nnEntrenamiento = new synaptic.Trainer(nnNetwork);
}

function enRedNeural(){
    nnEntrenamiento.train(datosEntrenamiento, {rate: 0.0003, iterations: 10000, shuffle: true});
}

function datosDeEntrenamiento(param_entrada){

    console.log("Entrada",param_entrada[0]+" "+param_entrada[1]);
    nnSalida = nnNetwork.activate(param_entrada);
    var aire=Math.round( nnSalida[0]*100 );
    var piso=Math.round( nnSalida[1]*100 );
    console.log("Valor ","En el Aire %: "+ aire + " En el suelo %: " + piso );
    return nnSalida[0]>=nnSalida[1];
}



function pausa(){
    juego.paused = true;
    menu = juego.add.sprite(w/2,h/2, 'menu');
    menu.anchor.setTo(0.5, 0.5);
}

function mPausa(event){
    if(juego.paused){
        var menu_x1 = w/2 - 270/2, menu_x2 = w/2 + 270/2,
            menu_y1 = h/2 - 180/2, menu_y2 = h/2 + 180/2;

        var mouse_x = event.x  ,
            mouse_y = event.y  ;

        if(mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2 ){
            if(mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1 && mouse_y <=menu_y1+90){
                eCompleto=false;
                datosEntrenamiento = [];
                modoAuto = false;
            }else if (mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1+90 && mouse_y <=menu_y2) {
                if(!eCompleto) {
                    console.log("","Entrenamiento "+ datosEntrenamiento.length +" valores" );
                    enRedNeural();
                    eCompleto=true;
                }
                modoAuto = true;
            }

            menu.destroy();
            resetVariables();
            resetVariablesBala2();
            juego.paused = false;

        }
    }
}
//esta parte del codigo es donde apareceran los elementos del juego una vez terminen su animacion/accion
function resetVariables(){
    jugador.body.velocity.x=0;
    jugador.body.velocity.y=0;
    bala.body.velocity.x = 0;
    bala.position.x = w-100;
   // bala2.body.velocity.x = 0;
   // bala2.position.x = w-750, h-500;
    //jugador.position.x=50;
    balaD=false;
}

function resetVariablesBala2(){
    bala2.body.velocity.x = 0;
    //bala2.position.x = w-velocidadRandom(0,800);
    bala2.position.x = w-650;

    bala2.position.y = h-470;
    balaC=false;
    
}


function saltar(){
    jugador.body.velocity.y = -270;
}

function izquierda(){
    jugador.body.velocity.x = -150;
}

function derecha(){
    jugador.body.velocity.x = 150;
}

//en esta función:
//Actualiza el juego en cada fotograma.
//Gestiona la lógica del juego, como la colisión de la bala con el jugador, el movimiento del jugador y la bala, la lógica de pausa, el entrenamiento de la red neuronal, entre otros.
//También registra datos de entrenamiento para la red neuronal si el juego no está en modo automático.
function update() {

    fondo.tilePosition.x -= 1; 

    juego.physics.arcade.collide(bala, jugador, colisionH, null, this);

    estatuSuelo = 1;
    estatusAire = 0;

    juego.physics.arcade.collide(bala2, jugador, colisionH, null, this);




    if(!jugador.body.onFloor()) {
        estatuSuelo = 0;
        estatusAire = 1;
    }
	
    despBala = Math.floor( jugador.position.x - bala.position.x );
    despBala2 = Math.floor( jugador.position.x - bala2.position.x)

    if( modoAuto==false && salto.isDown &&  jugador.body.onFloor() ){
        saltar();
    }

    if( modoAuto==false && movizq.isDown  ){
        izquierda();
    }

    if( modoAuto==false && movder.isDown  ){
        derecha();
    }


    
    if( modoAuto == true  && bala.position.x>0 && jugador.body.onFloor()) {

        if( datosDeEntrenamiento( [despBala , velocidadBala] )  ){
            saltar();
        }
    }

    if( balaD==false ){
        disparo();
    }

    if( balaC==false) {
        disparo2();
    }
   

    if( bala.position.x <= 0  ){
        resetVariables();
    }
    

    
    if( modoAuto ==false  && bala.position.x > 0 ){

        datosEntrenamiento.push({
                'input' :  [despBala , velocidadBala],
                'output':  [estatusAire , estatuSuelo ]  
        });

        console.log("Desplazamiento Bala, Velocidad Bala, Estatus, Estatus: ",
            despBala + " " +velocidadBala + " "+ estatusAire+" "+  estatuSuelo);
   }

// bala 2, dice en que punto va a recetearse la bala
   if( bala2.position.y >= 500  ){
    resetVariablesBala2();
}

   if( modoAuto ==false  && bala2.position.y < 0 ){

    datosEntrenamiento.push({
            'input' :  [despBala2 , velocidadBala],
            'output':  [estatusAire , estatuSuelo ]  
    });

    console.log("Desplazamiento Bala, Velocidad Bala, Estatus, Estatus: ",
        despBala2 + " " +velocidadBala + " "+ estatusAire+" "+  estatuSuelo);
}
}


function disparo(){
    velocidadBala =  -1 * velocidadRandom(300,800);
    bala.body.velocity.y = 0 ;
    bala.body.velocity.x = velocidadBala ;
    balaD=true;
}

function disparo2(){
    //velocidadBala =    velocidadRandom(300,800);
    velocidadBala =   150 ;
    bala2.body.velocity.y = velocidadBala ;
    bala2.body.velocity.x = 0 ;
    balaC=true;
    
}


function colisionH(){
    pausa();
}

function velocidadRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//Se usa para renderizar elementos en el juego
function render(){
}