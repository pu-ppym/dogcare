#include <esp_wifi.h>
#include <WiFi.h>
#include <PulseSensorPlayground.h>  // PulseSensor 라이브러리 추가

const int heartRatePin = A4;  // 심박 센서 핀
const int vibrationPin = A3; // 진동 센서 핀
int vibrationCount = 0; // 진동 센서 변화 카운트 변수
int lastVibrationValue = 0; // 이전 진동 센서 값
int Threshold = 450;  // 심박 센서 임계값
PulseSensorPlayground pulseSensor;  // PulseSensor 객체 생성

// WiFi 설정
const char* ssid = "LGWiFi_C4A8"; // 와이파이 아이디
const char* password = "5001005199"; // 와이파이 비번

void WiFiTask(void *pvParameters) {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi 연결 완료!");
  vTaskDelete(NULL); // 태스크 종료
}



void setup()
{
  Serial.begin(115200); // 기본 직렬 모니터

  // ADC 설정
  analogReadResolution(10); // 해상도를 10비트로 설정 (0 ~ 1023)

    // Wi-Fi 태스크 생성
  xTaskCreate(WiFiTask, "WiFiTask", 4096, NULL, 1, NULL);
  


  Serial.println("setup");
  //ss.begin(9600, SERIAL_8N1, 4, 3); // 핀 4를 RX, 핀 3을 TX로 설정
  pinMode(heartRatePin, INPUT); // 심박 센서 핀 초기화
  pinMode(vibrationPin, INPUT); // 진동 센서 핀 초기화
  // PulseSensor 객체 설정
  pulseSensor.analogInput(heartRatePin);
  pulseSensor.setThreshold(Threshold);
  // PulseSensor 초기화
  if (pulseSensor.begin()) {
    Serial.println("PulseSensor Initialized");
  } else {
    Serial.println("PulseSensor initialization failed");
  }


}
void loop()
{
  //Serial.println("loop");
  // 심박 센서 값 읽기
  if (pulseSensor.sawStartOfBeat()) {  // 심박이 감지되면
    int heartRateValue = pulseSensor.getBeatsPerMinute();  // BPM 값을 얻어옴
    if (heartRateValue >= 200) {
      int heartRateValue1 = heartRateValue - 100;  // 100을 빼고 그 값을 heartRateValue1에 저장
      Serial.print("BPM: ");
      Serial.println(heartRateValue1);
    } else if (heartRateValue < 200 && heartRateValue >= 160) {  // && 논리 연산자로 수정
      int heartRateValue2 = heartRateValue - 80;  // 80을 빼고 그 값을 heartRateValue2에 저장
      Serial.print("BPM: ");
      Serial.println(heartRateValue2);
    } else {
      Serial.print("BPM: ");
      Serial.println(heartRateValue);  // 심박수를 그대로 출력
    }
  }
  // 진동 센서 데이터 읽기 (여러 번 측정하여 평균값을 계산)
  long vibrationSum = 0;
  for (int i = 0; i < 10; i++) {
    vibrationSum += analogRead(vibrationPin);
    delay(10);  // 짧은 지연을 두어 센서 안정화
  }
  int vibrationValue = vibrationSum / 10;  // 평균값 계산
  // 진동 센서 값 변화가 있으면 카운트 증가
  if (abs(vibrationValue - lastVibrationValue) > 2) { // 변화가 5 이상이면 카운트 증가
    vibrationCount++;
    Serial.print("걸음 수 : ");
    Serial.println(vibrationCount);
  } else if(abs(vibrationValue - lastVibrationValue) <= 5) {
    Serial.print("걸음 수 : ");
    Serial.println(vibrationCount);
  }
  lastVibrationValue = vibrationValue; // 마지막 진동 값 업데이트

  Serial.print("IP 주소: ");
  Serial.println(WiFi.localIP());
  
  delay(1000); // 1초 대기
}