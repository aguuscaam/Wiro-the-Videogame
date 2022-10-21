
////////////////////VARIABLES//////////////////////////

//Canvas
var canvas;
var ctx;

//Globales
var fuente = new FontFace('Pixeled', "url(fonts/Pixeled.ttf) format('truetype')");
document.fonts.add(fuente);
var velocidad = 5;
var gravedad = 0.6;

//Para el juego
var puntos = 0;
var vidas = 3;
var tiempoJuego;
var velMovimiento=1

//Teclas
var teclaAtaque = false;
var teclaSalto;
var teclaAgachar = false;

//Para color de botón
var colorBoton="white";
var volverAJugarBoton=false;

//Para imagenes
var imgWiro = new Image();
var imgEnemy = new Image();
var imgAlmas = new Image();

//Para el fondo
var posicionFondo = 0;
var posPantallas=0;

//Para saber si el juego está inciado o no
var inicio = false;

//Para saber si es la pantalla de instrucciones
var instrucciones = false;

//para audios
var musicMain;
var audioPuntos;
var audioPerdida;
var audioFinal;
var audioRevive;

//Variables iniciales del PJ
var posXPj = 100;
var posYPj = 100;
var anchoInicial = 180;
var altoInicial = 180;

//Crear objetos
var wiro = new Personaje(posXPj, posYPj, anchoInicial, altoInicial);
var almasUno = new Elemento(850, 100, 50, 50, "almas");
var enemyUno = new Elemento(1100, 300, 80, 80, "enemy");

//Música
musicMain=new Audio();
musicMain.src="audio/music_main.mp3";
audioPuntos=new Audio();
audioPuntos.src="audio/fx_alma.mp3";
audioPerdida=new Audio();
audioPerdida.src="audio/fx_enemigo.mp3";
audioFinal=new Audio();
audioFinal.src="audio/wiro_muere.mp3";
audioRevive=new Audio();
audioRevive.src="audio/fx_level-up.mp3";

//Para la animación de Wiro
var imgWiroQuieto;
var imgWiroCaminata;
imgWiroQuieto = new Image();
imgWiroCaminata = new Image();
var presionado = false;

////////////////////////////////////////////////////

//Trae elementos

window.onload = function(){ 
    dibujarCanvas();
    fuente;
}

//Funcion para el canvas
function dibujarCanvas(){
    canvas=document.getElementById("canvas");
    ctx=canvas.getContext('2d');
    canvas.style.backgroundImage = "url(img/cueva.jpg)";
  pantallaInicio();
}

//Funcion Jugar
function jugar(){
    canvas.style.backgroundImage = "url(img/cueva.jpg)";
    //Indico que el juego está iniciado
	inicio=true; 

	//Inicializo los Audios
    musicMain.play();

    //Wiro
    imgWiro.src = "img/wiro-quieto.png";
    imgWiro.onload = function(){
        wiro.dibujar();
    }

    //Texto
    dibujarTexto();
    
    //Almas
    imgAlmas.src = "img/almas.png";
    imgAlmas.onload = function(){
        almasUno.dibujar(imgAlmas);
    }

    //Enemigos
    imgEnemy.src = "img/enemigo.png";
    imgEnemy.onload = function(){
        enemyUno.dibujar(imgEnemy);
    }

//Intervalo
tiempoJuego=setInterval(function(){
if(vidas>0){
    if(puntos<=250){
            

            /*logica salto*/
            wiro.velocidad += gravedad;
            wiro.y += wiro.velocidad;
            /*si el personaje está tocando el piso
            altura entre personaje y pis*/
            if(wiro.y > 520 - wiro.alto){
               wiro.velocidad = 0;
                wiro.y = 520 - wiro.alto;
                wiro.saltando = false;
            }
            
            /*evaluar si toca el piso o un tile*/
			if (wiro.y > 520 - wiro.alto) {
				frenarSalto(335);
			}else if(wiro.y > 312 - wiro.alto&&wiro.velocidad>=0.5 &&wiro.x>70&&wiro.x<200){
				frenarSalto(335);
			}else if(wiro.y > 312 - wiro.alto&& wiro.y<312 &&wiro.velocidad>=0 && wiro.x>280&&wiro.x<390){
				frenarSalto(335);
		
			}
            //Ver si colisionaron con el personaje

            enemyUno.colision();
            almasUno.colision();
             //Hacerlos mover
            enemyUno.mover();
            almasUno.mover();
         

            //Redibujar todo
            borrar();
            wiro.dibujar();
            dibujarTexto();
            almasUno.dibujar(imgAlmas);
            enemyUno.dibujar(imgEnemy);
            

    }else{ 
        //pantallas de ganar/perder

        borrar();
        pantallaFinal();
        }
    }else{
        borrar();
      pantallaPerder();
   
    }
    },1000/25);
    
}
//funciones de freno o fin
function frenarSalto(ubicacionY){
    wiro.velocidad = 0;
     wiro.y = ubicacionY - wiro.alto;
     wiro.saltando = false;
 
 } 
 
 function frenarMusica(){
         musicMain.pause();
         musicMain.currentTime=0;
     }

