# **PROYECTOS DE IA**    


 ## **Reynaldo Chagolla salmeron 19121010**

En el documento se mostraran los siguientes proyectos

1. reconocimiento de emociones
2. wally
3. phasher
4. CNN
5. phaser 2


---
---
---
# **PROYECTO 1 reconociminieto de emociones**

aqui lo que se hace es importar las librerias a utilizar y .xml que va a clasificar los rostros.
despues, lo que hace es prender la camara y capurar imagenes de las caras en diferentes carpetas, dependiedo de cual seleccionemos dependiendo de su gesto


```import numpy as np
import cv2 as cv
import math
rostro = cv.CascadeClassifier('haarcascade_frontalface_alt2.xml')


cap = cv.VideoCapture(0)
i=1000
while True:
    ret, frame = cap.read()
    gray = cv.cvtColor (frame, cv.COLOR_BGR2GRAY)
    rostros = rostro.detectMultiScale(gray, 1.3, 5)
    for(x, y, w, h) in rostros:
        frame = cv.rectangle(frame, (x,y), (x+w, y+h), (0, 255, 0), 2)
        frame2 = frame[y:y+h, x:x+w]
        cv.imshow('rostros2', frame2)
        frame2 = cv.resize(frame2, (100,100), interpolation = cv.INTER_AREA)

        #cv.imwrite('/Users/salme/FotosIA/gestos/tristeza/tristeza'+str(i)+ '.png', frame2)
        #cv.imwrite('/Users/salme/FotosIA/gestos/felicidad/felicidad'+str(i)+ '.png', frame2)
        #cv.imwrite('/Users/salme/FotosIA/gestos/sorpresa/sorpresa'+str(i)+ '.png', frame2)

        
    cv. imshow('rostros', frame)
    i=i+1
    k = cv.waitKey(1)
    if k == 27:
        break
cap.release()
cv.estryAllWindows()
```


Ahora esta parte del codigo lo que hace es entrenar el reconocmiento del tipo de gesto que se hace, mediante **LBPH**, esto puede tardar dependiendo de las imagenes, de la cantidad y del poder de nuestro computador

```
import cv2 as cv 
import numpy as np 
import os

dataSet = 'C:\\Users\\salme\\FotosIA\\gestos'
faces  = os.listdir(dataSet)
print(faces)

labels = []
facesData = []
label = 0 
for face in faces:
    facePath = dataSet+'\\'+face
    for faceName in os.listdir(facePath):
        labels.append(label)
        facesData.append(cv.imread(facePath+'\\'+faceName,0))
    label = label + 1
print(np.count_nonzero(np.array(labels)==0)) 

faceRecognizer = cv.face.LBPHFaceRecognizer_create()
faceRecognizer.train(facesData, np.array(labels))
faceRecognizer.write('gestosLBHFace.xml')
```

por ultimo esta parte del codigo va a abrir la camara de nuestro equipo y y reconocerá que tipo de emocion estamos expresando, dependiendo de nuestro dataset

```
import cv2 as cv
import os 

dataSet = 'C:\\Users\\salme\\FotosIA\\gestos'
faces  = os.listdir(dataSet)


#faceRecognizer = cv.face.FisherFaceRecognizer_create()
faceRecognizer = cv.face.LBPHFaceRecognizer_create()
faceRecognizer.read('gestosLBHFace.xml')



cap = cv.VideoCapture(0)
rostro = cv.CascadeClassifier('haarcascade_frontalface_alt2.xml')
while True:
    ret, frame = cap.read()
    if ret == False: break
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    cpGray = gray.copy()
    rostros = rostro.detectMultiScale(gray, 1.3, 3)
    for(x, y, w, h) in rostros:
        frame2 = cpGray[y:y+h, x:x+w]
        frame2 = cv.resize(frame2,  (100,100), interpolation=cv.INTER_CUBIC)
        result = faceRecognizer.predict(frame2)
        #cv.putText(frame, '{}'.format(result), (x,y-20), 1,3.3, (0,0,0), 1, cv.LINE_AA)
        if result[1] > 50:
            cv.putText(frame,'{}'.format(faces[result[0]]),(x,y-25),2,1.1,(0,255,0),1,cv.LINE_AA)
            cv.rectangle(frame, (x,y),(x+w,y+h),(0,255,0),2)
        else:
            cv.putText(frame,'Desconocido',(x,y-20),2,0.8,(0,0,255),1,cv.LINE_AA)
            cv.rectangle(frame, (x,y),(x+w,y+h),(0,0,255),2)
    cv.imshow('frame', frame)
    k = cv.waitKey(1)
    if k == 27:
        break
cap.release()
cv.destroyAllWindows()
```


