/**
 * Memory Game:
 * Based on Jeanine Meyer's example from
 * The Essential Guide to HTML5
 * Modifications made by @_ambonilla
 *
 *    Functions:
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
var firstpick = true;
var secondpick = true;

var firstcard = -1;
var secondcard;
var matched;
var starttime;

var count = 0;


var backcolor = "rgb(0,0,128)";
var tablecolor = "rgb(255,255,255)";

var deck = [];

//Card specs
var firstsx = 30;
var firstsy = 50;

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
      deck[firstcard].draw();
      deck[secondcard].draw();
   }
   else{
      ctx.fillStyle = tablecolor;
      ctx.fillRect(deck[secondcard].sx, deck[secondcard].sy, deck[firstcard].swidth, deck[firstcard].sheight);
      ctx.fillRect(deck[firstcard].sx, deck[firstcard].sy, deck[firstcard].swidth, deck[firstcard].sheight);
      deck[secondcard].sx = -1;
      deck[firstcard].sx = -1;
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
   starttime = new Date();
   starttime = Number(starttime.getTime());

}
