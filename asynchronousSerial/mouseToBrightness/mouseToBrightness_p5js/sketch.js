// simple serial
// https://github.com/p5-serial/p5.serialport
// needs serial control app

let serial;
let portName = "/dev/tty.usbmodem142201";
let theCanvas;

function setup() {
  theCanvas = createCanvas(255, 100);
  theCanvas.position(0,0);
  // barebones serial implimentation -- talking only
  serial = new p5.SerialPort();    // make a new instance of the
  serial.open(portName);           // open a serial port
}

function draw() {
 //background gradient
 for (let i = 0; i < 255; i ++){
   stroke(i);
   line(i,0,i,height);
 }
 // line to show mouse position
 strokeWeight(3);
 stroke(255,0,0);
 line (mouseX,0,mouseX,height);
 // message construction and send
 let message = ("*"  + mouseX + ",#"); // onTime, offTime
 serial.write(message);
 console.log(message);
}
