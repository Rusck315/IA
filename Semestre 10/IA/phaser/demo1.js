var w=800;
var h=400;
var jugador;
var fondo;

var bala, balaD=false, nave, nave2, nave3, bala2, bala3, bala2D=false, bala3D=false;

var salto;
var desplazo;
var desplazoizq
var menu;

var velocidadBala;
var despBala;
var estatusAire;

var velocidadBala2;
var despBala2;
var estatusDesp;

var velocidadBala3;
var despBala3;
var estatusDesp3;

var nnNetwork , nnEntrenamiento, nnSalida, datosEntrenamiento=[];
var modoAuto = false, eCompleto=false;

var data_phaser = "";   



var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render:render});

function preload() {
    juego.load.image('fondo', 'assets/game/fondonieve.jpg');
    juego.load.spritesheet('mono', 'assets/sprites/altair.png',32 ,48);
    juego.load.image('nave', 'assets/game/ufo.png');
    juego.load.image('bala', 'assets/sprites/purple_ball.png');
    juego.load.image('menu', 'assets/game/menu.png');

}



function create() {

    juego.physics.startSystem(Phaser.Physics.ARCADE);
    //juego.physics.arcade.gravity.y = 800;
    juego.time.desiredFps = 30;

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');
    nave = juego.add.sprite(w-100, h-70, 'nave');
    bala = juego.add.sprite(w-100, h, 'bala');
    nave2 = juego.add.sprite(5, 0, 'nave');
    nave3 = juego.add.sprite(w-100, h-400, 'nave');
    bala2 = juego.add.sprite(50, 0, 'bala');
    bala3 = juego.add.sprite(w-100, h-500, 'bala');
    jugador = juego.add.sprite(50, h, 'mono');


    juego.physics.enable(jugador);
    jugador.body.collideWorldBounds = true;
    jugador.body.gravity.y = 800;
    var corre = jugador.animations.add('corre',[8,9,10,11]);
    jugador.animations.play('corre', 10, true);

    juego.physics.enable(bala);
    bala.body.collideWorldBounds = true;
 
    juego.physics.enable(bala2);
    bala2.body.collideWorldBounds = true;

    juego.physics.enable(bala3);
    bala3.body.collideWorldBounds = true;

    

    pausaL = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausaL.inputEnabled = true;
    pausaL.events.onInputUp.add(pausa, self);
    juego.input.onDown.add(mPausa, self);


    //asigancion de botones a movimientos
    salto = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    desplazoizq = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    desplazo = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    
    nnNetwork =  new synaptic.Architect.Perceptron(4, 8, 4, 2);
    nnEntrenamiento = new synaptic.Trainer(nnNetwork);

}

function enRedNeural(){
    nnEntrenamiento.train(datosEntrenamiento, {rate: 0.0003, iterations: 30000, shuffle: true});
}


function datosDeEntrenamiento(param_entrada){

    console.log("Entrada",param_entrada[0]+" "+param_entrada[1]+' '+param_entrada[2]+" "+param_entrada[3]);
    nnSalida = nnNetwork.activate(param_entrada);
    var aire=Math.round( nnSalida[0]*100 );
    var desp=Math.round( nnSalida[1]*100 );
    console.log("Valor ","En el Aire %: "+ aire + " En desplazamiento %: " + desp );
    var status = [false, false];
    if(aire > 50)
        status[0] = true;
    if(desp > 50)
        status[1] = true;
    return status;
}



function pausa(){
    juego.paused = true;
    menu = juego.add.sprite(w/2,h/2, 'menu');
    menu.anchor.setTo(0.5, 0.5);
    
}

function descarga(){
    //Codigo para descargar un documento con los datos de entrenamiento
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data_phaser));
    enlaceDescarga.setAttribute('download', 'resultado.csv');
    enlaceDescarga.style.display = 'none';

    // Agregar el enlace al body y simular clic para iniciar la descarga
    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();

    // Limpiar el enlace después de la descarga
    document.body.removeChild(enlaceDescarga);
}

function mPausa(event){
    if(juego.paused){
        
        var menu_x1 = w/2 - 270/2, menu_x2 = w/2 + 270/2,
            menu_y1 = h/2 - 180/2, menu_y2 = h/2 + 180/2;

        var mouse_x = event.x  ,
            mouse_y = event.y  ;

        if(mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2 ){
            if(mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1 && mouse_y <=menu_y1+90){
                if(eCompleto)
                    datosEntrenamiento = [];
                else
                    for(var auxiliar = 0;  auxiliar < 20; auxiliar++)
                        datosEntrenamiento.pop();
                modoAuto = false;
                eCompleto=false;
            }else if (mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1+90 && mouse_y <=menu_y2) {
                if(!eCompleto) {
                    //descarga();
                    for(var auxiliar = 0;  auxiliar < 20; auxiliar++)
                        datosEntrenamiento.pop();
                    console.log("","Entrenamiento "+ datosEntrenamiento.length +" valores" );
                    enRedNeural();
                    eCompleto=true;
                }
                modoAuto = true;
            }

            menu.destroy();
            resetVariables();
            resetVariablesB2();
            resetVariablesB3();

            jugador.position.x = 50;
            juego.paused = false;

        }
    }
}


