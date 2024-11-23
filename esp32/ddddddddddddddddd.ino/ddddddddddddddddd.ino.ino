#include <TinyGPS.h>
#include <PulseSensorPlayground.h>  // PulseSensor 라이브러리 추가

TinyGPS gps;
HardwareSerial ss(1); // 1번 하드웨어 직렬 포트 사용

const int heartRatePin = A6;  // 심박 센서 핀
const int vibrationPin = A7; // 진동 센서 핀

int vibrationCount = 0; // 진동 센서 변화 카운트 변수
int lastVibrationValue = 0; // 이전 진동 센서 값
int Threshold = 560;  // 심박 센서 임계값

PulseSensorPlayground pulseSensor;  // PulseSensor 객체 생성

void setup()
{
  Serial.begin(115200); // 기본 직렬 모니터
  ss.begin(9600, SERIAL_8N1, 3, 1);  // RX는 GPIO3, TX는 GPIO1로 설정

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

  Serial.print("Simple TinyGPS library v. "); 
  Serial.println(TinyGPS::library_version());
  Serial.println("by Mikal Hart");
  Serial.println();
}

void loop()
{
  bool newData = false;

  // 1초 동안 GPS 데이터를 파싱
  for (unsigned long start = millis(); millis() - start < 1000;)
  {
    while (ss.available())
    {
      char c = ss.read();
      Serial.write(c); // GPS 데이터 출력
      if (gps.encode(c)) // 새로운 유효한 문장이 들어왔는가?
        newData = true;
    }
  }

  if (newData)
  {
    float flat, flon;
    unsigned long age;
    gps.f_get_position(&flat, &flon, &age);
    Serial.print("LAT=");
    Serial.print(flat == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : flat, 6);
    Serial.print(" LON=");
    Serial.print(flon == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : flon, 6);
    Serial.print(" SAT=");
    Serial.print(gps.satellites() == TinyGPS::GPS_INVALID_SATELLITES ? 0 : gps.satellites());
    Serial.print(" PREC=");
    Serial.print(gps.hdop() == TinyGPS::GPS_INVALID_HDOP ? 0 : gps.hdop());
    Serial.println();
  }

  if (!newData)
    Serial.println("** No new GPS data received **");

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
