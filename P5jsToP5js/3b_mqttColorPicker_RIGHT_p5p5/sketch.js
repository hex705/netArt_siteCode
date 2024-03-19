/*

p5 to p5 mqtt example

select a color with sliders and send it 

*/

// MQTT - shiftr 
// PUBLISH TOPIC
let myPublishTopic = "rightRGB";
let payload = "empty";

//SUBscribe topic
let mySubscribeTopic = "leftRGB"; 

// message protocol variables 
let glue;
let scissors;

// ***** graphical elements ******
let rightColor, leftColor;
// sliders
let rSlider,gSlider, bSlider; 

// slider values 
let rValue, gValue, bValue; 

// feedbackValues
let receivedRed=0, receivedGreen=0, receivedBlue=0;
let receivedColor
let incomingPayload;

// drwn bits
let theCanvas
let sendButton;

let topSpacer = 35;
let sideSpacer = 25;
let base = 300;

function setup() {
  // canvas basics
  theCanvas = createCanvas(1000,1000);
  theCanvas.position(20, 100);
  colorMode(RGB, 255);

  //connect to CHANNEL -shiftr- use these fxns in mqtt.js
  connectMQTT(); // mqtt tab 

  // scissors and glue -- parsing and assembling messages 
  glue = new p5Glue();
  scissors = new p5Scissors();

  createSliders();
  createSendButton();
}


// drawing stuff
function draw() {
  background(255);
  drawScreen();
}

function drawScreen(){

  // interface labels
  fill(87,87,87);
  textSize(32);
  text('RIGHT:\nchoose a color ',sideSpacer,25);

  // draw RIGHT color choice
  rightColor = color(rValue, gValue,bValue);
  fill(rightColor);
  rect(sideSpacer, topSpacer*2, base, base);
  
  // slider labels for right color
  textSize(17);
  fill(0);
  text('Red   ('+rSlider.value()+')',350,240-topSpacer*3);
  text('Green ('+gSlider.value()+')',350,265-topSpacer*3);
  text('Blue  ('+bSlider.value()+')',350,290-topSpacer*3);

   // draw LEFT color (remote to RIGHT)
   leftColor = color(receivedRed, receivedGreen, receivedBlue);
   fill(leftColor);
   rect(sideSpacer, topSpacer*3+base+5, base, base/3);
   
   // feedback label
   fill(87,87,87);
   textSize(32);
 
   //feedback message
   text('received from LEFT ',sideSpacer,topSpacer*3+base);
   fill(87,87,87);
   textSize(16);
   text('color from left:: '+incomingPayload,350, 475);
}

// generic way of tracking all the sliders
// not a very JS solution but it works.
// all colors captured when mouse is released
function mouseReleased() {
  rValue = rSlider.value();
  gValue = gSlider.value();
  bValue = bSlider.value();
}


// message builder, specific to this project

function buildColorMessage(){

  // format slider numbers for arduino
  // round color channels down
  let r = floor(red(rightColor));
  let g = floor(green(rightColor));
  let b = floor(blue(rightColor));

  // check for errors -- make sure all teh colors are number type
  if ( isNaN(r) || isNaN(g) || isNaN(b)){
    console.log ( 'malformed message'); 
    // since no update to package, will resend last good message
  } else {
    // good message send it to shiftr
    assembleMessage(r,g,b);
  }
}

// use glue to build our message 
function assembleMessage (rVal, gVal, bVal){
  // send values to arduino
  // glue is a GLUE object ! 
  glue.create();
  glue.add(rVal);
  glue.add(gVal);
  glue.add(bVal);
  glue.endPackage(); // make package and 1.0.1

  payload = glue.get(); // returns message as string 
  console.log("sending payload: " + payload);

  publishMqttMessage(myPublishTopic, payload);

}


// create GUI 
function createSendButton(){
  sendButton = createButton('Send Color');
  sendButton.style('font-size', '20px');
  sendButton.style('background-color', "orange");
  sendButton.position(480, 275+topSpacer); // 365, 475
  // this line attaches a mouse pressed event handler to the sendButton. This is an event driven JS solution (compare with sliders at end of code)
  sendButton.mousePressed(buildColorMessage);
}

function createSliders(){

  // create red selector
  rSlider = createSlider(0, 255, 0); // was 0, 255, 127
  rSlider.position(475, 325-topSpacer*3);
  rSlider.style("width", "127px");
  rSlider.id("rSlider");

  // create green selector
  gSlider = createSlider(0, 255, 0);
  gSlider.position(475, 350-topSpacer*3);
  gSlider.style("width", "127px");
  gSlider.id("gSlider");

  // create blue selector
  bSlider = createSlider(0, 255, 0);
  bSlider.position(475, 375-topSpacer*3);
  bSlider.style("width", "127px");
  bSlider.id("bSlider");
}

