const axios = require('axios');


const apiKey = process.env.APIKEY;  
const city = 'Seoul';  
const lat = '37.5491';
const lon = '126.7234';




// const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=kr`;

const view = async(req, res) => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

        const weatherInfo = await fetchWeatherData(url);
        

        


        //console.log(`날씨 정보: ${city}`);
        console.log(`온도: ${weatherInfo.temperature}°C`);
        //console.log(`상태: ${weatherInfo.description}`);
        console.log(`상태: ${weatherInfo.mainWeather}`);
        console.log(`습도: ${weatherInfo.humidity}%`);
        console.log(`이미지: ${weatherInfo.weatherImage}`)

        res.render('weather/weatherView', {weatherInfo});
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('500 Error: ' + error);
    }
};


const fetchWeatherData = async (url) => {
    const response = await axios.get(url);
    const weatherData = response.data;

    const temperature = Math.round(weatherData.main.temp);
    //let description = weatherData.weather[0].description;
    //let mainWeather = weatherData.weather[0].main;
    let mainWeather = weatherData.weather[0].id;
    const humidity = weatherData.main.humidity;

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    
    let weatherImage = '';
    let message = '';
        
    
    if (mainWeather >= 300 && mainWeather <= 321) {
        mainWeather = '안개';
        weatherImage = 'cloud.png';
    } else if (mainWeather >= 200 && mainWeather <= 232) {
        mainWeather = '천둥번개';
        weatherImage = 'lightning.png';
    } else if (mainWeather >= 500 && mainWeather <= 531) {
        mainWeather = '비';
        weatherImage = 'rainy_day.png';
    } else if (mainWeather >= 600 && mainWeather <= 622) {
        mainWeather = '눈';
        weatherImage = 'snowfall.png';
    } else if (mainWeather >= 700 && mainWeather <= 781) {
        mainWeather = '흐림';
        weatherImage = 'sun_cloud.png';
    } else if (mainWeather === 800) {
        mainWeather = '맑음';
        if ((currentHour >= 18 && currentHour <= 23) || (currentHour >= 0 && currentHour < 6)) {
            console.log("저녁 시간입니다.");
            weatherImage = 'moon.png';
        } else {
            console.log("낮 시간입니다.");
            weatherImage = 'sun.png';
        }
    } else if (mainWeather >= 801 && mainWeather <= 804) {
        mainWeather = '구름많음';
        weatherImage = 'cloud.png';
    }

    
    if (temperature > 30) {
        message = '더운 날씨에는 강아지가 더위를 먹지 않도록 <br>아침이나 저녁에 산책하세요. 충분한 물도 잊지 마세요! 🌡️💧';
    } else if (temperature > 20) {
        message = '오늘은 산책하기 좋은 맑은 날씨예요!<br> 강아지와 함께 가벼운 산책을 즐겨보세요! 🐾🌞';
    } else if (temperature > 10) {
        message = '날씨가 꽤 추워요. 강아지가 추위를 타지 않도록 <br> 짧게 산책하거나 따뜻한 옷을 챙겨주세요! ❄️🐕';
    } else {
        message = '매우 추운 날씨예요! <br> 외출은 최소화하고, 꼭 두꺼운 옷을 입히세요. <br> 실내에서 간단한 운동을 해보는 것도 좋아요. ❄️🐕‍🦺';
    }
    
    
    return { temperature, humidity, mainWeather, weatherImage, message };
};


module.exports = {
    view,
    
};