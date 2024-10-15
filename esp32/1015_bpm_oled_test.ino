/*
   The following libraries are necessary
*/
#include <Arduino.h>
#include <PulseSensorPlayground.h>
#include"oled_u8g2.h"

OLED_U8G2 oled;

/*
   Declare an instance of PulseSensor to access
   all the PulseSensor Playground functions.
*/
PulseSensorPlayground pulseSensor;

/*
   Pinout:
     PULSE_INPUT = Analog Input. Connected to the pulse sensor
      purple (signal) wire.
     PULSE_BLINK = digital Output. Connected to an LED (and 1K series resistor)
      that will flash on each detected pulse.
     PULSE_FADE = digital Output. PWM pin connected to an LED (and 1K series resistor)
      that will smoothly fade with each pulse.
*/
const int PULSE_INPUT = D6;
const int PULSE_BLINK = D3;     // default 13 
const int PULSE_FADE = 5;
const int THRESHOLD = 511;    // default 685

/* 
   When sendPulseSignal is true, PulseSensor Signal data
   is sent to the serial port for user monitoring.
*/
bool sendPulseSignal = false;

void setup() {
/*
   115200 baud provides about 11 bytes per millisecond.
   The delay allows the port to settle so that 
   we don't miss out on info in the Serial Monitor.
*/
  oled.setup();    // oled 통신핀 기능
  Serial.begin(115200);
  while (!Serial) {
    ;  // 시리얼 통신이 준비될 때까지 기다림
  }
  delay(1000);
/*
   ESP32 analogRead defaults to 13 bit resolution
   PulseSensor Playground library works with 10 bit
*/
  analogReadResolution(10);
  
/*  Configure the PulseSensor manager  */
  pulseSensor.analogInput(PULSE_INPUT);   // pulse sensor 신호 연결핀 설정
  pulseSensor.blinkOnPulse(PULSE_BLINK);
  pulseSensor.fadeOnPulse(PULSE_FADE);
  pulseSensor.setSerial(Serial);
  pulseSensor.setThreshold(THRESHOLD);

/*  Now that everything is ready, start reading the PulseSensor signal. */
  if (!pulseSensor.begin()) {
    while(1) {
/*  If the pulseSensor object fails, flash the LED  */      // 초기화 실패시 led 깜빡이게 d3
      digitalWrite(PULSE_BLINK, LOW);
      delay(50);
      digitalWrite(PULSE_BLINK, HIGH);
      delay(50);
      
    }
  }
}

void loop() {
/*
     Option to send the PulseSensor Signal data
     to serial port for verification
*/

  
  // Serial.println(analogRead(PULSE_INPUT));  // 신호값 직접 확인
  

  if (pulseSensor.sawStartOfBeat()) {
    Serial.print("Heartbeat detected: ");
    Serial.print(pulseSensor.getBeatsPerMinute());
    Serial.println(" bpm");
    oled.setLine(1, "TEST");
    oled.setLine(2, "BPM: " + String(pulseSensor.getBeatsPerMinute()));

  } 
  oled.display();  
  delay(100); 
/*  Check to see if there are any commands sent to us  */
   //serialCheck();
}

/*
    This function checks to see if there are any commands available
    on the Serial port. When you send keyboard characters 'b' or 'x'
    you can turn on and off the signal data stream.
*/
void serialCheck(){
  if(Serial.available() > 0){
    char inChar = Serial.read();
    switch(inChar){
      case 'b':
        sendPulseSignal = true;
        break;
      case 'x':
        sendPulseSignal = false;
        break;
      default:
        break;
    }
  }
}