---
---
---
# **PROYECTO 2 Wally**


Con esta primera parte del codigo se reesalan las imagenes a 50*50 (se puede cambiar) esto con el fin de que todas tengan la misma escala para que el cascade puede trabajar bien
```
import cv2 as cv
import numpy as np
img = cv.imread('/Users/salme/Downloads/wally/Wallyp153.jpg',1)
h,w = img.shape[:2]
print(h, w)
img2 = np.zeros((h*2, w*2) , dtype = "uint8")
print("Valores " + str(img.shape[:2]))     


img = cv.resize(img, (50,50), interpolation = cv.INTER_AREA)
cv.imwrite('/Users/salme/Downloads/wally/Wallyreescalado153.jpg', img)

cv.imshow('imagen', img)
cv.imshow('imagen2', img2)
cv.waitKey(0)
cv.destroyAllWindows()

```

este codigo se utiliza para rotar imagenes, uno decide que tanto se rotan com el incremento de **J**

```
import cv2 as cv
import numpy as np 
i=1081
j=0
img = cv.imread('/Users/salme/Downloads/wally/Wallyreescalado153.jpg')
h,w = img.shape[:2]

while True:

    mw = cv.getRotationMatrix2D((h//2, w//2),j,-1)
    img2 = cv.warpAffine(img,mw,(h,w))
    cv.imwrite('/Users/salme/Downloads/wally/imagenesrotacion/Wally'+str(i)+'p.jpg', img2)
    i=i+1
    j=j+1
    
    if j==360:
        break
cv.imshow('imagen1', img)
cv.imshow('imagen2', img2)

cv.waitKey(0)
cv.destroyAllWindows()
```

Por ultimo, este codigo busca a wally en la imagen que especifiquemos en *frame*

el archivo **cascade.xml** se crea con el programa cascade, en el cual se necesitan poner imagenes negativas y positivas de wally para entrenarlo.
```
import numpy as np
import cv2 as cv

# Cargar los clasificadores
#face_cascade = cv.CascadeClassifier('haarcascade_frontalface_alt2.xml')
wally_cascade = cv.CascadeClassifier('cascade1.xml')

# Leer la imagen
frame = cv.imread("/Users/salme/Downloads/imgs/bwally2.jpg")

# Convertir la imagen a escala de grises
gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)

# Detectar a Wally usando el clasificador en cascada
wallys = wally_cascade.detectMultiScale(gray, 1.3, 5)



# Dibujar rectángulos alrededor de las detecciones
for (x, y, w, h) in wallys:
    frame = cv.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

# Mostrar la imagen con las detecciones
cv.imshow('Deteccion', frame)
cv.waitKey(0)
cv.destroyAllWindows()
```

---
---
---

# **PROYECTO 3 Phaser**






- el siguiente codigo es del primer juego de phaser, el juego consiste en evitar 3 bala
- la primera parte del codigo sirve para importar las variables y los modelos, así como instanciarlos en el juego
- el personaje aprende de nosotros, dependiendo de lo que hagamos el va a aprender de nuestros movimientos, por eso es importante jugar bien para que aprenda bien
- el juego toma como variables la velocidad de las balas y la reaccion del personaje 

```
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

```

---
---
---

# **PROYECTO 4 Phaser 2**


