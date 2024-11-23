#include <esp_wifi.h>
#include <WiFi.h>
#include <TinyGPS.h>
#include <PulseSensorPlayground.h>  // PulseSensor 라이브러리 추가

// WiFi 설정
const char* ssid = "myiptime"; // 와이파이 아이디
const char* password = "12345"; // 와이파이 비번

// GPS 설정
//TinyGPS gps;
//HardwareSerial ss(1); // 1번 하드웨어 직렬 포트 사용

// 심박 센서 설정
const int heartRatePin = A6;  // 심박 센서 핀
int Threshold = 560;  // 심박 센서 임계값
PulseSensorPlayground pulseSensor;  // PulseSensor 객체 생성

// 진동 센서 설정
const int vibrationPin = A7; // 진동 센서 핀
int vibrationCount = 0; // 진동 센서 변화 카운트 변수
int lastVibrationValue = 0; // 이전 진동 센서 값

void setup() {
  // 직렬 모니터 설정
  Serial.begin(115200);
  delay(10);

  // WiFi 연결
  Serial.println();
  Serial.print("연결 중...");
  Serial.print(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) { // 연결이 될 때까지 계속 대기
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi 연결됨!");
  Serial.print("IP 주소: ");
  Serial.println(WiFi.localIP());

  // GPS 설정
  //ss.begin(9600, SERIAL_8N1, 4, 3); // 핀 4를 RX, 핀 3을 TX로 설정

  // 심박 센서 설정
  pinMode(heartRatePin, INPUT); // 심박 센서 핀 초기화
  pulseSensor.analogInput(heartRatePin);
  pulseSensor.setThreshold(Threshold);

  // PulseSensor 초기화
  if (pulseSensor.begin()) {
    Serial.println("심박 센서 초기화");
  } else {
    Serial.println("심박 센서 초기화 실패");
  }

  // 진동 센서 핀 초기화
  pinMode(vibrationPin, INPUT);
}

void loop() {
  bool newData = false;

  // GPS 데이터를 1초 동안 파싱
  //for (unsigned long start = millis(); millis() - start < 1000;) {
  //  while (ss.available()) {
  //    char c = ss.read();
  //    if (gps.encode(c)) { // 새로운 유효한 문장이 들어왔는가?
  //      newData = true;
  //    }
    }
  }

  // GPS 데이터 처리
  //if (newData) {
  //  float flat, flon;
  //  unsigned long age;
  //  gps.f_get_position(&flat, &flon, &age);
  //  Serial.print("LAT=");
  //  Serial.print(flat == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : flat, 6);
  //  Serial.print(" LON=");
  //  Serial.print(flon == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : flon, 6);
  //  Serial.print(" SAT=");
  //  Serial.print(gps.satellites() == TinyGPS::GPS_INVALID_SATELLITES ? 0 : gps.satellites());
  //  Serial.print(" PREC=");
  //  Serial.print(gps.hdop() == TinyGPS::GPS_INVALID_HDOP ? 0 : gps.hdop());
  //  Serial.println();
  }

  //if (!newData) {
  //  Serial.println("** GPS 데이터가 없습니다 **");
  //}

  // 심박 센서 값 읽기
  if (pulseSensor.sawStartOfBeat()) {  // 심박이 감지되면
    int heartRateValue = pulseSensor.getBeatsPerMinute();  // BPM 값을 얻어옴

    if (heartRateValue >= 200) {
      int heartRateValue1 = heartRateValue - 100;  // 100을 빼고 그 값을 heartRateValue1에 저장
      Serial.print("BPM: ");
      Serial.println(heartRateValue1);
    } else if (heartRateValue < 200 && heartRateValue >= 160) {
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
  if (abs(vibrationValue - lastVibrationValue) > 5) { // 변화가 5 이상이면 카운트 증가
    vibrationCount++;
    Serial.print("걸음 수 : ");
    Serial.println(vibrationCount);
  } else if(abs(vibrationValue - lastVibrationValue) <= 5) {
    Serial.print("걸음 수 : ");
    Serial.println(vibrationCount);
  }

  lastVibrationValue = vibrationValue; // 마지막 진동 값 업데이트

  delay(1000); // 1초 대기
}
