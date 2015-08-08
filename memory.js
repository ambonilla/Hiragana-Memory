/**
 * Memory Game:
 * Based on Jeanine Meyer's example from
 * The Essential Guide to HTML5
 * Modifications made by @_ambonilla
 *
 *    Functions:
 *       startStopWatch -> Start the interval
 *       delta -> Calculate time by checking the diff between timestamps
 *       render -> Refresh and display total time played
 *       init -> main function called after onLoad
 *       choose -> Invoked in response to the addEventListener in init
 *       flipback -> Invoked in response to the setTimeout call in choose
 *       shuffle
 *       makedeck -> Calls the card objects
 *       drawback -> Draw method for a card in makedeck & flipback
 *
 *
 * */

var ctx; //canvas context
var hours = 0;
var minutes = 0;
var seconds = 0;
var offset;
var interval;
var timedisplay = "00:00:00"
var gamestart = true;
var firstpick = true;
var secondpick = true;

var firstcard = -1;
var secondcard;
var matched;
var starttime;

var count = 0;
var matchcounter = 0;
var trycounter = 0;


var backcolor = "rgb(0,0,128)";
var textcolor = "rgb(0,0,0)";
var tablecolor = "rgb(255,255,255)";

var deck = [];

//Card specs
var firstsx = 30;
var firstsy = 90;

var margin = 30;
var cardwidth = 100;
var cardheight = 100;

//End card specs

var imgnames = ["a","i","u","e","o"];

var pairs = [];

for(var count = 0; count < imgnames.length; count++){
   var tempname = imgnames[count] + ".png";
   pairs.push(["img/hiragana/" + tempname, "img/romaji/" + tempname]);
}


/**
 * Functions
 **/

function startStopWatch(){
   if(!interval){
      offset = Date.now();
      interval = setInterval(update, 1);
   }
}

function update(){
   seconds += delta();
   render();
}

function render(){
   currSec = Math.floor(seconds/1000);
   if (currSec >= 60){
      currSec = 0;
      seconds = 0;
      minutes++;
   }
   if (minutes >= 60){
      minutes =0;
      hours++;
   }
   var tempHours = 0;
      if (hours < 10){
         tempHours = "0" + hours;
      }
      else{
         tempHours = hours;
      }
   var tempMinutes = 0;
      if (minutes <= 9){
         tempMinutes = "0" + minutes;
      }
      else{
         tempMinutes = minutes;
      }
   var tempSeconds = 0;
   if (currSec >= 10){
      tempSeconds = currSec;
   }
   else{
      tempSeconds = "0" + currSec;
   }

   ctx.fillStyle = textcolor;
   ctx.font = "bold 20pt sans-serif";
   timedisplay = tempHours + ":" + tempMinutes + ":" + tempSeconds;
   ctx.clearRect(0,0, canvas1.width/2, 40);
   ctx.fillText("Time: " + timedisplay, canvas1.width/4, 30);
}

function delta(){
   var now = Date.now();
   var d = now - offset;
   offset = now;
   return d;
}

function Card(sx, sy, swidth, sheight, img, info){
   this.sx = sx;
   this.sy = sy;
   this.swidth = swidth;
   this.sheight = sheight;
   this.info = info;    //indicates matches
   this.img = img;      //img reference
   this.draw = drawback;
}

function makedeck(){
   var i;
   var acard;
   var bcard;
   var pica;
   var picb;
   var cx = firstsx;
   var cy = firstsy;
   var pairslength = parseInt(pairs.length);

   for(i = 0; i < pairslength; i++){
      //Create image object
      pica = new Image();
      pica.src = pairs[i][0];
      picb = new Image();
      picb.src = pairs[i][1];

      acard = new Card(cx, cy, cardwidth, cardheight, pica, i);
      bcard = new Card(cx, cy + cardheight+margin, cardwidth, cardheight, picb, i);

      deck.push(acard);
      deck.push(bcard);

      cx = cx + cardwidth + margin;

      acard.draw();
      bcard.draw();
   }
}

