// Simplified example -- see video for details.
// This example shows the 3 axis acceleration.

// related post:
// https://netart.ca/building-blocks/feather-esp32-and-accelerometers/

//you need all four  of these declarations
#include "LIS3DHTR.h"
#include <Wire.h>
LIS3DHTR<TwoWire> LIS; //IIC
#define WIRE Wire

// these are not needed here 
// #define I2C_SDA 23
// #define I2C_SCL 22

void setup() {

  // woah! look at the BAUD rate
    Serial.begin(115200); // change plotter or serial monitor
    while (!Serial) {}; // for testing not production - this BLOCKS forever is no serial
    
    // variables you need to init accellerometer
    LIS.begin(WIRE, 0x19); //IIC init 
    delay(100); // give it a moment to start
    
    LIS.setFullScaleRange(LIS3DHTR_RANGE_2G); //sensitivity
    LIS.setOutputDataRate(LIS3DHTR_DATARATE_50HZ); // data rate
    LIS.setHighSolution(true); //High solution enable


    Serial.println("setup complete");

}

void loop() {
    if (!LIS) {
        Serial.println("LIS3DHTR didn't connect.");
        while (1);
        return;
    }
    //3 axis
    Serial.print("x:"); Serial.print(LIS.getAccelerationX()); Serial.print("  ");
    Serial.print("y:"); Serial.print(LIS.getAccelerationY()); Serial.print("  ");
    Serial.print("z:"); Serial.println(LIS.getAccelerationZ());

    delay(50);
}