function resetVariables(){
    jugador.body.velocity.x=0;
    jugador.body.velocity.y=0;
    bala.body.velocity.x = 0;
    bala.position.x = w-100;
    balaD=false;
    //bala2D=false;
}

function resetVariablesB2(){
    jugador.body.velocity.x=0;
    jugador.body.velocity.y=0;
    bala2.body.velocity.y = 0;
    bala2.position.y = 0;
    bala2D=false;
}

function resetVariablesB3(){
    bala3.body.velocity.x = 0;
    //bala2.position.x = w-velocidadRandom(0,800);
    bala3.position.x = w-50;
    bala3.position.y = h-450;
    bala3D=false;
}


function saltar(){
    jugador.body.velocity.y = -270;
}

function desplazarDer(){
    if(jugador.position.x < 80)
        jugador.position.x += 5;
}

function desplazarIzq(){
    if(jugador.position.x > 20)
        jugador.position.x -= 50;
}


function reset(){
    if (jugador.position.x > 51) {
        jugador.position.x -= 2;
    } else if (jugador.position.x < 49) {
        jugador.position.x += 2;
    }
}

function update() {

    fondo.tilePosition.x -= 1; 

    juego.physics.arcade.collide(bala, jugador, colisionH, null, this);
    juego.physics.arcade.collide(bala2, jugador, colisionH, null, this);
    juego.physics.arcade.collide(bala3, jugador, colisionH, null, this);


    estatusAire = 0;
    estatusDesp = 0;

    if(!jugador.body.onFloor())
        estatusAire = 1;
    
    if(jugador.position.x != 50)
        estatusDesp = 1;
	
    despBala = Math.floor( jugador.position.x - bala.position.x );
    despBala2 = Math.floor(jugador.position.y - bala2.position.y);
    despBala3 = Math.floor(jugador.position.y - bala3.position.y);


    if(!modoAuto){
        if( salto.isDown &&  jugador.body.onFloor() )
            saltar();
        
        if( desplazo.isDown )
            desplazarDer();

        if( desplazoizq.isDown )
            desplazarIzq();
        
        if( !desplazo.isDown && jugador.position.x != 50 )
            reset();
    }
    

    if( modoAuto  && (bala.position.x>0 || bala2.position.y>0)) {
        var resultConsulta = datosDeEntrenamiento( [despBala , velocidadBala, despBala2, velocidadBala2] );
        if( resultConsulta[0] && jugador.body.onFloor()){
            saltar();
        }

        if(resultConsulta[1])
            desplazarDer();
        else if(jugador.position.x != 50)
            reset();
    }

    if( balaD==false ){
        disparo();
    }

    if( bala2D==false ){
        disparoVert();
    }

    if( bala3D==false ){
        disparo3();
    }

    if( bala.position.x <= 0  ){
        resetVariables();
    }
    
    if( bala2.body.onFloor()  ){
        resetVariablesB2();
    }

    if( bala3.body.onFloor()  ){
        resetVariablesB3();
    }

    /*if( bala3.position.y >= 500  ){
        resetVariablesB3();
    }*/

    if( modoAuto ==false  && (bala.position.x>0 || bala2.position.y>0) ){

        datosEntrenamiento.push({
                'input' :  [despBala , velocidadBala, despBala2, velocidadBala2],
                'output':  [estatusAire, estatusDesp]  
        });

        //console.log("Desplazamiento Bala, Velocidad Bala, Estatus, Estatus: ",
        //   despBala + " " +velocidadBala + " "+ estatusAire+" "+  estatuSuelo);
        //dataset.push([despBala, velocidadBala, despBala2, velocidadBala2, estatusAire, estatusDesp]);
        console.log(despBala + ' ' + velocidadBala + ' ' + despBala2 + ' ' + velocidadBala2 + ' ' + estatusAire + ' ' + estatusDesp);
        data_phaser += despBala + ' ' + velocidadBala + ' ' + despBala2 + ' ' + velocidadBala2 + ' ' + estatusAire + ' ' + estatusDesp + "\n";
   }

}


function disparo(){
    velocidadBala =  -1 * velocidadRandom(150,500);
    bala.body.velocity.y = 0 ;
    bala.body.velocity.x = velocidadBala ;
    balaD=true;
}

function disparoVert(){
    velocidadBala2 =  velocidadRandom(50,300);
    bala2.body.velocity.x = 0 ;
    bala2.body.velocity.y = velocidadBala2;
    bala2D=true;
}

function disparo3(){
    //velocidadBala =    velocidadRandom(300,800);
    velocidadBala =   170 ;
    bala3.body.velocity.y = velocidadBala ;
    bala3.body.velocity.x = -400 ;
    bala3D=true;
}

function colisionH(){
    pausa();
}

function velocidadRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function render(){

}
