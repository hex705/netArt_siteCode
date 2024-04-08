
// channel -- serial variables 
// serial variables
let serial;
let portName = "/dev/tty.usbserial-01434FB5"; // 

// message protocol 
let glue;
let scissors;

// message variables
let messageType;
let buttonState = 0;
let photoCellState = 127; // halfway (0-255)

// drawing variables
let theCanvas;
let drawSize = 250;
let drawY = 375;   // verticle position of the green dot

function setup() {
  theCanvas = createCanvas(1000, 750);

  // scissors and glue -- parsing and assembling messages 
  glue = new p5Glue();
  scissors = new p5Scissors();
  
  setupSerial(); // in serialCallbacks.js 
   
  // image and screen setup
  frameRate(30);
  ellipseMode(CENTER);
  rectMode(CENTER);
}

function draw() {
  background(0);

  // map the photocell to canvas height - draw ellipse
  fill(0,200,0);  // green 
  drawY = map(photoCellState, 0, 1023, height, 0); // map height to 
  ellipse(250, drawY, drawSize, drawSize);

  // use button read to determine drawing
  if ( buttonState == 0 ){
    fill(255,0,0);
    rect(750,height/2,drawSize,drawSize);
  } else {   // yellow circle
    fill(200,200,0);
    ellipse(750,height/2,drawSize,drawSize);
  }
}

// incoming message arrives here
function serialEvent() {

  // get serial message - channel level
  let currentString = serial.readLine(); 

  // parse the message
  scissors.parse(currentString);

  // get type of message -- button or light
  messageType = scissors.getString(0);

  switch (messageType) {
      case 'button':  // note this topic must match 
        //console.log("IN: serialEvent - button message arrived");
        buttonState = scissors.getInt(1);
        break;
      case 'light':
        //console.log("IN: serialEvent - light message arrived " );
        photoCellState = scissors.getInt(1);
        break;
      default:
        console.log(currentString);
     }

}
