// serial connection between p5js and arduino

// you can run this on an UNO or a HUZZAH

// connections to make 
// button on pin 5
// pot on A2


#include <Glue.h>
Glue glue;

#include <Scissors.h>
Scissors scissors;

// variable to hold received message elements
int recInt;
int recFloat;
int recString;

// circuit variables
int photocellPin = A2; // D34
int buttonPin = 5;

int photocellState = 127;
int buttonState = 0;

// send timer -- we should listen more than we send
unsigned long sendInterval = 200;
unsigned long sendStartTime = 0;
unsigned long currentTime = 0;

void setup() {
  Serial.begin(9600);  // have to use this speed
  glue.begin();  // not attaching it to a stream
  scissors.begin(Serial);

  pinMode(photocellPin, INPUT);
  pinMode(buttonPin, INPUT);

  // comment out below if UNO
    analogReadResolution(10); // https://randomnerdtutorials.com/esp32-adc-analog-read-arduino-ide/#:~:text=Analog%20Inputs%20(ADC),3.3%20V%20corresponds%20to%204095.
}

void loop(){
  currentTime = millis();

  buttonState = digitalRead(buttonPin);
  photocellState = analogRead(photocellPin);

  if ((currentTime - sendStartTime) > sendInterval){
    buildMessage("button", buttonState);
    buildMessage("light",  photocellState);
    sendStartTime = currentTime;
  }

 // scissors.poll(); // for listening 
}

// using the glue library to make a message
void buildMessage(String type, int sensorValue){
  // use glue to add the parsing syntax around value -- [*,#]
  glue.create();
   glue.add(type);
   glue.add(sensorValue);
  glue.endPackage();

  String payload = glue.getPackage();
  Serial.println(payload); 
}



// local debug may interupt network messages
void debugSensors(){
  Serial.print("buttonState :: \t");
  Serial.print(buttonState);
  Serial.print("\tphotocellState :: \t");
  Serial.println(photocellState);
}
