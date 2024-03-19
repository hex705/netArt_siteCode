/*

p5js - send and parse via mqtt
--this sketch subscribes to its own messages

you can modify it to send to a different

*/

// MQTT - shiftr 
// PUBlish TOPIC
let myPublishTopic = "sendAndParse_loopBack";
let payload = "empty";

//SUBscribe TOPIC - in mqtt on connect callback
let mySubscribeTopic = "sendAndParse_loopBack"; // this will send to self - loopback

// message protocol variables 
let glue;
let scissors;

let remoteInt,remoteFloat,remoteString;


function setup() {
  // canvas basics
  theCanvas = createCanvas(600,600);
  theCanvas.position(20, 100);
  colorMode(RGB, 255);

  //connect to CHANNEL -shiftr- use these fxns in mqtt.js
  connectMQTT(); // mqtt tab 

  // scissors and glue -- parsing and assembling messages 
  glue = new p5Glue();
  scissors = new p5Scissors();
}


// drawing stuff
function draw() {
  background(255);
  textSize(16);
  text('LOOP BACK\n\nopen browser inspector, console \nclick mouse',25,25);
    // listening happens in MQTT tab
}

function mousePressed(){
    assembleMessage(1,1.1,"one");
}


// use glue to build our message 
function assembleMessage (intVal, floatVal, stringVal){
  // send values to arduino
  // glue is a GLUE object ! 
  glue.create();
   glue.add(intVal);
   glue.add(floatVal);
   glue.add(stringVal);
  glue.endPackage(); // make package and 1.0.1

  payload = glue.get(); // returns message as string 

  console.log("send payload:: " + payload);
  publishMqttMessage(myPublishTopic, payload);

}

