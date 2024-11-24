#include <esp_wifi.h>
#include <WiFi.h>
#include <PulseSensorPlayground.h>  
#include <HTTPClient.h>
#include <Adafruit_MLX90614.h>


const int heartRatePin = A4;  
const int vibrationPin = A3; 
int vibrationCount = 0; 
int lastVibrationValue = 0; 
int Threshold = 450;  
PulseSensorPlayground pulseSensor;  
int heartRateValue;

Adafruit_MLX90614 mlx = Adafruit_MLX90614();


// WiFi 설정
const char* ssid = "ssid"; 
const char* password = "password"; 

// Node.js 서버 주소
const String serverURL = "http://awsServerIp/data";



void WiFiTask(void *pvParameters) {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi 연결 완료!");
  vTaskDelete(NULL);
}

void VibrationTask(void *pvParameters) {
  long vibrationSum = 0;
  while (true) {
    vibrationSum = 0;
    for (int i = 0; i < 10; i++) {
      vibrationSum += analogRead(vibrationPin);
      delay(10);  
    }
    int vibrationValue = vibrationSum / 10;  
    if (abs(vibrationValue - lastVibrationValue) > 2) { 
      vibrationCount++;
      Serial.print("걸음 수 : ");
      Serial.println(vibrationCount);
    }
    lastVibrationValue = vibrationValue;

    vTaskDelay(1000 / portTICK_PERIOD_MS);  // 1초 대기
  }
}


void sendData() {
  if(WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // HTTP POST 요청 시작
    http.begin(serverURL);

    // 요청 헤더 설정
    http.addHeader("Content-Type", "application/json");

    // 전송할 데이터 JSON 형식으로 준비
    String jsonData = "{\"vibration\": " + String(vibrationCount) + ", \"heartRate\": " + String(heartRateValue) + "}";
    Serial.println(jsonData);

    // POST 요청 전송
    int httpResponseCode = http.POST(jsonData);

    // 응답 코드 확인
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response Code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error on sending POST request: ");
      Serial.println(httpResponseCode);
    }

    // 연결 종료
    http.end();
  }
}



void setup()
{
  Serial.begin(115200);
  analogReadResolution(10); 

  // Wi-Fi 태스크 생성
  xTaskCreate(WiFiTask, "WiFiTask", 4096, NULL, 1, NULL);

  xTaskCreate(VibrationTask, "VibrationTask", 4096, NULL, 1, NULL);

  pinMode(heartRatePin, INPUT);
  pinMode(vibrationPin, INPUT);
  
  pulseSensor.analogInput(heartRatePin);
  pulseSensor.setThreshold(Threshold);
  if (pulseSensor.begin()) {
    Serial.println("PulseSensor Initialized");
  } else {
    Serial.println("PulseSensor initialization failed");
  }

// 온도센서 오류 확인
  if(!mlx.begin()) {
    Serial.println("온도 센서 오류...");
    while(1);  // 온도 센서 오류 시 무한 루프
  }


  Serial.print("Emissivity = "); Serial.println(mlx.readEmissivity());
  Serial.println("================================================");
  
}

void loop()
{
  if (pulseSensor.sawStartOfBeat()) {  
    heartRateValue = pulseSensor.getBeatsPerMinute();  
    if (heartRateValue >= 200) {
      heartRateValue -= 100;  
    } else if (heartRateValue < 200 && heartRateValue >= 160) {
      heartRateValue -= 80;  
    }
    Serial.print("BPM: ");
    Serial.println(heartRateValue);

  }


  sendData();

  Serial.print("IP 주소: ");
  Serial.println(WiFi.localIP());
  Serial.println(WiFi.status());

  Serial.print("Ambient = "); 
  Serial.print(mlx.readAmbientTempC());
  Serial.print("*C\tObject = "); 
  Serial.print(mlx.readObjectTempC()); 
  Serial.println("*C");


  delay(1000); 
}