function termina(){
        clearInterval(tiempoJuego);
}


//Atributos Wiro
function Personaje(x, y, ancho, alto){
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.velocidad = 0;
    this.saltando = false;

//Metodos Personaje Wiro
    this.dibujar = function(){
        ctx.drawImage(imgWiro, this.x, this.y, this.ancho, this.alto);
    }
    
    this.arriba = function(){
        if(this.y > 250){
            this.y -= 60;
            this.x += 30;
        }
    }

    this.agachar = function(){
        this.alto = 90;
        this.y = 350;
    }

    this.atacar = function(){
  
        imgWiro.src = "img/wiro-atk.png";
        console.log("ataque");
       


  }
    this.saltar=function(){
        if(this.saltando == false){
            this.saltando = true;
            this.velocidad -= velocidad * 3;
        }else{
            if(this.y == 340){
                this.saltando = false;
                this.velocidad = 3;
            }
        }
    }

    this.irDerecha = function(){
        if(this.x < (800-this.ancho)){
        this.x+=10;
        posicionFondo-=5;
        }
    }

    this.irIzquierda = function(){
        if(this.x > 0){
        this.x-=10;
        posicionFondo+=5;
        }
    }
}

//Elementos:almas/enemigos
function Elemento(x,y,ancho,alto,tipo){
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.tipo = tipo;
    this.dibujar = function(img){
        ctx.drawImage(img, this.x, this.y, this.ancho, this.alto);
    }
   
    this.mover = function(){
     
 if(puntos>=0 &&puntos<100){  
        if(this.x >- 15){
            this.x -= 15;
        }else{
            this.sortear();
        
        }

} else if(puntos>=100&&puntos<200){
    if(this.x >- 25){
        this.x -= 25;
    }else{
        this.sortear();
    
    }
    
}else if (puntos>=200){
    if(this.x >- 35){
        this.x -= 35;
    }else{
        this.sortear();
    
    }
    
}

}
    this.caer = function(){
        if(this.y < 600){
            this.y += 2;
        }else{
            this.sortear();

        }
    }
//  Sortear la posición de los elementos
    this.sortear = function(){
        //Math.floor(Math.random() * (max - min + 1))+ min;
        //rango de x, maximo 1400, minimo 850
        this.x = Math.floor(Math.random()*(1400-800+1))+800;

        //rango de y, maximo 450, minimo 320
        this.y = Math.floor(Math.random()*(450-10+1))+10;
    
}
    
 // Colisión   
    this.colision = function(){
        if(
            (this.x < wiro.x + wiro.ancho)
            &&(this.x > wiro.x - this.ancho)
            &&(this.y > wiro.y - this.alto)
            &&(this.y < wiro.y + wiro.alto)
        ){
            if(this.tipo == "almas"){
                puntos += 10;
                
                audioPuntos.play();
            }else if(teclaAtaque == true){
                this.tipo == "enemy"
                puntos += 10;
                audioPuntos.play();
            }else{
                vidas --;
                
                audioPerdida.play();
            }
            this.sortear();
            
        }
    }
}
//Pantallas

