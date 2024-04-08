
// channel -- serial variables 
// serial variables
let serial;
let portName = "/dev/tty.usbserial-022AF964"; // OSX - NOT cu ! use tty

// message protocol 
let glue;
let scissors;

// drawing variables
let theCanvas;

let inInt, inFloat, inString;

function setup() {
  theCanvas = createCanvas(500,50);

  // scissors and glue -- parsing and assembling messages 
  glue = new p5Glue();
  scissors = new p5Scissors();
  
  setupSerial(); // in serialCallbacks.js 
}

function draw() {
  background(200);
  fill(0);
  text("open console and click canvas.", 20,20);
}

function mousePressed(){
  // use glue to build our message 

  glue.create();
   glue.add(4);
   glue.add(5.5);
   glue.add("six_p5js");
  glue.endPackage(); // make package and 1.0.1

  payload = glue.get(); // returns message as string 
  serial.write(payload);

  console.log("sent "+ payload);

}

function serialEvent() {

  // get serial message 
  // note as of at least 2024 - readline doesn't seem to readline it reads single chars/bytes
  // serial event fires for every incoming char until the end of line symbol ? 

 // let currentString = serial.readLine(); 
  let currentString = serial.readStringUntil('\n'); 

  // this is disappointing -- 
  // if you want to print t oconsole what you are getting from serial,
  // you will need to do the following 

  // we need to wrap our reads in a conditional
  // this if says -- if there is a '#' sign - ie, our end of message,
  // then log the message and parse it 
  // close the if after parse is complete

  // check for end of message -- then act
  if (currentString.indexOf('#')>=1){ // new for 2024

    console.log("in serialevent - ")
    console.log(currentString);

    // parse the message
    scissors.parse(currentString);

    inInt = scissors.getInt(0);
    inFloat = scissors.getFloat(1);
    inString = scissors.getString(2);

    console.log("got: ");
    console.log(inInt);
    console.log(inFloat);
    console.log(inString);

  } // end if, end new for 2024

}