- el siguiente phaser es el de rebotes.
- el personaje se puede mover libremente por todo el escenario libremente
- La bala en este caso rebota en el escenario, por lo que no se detiene y rebota indefinidamente hasta que el jugador pierde.
- si el jugador no se mueve el personaje no aprendera.
- el personaje recolecta datos de la distancia de el y la bala, y a partir de cierta distancia

```
var w = 400;
var h = 400;
var jugador;
var fondo;
var bala;
var VOLVIENDOV = false;
var VOLVIENDOH = false;

var cursors;
var menu;

var estatusIzquierda;
var estatusDerecha;
var estatusArriba;
var estatusAbajo;
var estatusMovimiento;
var nnNetwork , nnEntrenamiento, nnSalida, datosEntrenamiento=[];
var modoAuto = false, eCompleto=false;

var JX = 200;
var JY = 200;

var autoMode = false;
var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    juego.load.image('fondo', 'assets/game/fondomario.jpg');
    juego.load.spritesheet('mono', 'assets/sprites/mario1.png', 16, 32);
    juego.load.image('menu', 'assets/game/menu.png');
    juego.load.image('bala', 'assets/sprites/purple_ball.png');
}

function create() {
    juego.physics.startSystem(Phaser.Physics.ARCADE);
    juego.physics.arcade.gravity.y = 0; // No gravedad para permitir movimiento libre
    juego.time.desiredFps = 30;

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');
    jugador = juego.add.sprite(w / 2, h / 2, 'mono');

    juego.physics.enable(jugador);
    jugador.body.collideWorldBounds = true; // Evitar que el jugador salga de los limites del mundo NO MOVER JONATAHN!!!
    var corre = jugador.animations.add('corre', [0, 1, 2, 3]); 
    jugador.animations.play('corre', 10, true); 

    // Añadir la bala en la esquina superior derecha
    bala = juego.add.sprite(0, 0, 'bala');
    juego.physics.enable(bala);
    bala.body.collideWorldBounds = true; // Evitar que la bala salga de los límites del mundo
    bala.body.bounce.set(1); // Hacer que la bala rebote
    setRandomBalaVelocity(); // Establecer una velocidad inicial aleatoria para la bala

    // Añadir texto de pausa
    pausaL = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausaL.inputEnabled = true;
    pausaL.events.onInputUp.add(pausa, self);
    juego.input.onDown.add(mPausa, self);

    // Creación de teclas de dirección
    cursors = juego.input.keyboard.createCursorKeys();

    //
    
    nnNetwork =  new synaptic.Architect.Perceptron(3, 6, 6, 6, 5);
    nnEntrenamiento = new synaptic.Trainer(nnNetwork);
}


function enRedNeural(){
    nnEntrenamiento.train(datosEntrenamiento, {rate: 0.0003, iterations: 10000, shuffle: true});
}


function datosVertical(param_entrada){
    console.log("Entrada",param_entrada[0]+" "+param_entrada[1]+" "+param_entrada[2]+" "+param_entrada[3]+" "+param_entrada[4]);
    nnSalida = nnNetwork.activate(param_entrada);
    var Izq =Math.round( nnSalida[0]*100 );
    var Der =Math.round( nnSalida[1]*100 );
    var Arr =Math.round( nnSalida[2]*100 );
    var Aba =Math.round( nnSalida[3]*100 );
    var xde =Math.round( nnSalida[4]*100 );
        if(param_entrada[2] < 80){
            if(Arr > 40 && Arr < 60){
                return false;    
            }
        }
        
        console.log("\n En la estatusArriba %: " + nnSalida[2]*100 
                +"\n En la estatusAbajo %: " + nnSalida[3]*100 
                +"\n En la estatusIzq %: " + nnSalida[0]*100  
                +"\n En la estatusDer %: " + nnSalida[1]*100 
                +"\n En movimiento %: " + nnSalida[4]*100 
            );
        console.log("OUTPUTS: "+ nnSalida[2]>=nnSalida[3])
    return nnSalida[2]>=nnSalida[3];
}

function datosHorizontal(param_entrada){
    console.log("Entrada",param_entrada[0]+" "+param_entrada[1]+" "+param_entrada[2]+" "+param_entrada[3]+" "+param_entrada[4]);
    nnSalida = nnNetwork.activate(param_entrada);
    var Izq =Math.round( nnSalida[0]*100 );
    var Der =Math.round( nnSalida[1]*100 );
    var Arr =Math.round( nnSalida[2]*100 );
    var Aba =Math.round( nnSalida[3]*100 );
    var xde =Math.round( nnSalida[4]*100 );
        if(param_entrada[2] < 80){
            if(Der > 40 && Der < 60){
                return false;    
            }
        }
        
        console.log("\n En la estatusArriba %: " + nnSalida[2]*100 
                +"\n En la estatusAbajo %: " + nnSalida[3]*100 
                +"\n En la estatusIzq %: " + nnSalida[0]*100  
                +"\n En la estatusDer %: " + nnSalida[1]*100 
                +"\n En movimiento %: " + nnSalida[4]*100
            );
        console.log("OUTPUTS: "+ nnSalida[2]>=nnSalida[3])
    return nnSalida[0]>=nnSalida[1];
}
//moviminentos mario
function datosMovimiento(param_entrada){
    console.log("Entrada",param_entrada[0]+" "+param_entrada[1]+" "+param_entrada[2]+" "+param_entrada[3]+" "+param_entrada[4]);
    nnSalida = nnNetwork.activate(param_entrada);
    var Izq =Math.round( nnSalida[0]*100 );
    var Der =Math.round( nnSalida[1]*100 );
    var Arr =Math.round( nnSalida[2]*100 );
    var Aba =Math.round( nnSalida[3]*100 );
    var xde =Math.round( nnSalida[4]*100 );
        if(param_entrada[2] < 80){
            if(Der > 40 && Der < 60){
                return false;    
            }
        }
        
        console.log("\n En la estatusArriba %: " + nnSalida[2]*100 
                +"\n En la estatusAbajo %: " + nnSalida[3]*100 
                +"\n En la estatusIzq %: " + nnSalida[0]*100  
                +"\n En la estatusDer %: " + nnSalida[1]*100 
                +"\n La disque desta %: " + nnSalida[4]*100
            );
        console.log("OUTPUTS: "+ nnSalida[2]>=nnSalida[3])
    return nnSalida[4]*100>=20;
}
function pausa() {
    juego.paused = true; // Pausar el juego
    menu = juego.add.sprite(w / 2, h / 2, 'menu'); // Añadir menú de pausa
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
            resetGame(); // Resetear el juego
            juego.paused = false;
        }
    }
}

function resetGame() {
    // jugador
    jugador.x = w / 2;
    jugador.y = h / 2;
    jugador.body.velocity.x = 0;
    jugador.body.velocity.y = 0;

    bala.x = 0;
    bala.y = 0;
    setRandomBalaVelocity(); // Establecer una velocidad inicial aleatoria para la bala
}

function setRandomBalaVelocity() {
    var speed = 300;
    var angle = juego.rnd.angle(); 
    bala.body.velocity.set(Math.cos(angle) * speed, Math.sin(angle) * speed); //establece velocidad y angulo de la bala
}

function update() {
    fondo.tilePosition.x -= 1; 


    if (!autoMode) {
        // Resetear velocidad del jugador
        jugador.body.velocity.x = 0;
        jugador.body.velocity.y = 0;

        // Movimiento del jugador con teclas de dirección
        if (cursors.left.isDown) {
            jugador.body.velocity.x = -200; // Mover a la izquierda
        } else if (cursors.right.isDown) {
            jugador.body.velocity.x = 200; // Mover a la derecha
        }

        if (cursors.up.isDown) {
            jugador.body.velocity.y = -200; // Mover hacia arriba
        } else if (cursors.down.isDown) {
            jugador.body.velocity.y = 200; // Mover hacia abajo
        }
    } 

   

    // Colisionar la bala con el jugador
    juego.physics.arcade.collide(bala, jugador, colisionH, null, this);

    // Calcular la distancia entre la bala y el jugador
    var dx = bala.x - jugador.x;
    var dy = bala.y - jugador.y;
    var distancia = Math.sqrt(dx * dx + dy * dy); // Fórmula de distancia euclidiana, verifica las coordenadas x,y



    //bala respecto a jugador
    estatusIzquierda = 0;
    estatusDerecha = 0;
    estatusArriba = 0;
    estatusAbajo = 0;
    estatusMovimiento = 0;


    if(!autoMode) {
        // Si la bala está a la derecha, moverse a la izquierda, y viceversa
        if (dx > 0) {
            estatusIzquierda = 1;
            estatusMovimiento = 1;
        } else {
            estatusDerecha = 1 // Mover a la derecha
        }
    
        // Si la bala está abajo, moverse hacia arriba, y viceversa
        if (dy > 0) {
            estatusArriba = 1; // Mover hacia arriba
        } else {
            estatusAbajo = 1; // Mover hacia abajo
        }


        if(jugador.body.velocity.x != 0 || jugador.body.velocity.y != 0) {
            estatusMovimiento = 1;
        }else{
            estatusMovimiento = 0;
        }
    }

    
    console.log("DATOS MOVIMIENTO: "+ datosMovimiento([dx, dy, distancia, JX, JY]));
    if(autoMode && datosMovimiento([dx, dy, distancia, JX, JY])) {


        if(distancia <=150){
        // Si la bala está abajo, moverse hacia arriba, y viceversa
        console.log("RETURN DEL METODO VERTICAL: " + datosVertical([dx, dy, distancia, JX, JY])
                 +"\nRETURN DEL METODO HORIZONTAL: " + datosHorizontal([dx, dy, distancia, JX, JY]));

        if (datosVertical([dx, dy, distancia, JX, JY]) && !VOLVIENDOV) {
            // Mover hacia arriba si datosVertical es true
            jugador.body.velocity.y -= 35;
            console.log("ARRIBA");
        } else if (!datosVertical([dx, dy, distancia, JX, JY]) && !VOLVIENDOV && distancia <= 95){
            // Mover hacia abajo si datosVertical es false
            jugador.body.velocity.y += 35;
            console.log("ABAJO");
        } 

        if (datosHorizontal([dx, dy, distancia, JX, JY]) && !VOLVIENDOH) {
            // Mover hacia arriba si datosHorizontal es true
            jugador.body.velocity.x -= 35;
            console.log("IZQUIERDA");
        } else if (!datosHorizontal([dx, dy, distancia, JX, JY]) && !VOLVIENDOH && distancia <= 95){
            // Mover hacia abajo si datosHorizontal es false
            jugador.body.velocity.x += 35;
            console.log("DERECHA");
        }


    
            // Ajustar la velocidad para que vuelva lentamente al centro si no está en movimiento
            if (jugador.x > 300) {
                jugador.body.velocity.x = -250; // Mover lentamente hacia arriba
                console.log("VOLVIENDOH AL CENTRO HACIA LA IZQUIERDA");
                VOLVIENDOH = true;
            } else if (jugador.x < 100) {
                jugador.body.velocity.x = 250; // Mover lentamente hacia abajo
                console.log("VOLVIENDOH AL CENTRO HACIA LA DERECHA");
                VOLVIENDOH = true;
            } else if(VOLVIENDOH && jugador.x > 150 && jugador.x < 250) {
                jugador.body.velocity.x = 0;
                VOLVIENDOH = false;
            } else if(datosHorizontal([dx, dy, distancia, JX, JY]) && jugador.body.velocity.x != 0){
                VOLVIENDOH = false;
                VOLVIENDOV = false;
            }


            // Ajustar la velocidad para que vuelva lentamente al centro si no está en movimiento
            if (jugador.y > 300) {
                jugador.body.velocity.y = -250; // Mover lentamente hacia arriba
                console.log("VOLVIENDOV AL CENTRO HACIA ARRIBA");
                VOLVIENDOV = true;
            } else if (jugador.y < 100) {
                jugador.body.velocity.y = 250; // Mover lentamente hacia abajo
                console.log("VOLVIENDOV AL CENTRO HACIA ABAJO");
                VOLVIENDOV = true;
            } else if(VOLVIENDOV && jugador.y > 150 && jugador.y < 250) {
                jugador.body.velocity.y = 0;
                VOLVIENDOV = false;
            } else if(datosVertical([dx, dy, distancia, JX, JY]) && jugador.body.velocity.y != 0){
                VOLVIENDOH = false;
                VOLVIENDOV = false;
                VOLVIENDOH = false;
                VOLVIENDOV = false;
            }
            
        }else if (distancia >= 200){
            jugador.body.velocity.y = 0;
            jugador.body.velocity.x = 0;

        }

    }

   

    if( modoAuto ==false  && bala.position.x > 0 ){
        JX = jugador.x;
        JY = jugador.y;

        datosEntrenamiento.push({
                'input' :  [dx , dy, distancia, JX, JY ],
                'output':  [estatusIzquierda , estatusDerecha, estatusArriba, estatusAbajo, estatusMovimiento]  
        });

        console.log(
                    "DX: ", dx + "\n"+
                    "DY: ", dy + "\n"+
                    "D: ", distancia + "\n"+
                    "JX: ", jugador.x + "\n"+
                    "JY: ", jugador.y + "\n"+
                    "BX: ", bala.x + "\n"+
                    "BY: ", bala.y + "\n"
                );
        console.log(
                    "estatusIzquierda: ", estatusIzquierda + "\n"+
                    "estatusDerecha: ", estatusDerecha + "\n"+
                    "estatusArriba: ", estatusArriba + "\n"+
                    "estatusAbajo: ", estatusAbajo + "\n"+
                    "estatusMovimiento: ", estatusMovimiento + "\n"
                );
   }

    // Mostrar en consola la distancia, el cuadrante y las coordenadas relativas
   // console.log('Distancia: ' + distancia.toFixed(2) + ', \nCuadrante: ' + cuadrante + ', \ndx: ' + dx.toFixed(2) + ', dy: ' + dy.toFixed(2));
}



function colisionH() {
    autoMode = true; // Activar el modo automático tras la colisión
    pausa(); // Pausar el juego en caso de colisión
}

function render() {
    // Opcionalmente, renderizar el estado del juego o información adicional
}

```

