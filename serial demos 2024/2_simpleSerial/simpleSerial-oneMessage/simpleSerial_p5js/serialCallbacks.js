let options = { baudrate: 115200}; // change the data rate to whatever you wish

function setupSerial(){ 
   
   //serial port functions 
   serial = new p5.SerialPort();    // make a new instance of the serialport library
   serial.list();
   serial.on('list',  gotList);
   serial.open(portName, options);           // open a serial port
 
   // serial callbacks -- in serialCallbacks.js
   serial.on('connected', serverConnected);
   serial.on('data',  serialEvent);  // callback for when new data arrives
   serial.on('error', serialError); // callback for errors
   serial.on('open',  gotOpen);
   serial.on('close', gotClose);
}


// serial boiler plate code
function serverConnected() {
    print("Connected to Server");
   }
   
function gotList(thelist) {
    print("List of Serial Ports:");
   
    for (let i = 0; i < thelist.length; i++) {
     print(i + " " + thelist[i]);
    }
   }
   
   function gotOpen() {
    print("Serial Port is Open");
   }
   
   function gotClose(){
    print("Serial Port is Closed");
    latestData = "Serial Port is Closed";
   }
   
   function serialError(theerror) {
    print(theerror);
   }
   