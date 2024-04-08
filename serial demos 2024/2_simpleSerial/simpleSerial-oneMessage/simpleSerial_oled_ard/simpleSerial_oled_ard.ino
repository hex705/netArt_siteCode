// serial connection between p5js and arduino/huzzah
// button on pin 4 generates message sends
// could replace button with a timer

// you can run this on an UNO or a HUZZAH

// oled
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 32 // OLED display height, in pixels

#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C ///< See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);


#include <Glue.h>
Glue glue;

#include <Scissors.h>
Scissors scissors;

String sendMessage="";

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

  // oled
  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  // Clear the buffer
  display.clearDisplay();

  // you must call display.display after you make changes!
  display.display();
  delay(2000);
}

void loop(){
  //currentTime = millis();
  buttonState = digitalRead(buttonPin);

  if ( buttonState == 1 && lastButtonState == 0){
         buildMessage();
         delay(5);
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
  Serial.println(payload); 
}


void scissorsEvent( String &theMessage ){  // its just a string

    // show full message -- worked for MQTT but not serial ! 
      //Serial.println("\nReceived ");
      //Serial.println(theMessage); // this loops back to p5js

    recInt = scissors.getInt(0);   // receiving one number from 0-255
    recFloat = scissors.getFloat(1);
    recString = scissors.getString(2);

    // we do not have an easy way to see this ...
    // so, add OLED screen 

    // show the incoming string
    // showText(theMessage, 5, 5, 1);  // the raw string

    // show the parsed data - convert int and float to string for screen
    String intString = "";
    intString+=recInt;
      showText(intString, 5, 5, 1);  // clear screen then print .. a bit weird, sorry

    String floatString = "";
    floatString+=recFloat;
      showText(floatString, 5, 15, 0);

    // last one is already a string
      showText(recString, 5, 25, 0);

    // also worked with mqtt - but not here.
      // Serial.println(recInt);
      // Serial.println(recFloat);
      // Serial.println(recString);
      // Serial.println();

}

void showText(String text, int leftInset, int rightInset, int clearScreen){
  if (clearScreen == 1)  display.clearDisplay();
  display.setTextSize(1);               // Draw 2X-scale text
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(leftInset, rightInset); // lone height is 10
  display.println(text);
  display.display();

}