---
---
---
# **PROYECTO 5 CNN**

Este CNN entrena sobre distintos acontecimientos mediante imagenes dadas en un dataset, los cuales son:

1. Incendios
2. Tornados
3. Asaltos
4. Robo a casa habitación
5. Inundaciones

Despues de entrenar el dataset se da una imagen para que el CNN diga que tipo de acontecimiento es

## importar librerias

```
import numpy as np
import os
import re
import matplotlib.pyplot as plt
%matplotlib inline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
```


```
import keras
import tensorflow as tf
from tensorflow.keras.utils import to_categorical
from keras.models import Sequential,Model
from tensorflow.keras.layers import Input
from keras.layers import Dense, Dropout, Flatten
#from keras.layers import Conv2D, MaxPooling2D
#from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (
    BatchNormalization, SeparableConv2D, MaxPooling2D, Activation, Flatten, Dropout, Dense, Conv2D
)
from keras.layers import LeakyReLU
```

## Cargar set de imagenes

```
dirname = os.path.join(os.getcwd(), r'C:/Users/salme/FotosIA/Incidentes')
imgpath = dirname + os.sep 
images = []
directories = []
dircount = []
prevRoot=''
cant=0

print("leyendo imagenes de ",imgpath)

for root, dirnames, filenames in os.walk(imgpath):
    for filename in filenames:
        if re.search("\.(jpg|jpeg|png|bmp|tiff)$", filename):
            cant=cant+1
            filepath = os.path.join(root, filename)
            image = plt.imread(filepath)
            if(len(image.shape)==3):
                
                images.append(image)
            b = "Leyendo..." + str(cant)
            print (b, end="\r")
            if prevRoot !=root:
                print(root, cant)
                prevRoot=root
                directories.append(root)
                dircount.append(cant)
                cant=0
dircount.append(cant)

dircount = dircount[1:]
dircount[0]=dircount[0]+1
print('Directorios leidos:',len(directories))
print("Imagenes en cada directorio", dircount)
print('suma Total de imagenes en subdirs:',sum(dircount))
```

