// serial connection between p5js and arduino/huzzah
// button on pin 4 generates message sends
// could replace button with a timer

// you can run this on an UNO or a HUZZAH

#include <Glue.h>
Glue glue;

#include <Scissors.h>
Scissors scissors;

// variable to hold received message elements
int recInt;
float recFloat;
String recString;

// circuit variables
int buttonPin = 5;
int buttonState, lastButtonState;

void setup() {
  Serial.begin(9600);  // have to use this speed
  glue.begin();  // not attaching it to a stream
  scissors.begin(Serial);

  pinMode(buttonPin, INPUT);
}

void loop(){

  buttonState = digitalRead(buttonPin);

  if ( buttonState == 1 && lastButtonState == 0){
         buildMessage();
         delay(15);
  }

  scissors.poll();

  lastButtonState = buttonState;
}

// using the glue library to make a message
void buildMessage(){
  // use glue to add the parsing syntax around value -- [*,#]
  glue.create();
   glue.add(1);
   glue.add(2.2f); // if you add a float as a 
   glue.add("ard_three");
  glue.endPackage();

  String payload = glue.getPackage();
  Serial.println(payload); // sends 
}


void scissorsEvent( String &theMessage ){  // its just a string

    // show full message -- works in MQTT - not here!
    //Serial.println("\nReceived ");
    //Serial.println(theMessage); // this loops back to p5js

    recInt = scissors.getInt(0);   // receiving one number from 0-255
    recFloat = scissors.getFloat(1);
    recString = scissors.getString(2);

    // we do not have an easy way to see this ...
    // so we should add OLED screen 
  
    // works in MQTT - not here
    // Serial.println(recInt);
    // Serial.println(recFloat);
    // Serial.println(recString);
    // Serial.println();

}