function shuffle(){
   var i;
   var k;
   var holderinfo;      //Temporary place for the swap
   var holderimg;       //Temporary place for the swap

   var dl = deck.length;
   var nt;

   //Do the swap 4 times the length of the deck
   for(nt = 0; nt < 4 * dl; nt++){
      i = Math.floor(Math.random() * dl);
      k = Math.floor(Math.random() * dl);

      holderinfo = deck[i].info;
      holderimg = deck[i].img;
      deck[i].info = deck[k].info;
      deck[i].img = deck[k].img;

      deck[k].info = holderinfo;
      deck[k].img = holderimg;
   }

}

function drawback(){
   ctx.fillStyle = backcolor;
   ctx.fillRect(this.sx, this.sy, this.swidth, this.sheight);
}

function choose(ev){
   var out;
   var mx;
   var my;
   var pick1;
   var pick2;
   
   //Check clicked coordinates according to the browser
   
   if (ev.layerX !== undefined || ex.layerX == 0){
      mx = ev.layerX;
      my = ev.layerY;
   }
   else if(ev.offsetX !== undefined || ev.offsetX == 0){
      mx = ev.offsetX;
      my = ev.offsetY;
   }


	var stopnumber = parseInt(deck.length);
	var i;

	for(i = 0; i < stopnumber; i++){
      var card = deck[i];
      if(card.sx >= 0)
         if((mx > card.sx) && (mx < (card.sx + card.swidth)) && (my > card.sy) && (my < (card.sy + card.sheight)) ){
            if( (firstpick) || (i != firstcard) ){
               break;
            }
         }
	}
   
	if (i < stopnumber){
      //If the game is starting also start the stopwatch
      if (gamestart){
         gamestart = false;
         startStopWatch();
      }
	   if (firstpick){
		   firstcard = i;
		   firstpick = false;
		   ctx.drawImage(card.img, card.sx, card.sy, card.swidth, card.sheight);
		}
        else{
           if(secondpick){
              secondpick = false;
              secondcard = i;
              ctx.drawImage(card.img, card.sx, card.sy, card.swidth, card.sheight);
              if(card.info == deck[firstcard].info){
                 matched = true;
                 count++;
                 ctx.fillStyle = tablecolor;
              }
              else{
                 matched = false;
              }
              setTimeout(flipback, 1000);
           }
        }
	}

}

function flipback(){
   var card;

   if(!matched){
      trycounter++;
      deck[firstcard].draw();
      deck[secondcard].draw();
   }
   else{
      trycounter++;
      matchcounter++;
      ctx.fillStyle = tablecolor;
      ctx.fillRect(deck[secondcard].sx, deck[secondcard].sy, deck[firstcard].swidth, deck[firstcard].sheight);
      ctx.fillRect(deck[firstcard].sx, deck[firstcard].sy, deck[firstcard].swidth, deck[firstcard].sheight);
      deck[secondcard].sx = -1;
      deck[firstcard].sx = -1;
      //Check if all the pairs are matched
      if (matchcounter == imgnames.length){
         var msg = "Game Over!\nTime: " + timedisplay  +"\nTries: " + trycounter;
         //Display alert and stop timer
         alert(msg);
         clearInterval(interval);
         interval = null;
      }

   }

   //Here we set the bool values back to true in order to avoid opening more than 2 cards at the same time
      firstpick = true;
      secondpick = true;
}

function init(){
   ctx = document.getElementById('canvas').getContext('2d');
   canvas1 = document.getElementById('canvas');
   canvas1.width  = window.innerWidth;
   canvas1.height = window.innerHeight;
   canvas1.addEventListener('click', choose, false);
   makedeck();
   shuffle();
   ctx.fillStyle = textcolor;
   ctx.font = "bold 20pt sans-serif";
   ctx.fillText("Time: " + timedisplay, canvas1.width/4, 30);
   starttime = new Date();
   starttime = Number(starttime.getTime());

}