## Creamos etiquetas

```
labels=[]
indice=0
for cantidad in dircount:
    for i in range(cantidad):
        labels.append(indice)
    indice=indice+1
print("Cantidad etiquetas creadas: ",len(labels))
```

```
deportes=[]
indice=0
for directorio in directories:
    name = directorio.split(os.sep)
    print(indice , name[len(name)-1])
    deportes.append(name[len(name)-1])
    indice=indice+1
```

```
y = np.array(labels)
X = np.array(images, dtype=np.uint8) #convierto de lista a numpy

# Find the unique numbers from the train labels
classes = np.unique(y)
nClasses = len(classes)
print('Total number of outputs : ', nClasses)
print('Output classes : ', classes)
```

## Creamos Sets de entrenamiento y Test

```
train_X,test_X,train_Y,test_Y = train_test_split(X,y,test_size=0.2)
print('Training data shape : ', train_X.shape, train_Y.shape)
print('Testing data shape : ', test_X.shape, test_Y.shape)
```

```
plt.figure(figsize=[5,5])

# Display the first image in training data
plt.subplot(121)
plt.imshow(train_X[0,:,:], cmap='gray')
plt.title("Ground Truth : {}".format(train_Y[0]))

# Display the first image in testing data
plt.subplot(122)
plt.imshow(test_X[0,:,:], cmap='gray')
plt.title("Ground Truth : {}".format(test_Y[0]))
```