function pantallaFinal(){
    
    ctx.font = "60px Pixeled";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Ganaste", 200, 280)
    
    volverAJugarBoton=true;
    ctx.font = "30px Pixeled";
    ctx.fillText('Volver a jugar', 230,400);
    frenarMusica();

}
function dibujarTexto(){
    ctx.font = "20px Pixeled";
    ctx.fillStyle = "#ffffff";
    //fillText, recibe 3 valores, el texto, posX y posY
    ctx.fillText("Almas: "+puntos,20,40);
    ctx.fillText("Vidas: "+vidas,615,40);
}

function pantallaInicio(){
    borrar();
    canvas.style.backgroundImage = "url(img/inicio.jpg)";
    canvas.style.backgroundPosition=posPantallas + "0px 0px";
    ctx.font = "40px Pixeled";
    ctx.fillStyle = colorBoton;
    ctx.fillText('INICIAR', 312,370);
}

function pantallaInstrucciones(){
    borrar();
    canvas.style.backgroundImage="url(img/tutorial.jpg)";
    canvas.style.backgroundPosition=posPantallas+"0px 0px";
    ctx.font="30px Pixeled";
	ctx.fillStyle = colorBoton;
	ctx.fillText('JUGAR', 310,350);
}

function pantallaPerder(){

    ctx.font = "60px Pixeled";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("FIN", 320, 280);

    ctx.font = "20px Pixeled";
    ctx.fillStyle = "#12c2e9";
    ctx.fillText("PUNTAJE  ", 260, 340);

    ctx.font = "50px Pixeled";
    ctx.fillStyle = "#f64f59";
    ctx.fillText(+puntos, 430, 345);
    
    ctx.fillStyle = colorBoton;
    ctx.font = "30px Pixeled";
    ctx.fillText('REINICIAR', 285,400);
    frenarMusica();

}


//Función de borrar

function borrar(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
}


//Eventos

document.addEventListener("keydown",function(e){
	if(vidas > 0 || puntos>=250){
		switch(e.keyCode){
			case 65: // tecla A
				wiro.irIzquierda();
                presionado = true;
		break;

			case 68: //tecla D
				wiro.irDerecha();
                presionado = true;
		break;
			case 87: //tecla W
			  //wiro.saltar();
			 if(!teclaAgachar){
				wiro.saltar(); 
			 }
		break;

			case 32 : //barra espaciadora
			  if(!teclaAgachar){
				  wiro.atacar();
				teclaAtaque = true;
			}
		break; 
		 
			case 83:
			if(!teclaAtaque){
			 teclaAgachar=true;
			wiro.agachar();
            }
		break;
	}
}    
    
    canvas.style.backgroundPosition = posicionFondo + "px 0px";

});


//Para que caiga después de saltar

document.addEventListener("keyup",function(e){
	
	if(vidas > 0 || puntos>=250){
		if(e.keyCode == 86){
			teclaSalto = false;
		}
		if(e.keyCode == 32){
			teclaAtaque = false;
			imgWiro.src = "img/wiro.png";
		}
		if(e.keyCode == 83){
			wiro.alto = altoInicial;
			wiro.y = posYPj;
			teclaAgachar=false;
		}
	}
})


//Para que vuelva de la animación al sprite fijo

document.addEventListener("keyup",function(e){
    switch(e.keyCode){
        case 65: // tecla A
            presionado = false;
    break;
        case 68: //tecla D
            presionado = false;
    break;
    }
});


//Reinicio de juego
document.addEventListener('click',function(e){

	//Acá evaluo en función de vidas y de la variable inicio, si estoy al principio o al final del juego
	if(vidas == 0 || puntos>=250){
		if(e.x> 100 && e.x < 500 && e.y > 300 && e.y < 420){
           
			vidas = 3;
			puntos = 0;
            posXPj = 100;
            posYPj = 100;
            wiro = new Personaje(posXPj, posYPj, anchoInicial, altoInicial);
            enemyUno=new Elemento (1100, 300, 80, 80, "enemy");
            almasUno=new Elemento (850, 100, 50, 50, "almas");
            dibujarTexto();
            frenarMusica();
            audioRevive.play();
            termina(); //sino acelera el movimiento al reiniciar //pero no funca u.u
            jugar();
             
		} 
	}

    if(inicio == false){
      
        if(instrucciones == false){
            instrucciones = true;
            pantallaInstrucciones();
            
        }else {
            borrar();
            jugar();
            console.log("jugar");
           
        }
    }
});


