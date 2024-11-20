#include <TinyGPS.h>

TinyGPS gps;
HardwareSerial ss(1); // 1번 하드웨어 직렬 포트 사용

const int heartRatePin = A6;  // 심박 센서 핀
const int vibrationPin = A7; // 진동 센서 핀

void setup()
{

  Serial.begin(115200); // 기본 직렬 모니터
  ss.begin(9600, SERIAL_8N1, 4, 3); // 핀 4를 RX, 핀 3을 TX로 설정

  pinMode(heartRatePin, INPUT); // 심박 센서 핀 초기화
  pinMode(vibrationPin, INPUT); // 진동 센서 핀 초기화

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

  // 심박 센서 데이터 읽기
  int heartRateValue = analogRead(heartRatePin);
  Serial.print("심박 센서 값: ");
  Serial.println(heartRateValue);

  // 진동 센서 데이터 읽기 (여러 번 측정하여 평균값을 계산)
  long vibrationSum = 0;
  for (int i = 0; i < 10; i++) {
    vibrationSum += analogRead(vibrationPin);
    delay(10);  // 짧은 지연을 두어 센서 안정화
  }
  int vibrationValue = vibrationSum / 10;  // 평균값 계산
  Serial.print("진동 센서 값: ");
  Serial.println(vibrationValue);

  delay(1000); // 1초 대기
}
