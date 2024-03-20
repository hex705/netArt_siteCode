
// mouse position changes led brightness

#include <Scissors.h>

Scissors cut;
int ledPin = 7;
int ledState = 0;

void setup() {
  Serial.begin(9600);
  cut.begin(Serial);
  pinMode(ledPin,OUTPUT);
}

void loop() {
  // expect message of form -->  * data ,#
  // ie. one data point, index 0 and its an int so
  // we get that data with   -->  .getInt(0)
  if (cut.listen() > 0) {       // have a new message?
    ledState = cut.getInt(0);   // receiving one number from 0-255
    Serial.println(ledState);
  }
  analogWrite(ledPin, ledState);
}