document.addEventListener('mousemove',function(e){
	//si está al final o al principio del juego:
	if(vidas == 0 || inicio == false){
		if(e.x > 290 && e.x < 550 && e.y > 300 && e.y < 420){
                ctx.font = "20px Pixeled";
				canvas.style.cursor = "pointer";
				colorBoton = "red";

		}else{
			canvas.style.cursor = "";
			colorBoton = "white";
		}
		//y si es al principio, hago que redibuje el botón de inicio.
		if(inicio == false){
           
            if(instrucciones == false){
                pantallaInicio();
            }
        }
    }
});


document.addEventListener('click',function(e){

	//Acá evaluo en función de vidas y de la variable inicio, si estoy al principio o al final del juego
    if(volverAJugarBoton == true){
        volverAJugarBoton = true;
        borrar()
        
        if(pantallaInicio()){
            
        }else{
            borrar()
            jugar()
        }    
    }
});


document.addEventListener('mousemove',function(e){

	//si está al final o al principio del juego:
    if(puntos == 250 ){
		if(e.x > 290 && e.x < 550 && e.y > 300 && e.y < 420){	
	            ctx.font = "20px Pixeled";
				canvas.style.cursor = "pointer";
				colorBoton = "red";

		}else{
			canvas.style.cursor = "";
			colorBoton = "white";
        }
    }
});


//Animación Wiro

var wiroQuieto = new Sprite(150,150,1,1);
var wiroCaminata = new Sprite(800,100,8,1); //ancho de la imagen, alto de la imagen,velocidad (a unos, a doces, etc...)

function dibujar(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
	
    imgWiroQuieto.src = "img/wiro-quieto.png";
    imgWiroCaminata.src = "img/wiro-walk.png";

    imgWiroQuieto.onload = function(){
        wiroQuieto.dibujar(imgWiroQuieto);
    }
    /*imgWiroCaminata.onload=function(){
        wiroCaminata.dibujar(imgWiroCaminata);
    }*/
    
    setInterval(function(){
        if (!presionado){
            borrar();
            wiroQuieto.dibujar(imgWiroQuieto);
        }else {
            dibujarWiroCaminata();
        }
  
    },1000/25);
}

function borrar(){
    canvas.width = 800;
    canvas.heigth = 600;
}

function Sprite(ancho, alto, fotogramasTotales,tiempoPorFotograma){
    this.ancho = ancho;
    this.alto = alto;
    this.fotogramasTotales = fotogramasTotales;
    this.tiempoPorFotograma = tiempoPorFotograma;
    this.contador = 0;
    this.fotogramaActual = 0;

    this.actualizar = function () {

        this.contador += 1;

        if (this.contador > tiempoPorFotograma) {

            this.contador = 0;
            
            // va pasando de fotogramas
            if (this.fotogramaActual < fotogramasTotales - 1) {	
                //ir al fotograma siguiente
                this.fotogramaActual += 1;
            } else {
                //sino el siguiente es el primer fotograma
                this.fotogramaActual = 0;
        }
    }
}

    this.dibujar = function (img) {
      ctx.drawImage(
        img,
        this.fotogramaActual * this.ancho / this.fotogramasTotales,
        0,
        this.ancho / this.fotogramasTotales,
        this.alto,
        0,
        0,
        this.ancho / this.fotogramasTotales,
        this.alto);
    }
}

function dibujarWiroCaminata(){
    imgWiroCaminata.onload = function(){
        wiroCaminata.dibujar(imgWiroCaminata);
        }
        borrar();
        wiroCaminata.actualizar();
        wiroCaminata.dibujar(imgWiroCaminata);
}

document.addEventListener("keydown",function(e){
    switch(e.keyCode){
        case 65: // tecla A
            presionado = true;
    break;
        case 68: //tecla D
            presionado = true;
    break;
    }
});

document.addEventListener("keyup",function(e){
    switch(e.keyCode){
        case 65: // tecla A
            presionado = false;
    break;
        case 68: //tecla D
            presionado = false;
    break;
    }
});