## Procesamos las imagenes

```
train_X = train_X.astype('float32')
test_X = test_X.astype('float32')
train_X = train_X/255.
test_X = test_X/255.
plt.imshow(test_X[0,:,:])
```

## Hacemos el One-hot Encoding para la red

```
# Change the labels from categorical to one-hot encoding
train_Y_one_hot = to_categorical(train_Y)
test_Y_one_hot = to_categorical(test_Y)

# Display the change for category label using one-hot encoding
print('Original label:', train_Y[0])
print('After conversion to one-hot:', train_Y_one_hot[0])
```

## Creamos el Set de Entrenamiento y Validación

```
#Mezclar todo y crear los grupos de entrenamiento y testing
train_X,valid_X,train_label,valid_label = train_test_split(train_X, train_Y_one_hot, test_size=0.2, random_state=13)
```

```
print(train_X.shape,valid_X.shape,train_label.shape,valid_label.shape)
```

## Creamos el modelo de CNN

```
#declaramos variables con los parámetros de configuración de la red
INIT_LR = 1e-3 # Valor inicial de learning rate. El valor 1e-3 corresponde con 0.001
epochs = 20 # Cantidad de iteraciones completas al conjunto de imagenes de entrenamiento
batch_size = 64 # cantidad de imágenes que se toman a la vez en memoria
```


```
#declaramos variables con los parámetros de configuración de la red
INIT_LR = 1e-3 # Valor inicial de learning rate. El valor 1e-3 corresponde con 0.001
epochs = 20 # Cantidad de iteraciones completas al conjunto de imagenes de entrenamiento
batch_size = 64 # cantidad de imágenes que se toman a la vez en memoria
```


```
sport_model = Sequential()
sport_model.add(Conv2D(32, kernel_size=(3, 3),activation='linear',padding='same',input_shape=(30,30,3)))
sport_model.add(LeakyReLU(alpha=0.1))
sport_model.add(MaxPooling2D((2, 2),padding='same'))
sport_model.add(Dropout(0.5))
sport_model.add(Flatten())
sport_model.add(Dense(32, activation='linear'))
sport_model.add(LeakyReLU(alpha=0.1))
sport_model.add(Dropout(0.5))
sport_model.add(Dense(nClasses, activation='softmax'))
```

```
sport_model.summary()
```

```
sport_model.compile(loss=keras.losses.categorical_crossentropy, optimizer=tf.keras.optimizers.SGD(learning_rate=INIT_LR), metrics=['accuracy'])
```

## Entrenamos el modelo: Aprende a clasificar imágenes

```
# este paso puede tomar varios minutos, dependiendo de tu ordenador, cpu y memoria ram libre
sport_train = sport_model.fit(train_X, train_label, batch_size=batch_size,epochs=epochs,verbose=1,validation_data=(valid_X, valid_label))
```


```
sport_model.save(r"C:/Users/salme/FotosIA/keras/red.keras")
```

## Evaluamos la Red

```
test_eval = sport_model.evaluate(test_X, test_Y_one_hot, verbose=1)
```

```
print('Test loss:', test_eval[0])
print('Test accuracy:', test_eval[1])
```

```
sport_train.history
```

```
accuracy = sport_train.history['accuracy']
val_accuracy = sport_train.history['val_accuracy']
loss = sport_train.history['loss']
val_loss = sport_train.history['val_loss']
epochs = range(len(accuracy))
plt.plot(epochs, accuracy, 'bo', label='Training accuracy')
plt.plot(epochs, val_accuracy, 'b', label='Validation accuracy')
plt.title('Training and validation accuracy')
plt.legend()
plt.figure()
plt.plot(epochs, loss, 'bo', label='Training loss')
plt.plot(epochs, val_loss, 'b', label='Validation loss')
plt.title('Training and validation loss')
plt.legend()
plt.show()
```

```
predicted_classes2 = sport_model.predict(test_X)
```

```
predicted_classes=[]
for predicted_sport in predicted_classes2:
    predicted_classes.append(predicted_sport.tolist().index(max(predicted_sport)))
predicted_classes=np.array(predicted_classes)
```

```
predicted_classes.shape, test_Y.shape
```

## Aprendamos de los errores: Qué mejorar

```
correct = np.where(predicted_classes==test_Y)[0]
print("Found %d correct labels" % len(correct))
for i, correct in enumerate(correct[0:9]):
    plt.subplot(3,3,i+1)
    plt.imshow(test_X[correct].reshape(30,30,3), cmap='gray', interpolation='none') #CAMBIAR
    plt.title("{}, {}".format(deportes[predicted_classes[correct]],
                                                    deportes[test_Y[correct]]))

    plt.tight_layout()
```

```
incorrect = np.where(predicted_classes!=test_Y)[0]
print("Found %d incorrect labels" % len(incorrect))
for i, incorrect in enumerate(incorrect[0:9]):
    plt.subplot(3,3,i+1)
    plt.imshow(test_X[incorrect].reshape(30,30,3), cmap='gray', interpolation='none')  #CAMBIAR
    plt.title("{}, {}".format(deportes[predicted_classes[incorrect]],
                                                    deportes[test_Y[incorrect]]))
    plt.tight_layout()
```

```
target_names = ["Class {}".format(i) for i in range(nClasses)]
print(classification_report(test_Y, predicted_classes, target_names=target_names))

#nos da la precision de cada clase, algunos esta alto y otros bajos, puede ser porque se tienen pocos ejemplos de ciertas situaciones. 
```

## filename es la ruta de la imagen que se leera

```
from skimage.transform import resize

images=[]
filenames = [r'C:\\Users\\salme\\FotosIA\\incendio1.jpg']

for filepath in filenames:
    image = plt.imread(filepath,0)
    image_resized = resize(image, (30, 30),anti_aliasing=True,clip=False,preserve_range=True) #CAMBIAR TIENEN Q COINCIDIR CON EL TAMAÑO DE PIXELES.
    images.append(image_resized)

X = np.array(images, dtype=np.uint8) #convierto de lista a numpy
test_X = X.astype('float32')
test_X = test_X / 255.
 
predicted_classes = sport_model.predict(test_X) #MODELO, no se carga archivo .h5 .keras, agarra IMG, de las que no tiene y retorna clase a la que pertenece.

for i, img_tagged in enumerate(predicted_classes):
    print(filenames[i], deportes[img_tagged.tolist().index(max(img_tagged))])
```