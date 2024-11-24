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

    const temperature = weatherData.main.temp;
    //let description = weatherData.weather[0].description;
    //let mainWeather = weatherData.weather[0].main;
    let mainWeather = weatherData.weather[0].id;
    const humidity = weatherData.main.humidity;

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    
    let weatherImage = '';
        if (temperature) {
            weatherImage = 'sun.png';
        }

    

    if (mainWeather >= 300 && mainWeather <= 321) {
        mainWeather = '안개';
        weatherImage = '';
    } else if (mainWeather >= 200 && mainWeather <= 232) {
        mainWeather = '천둥번개';
    } else if (mainWeather >= 500 && mainWeather <= 531) {
        mainWeather = '비';
    } else if (mainWeather >= 600 && mainWeather <= 622) {
        mainWeather = '눈';
    } else if (mainWeather >= 700 && mainWeather <= 781) {
        mainWeather = '흐림';
    } else if (mainWeather === 800) {
        mainWeather = '맑음';
        if ((currentHour >= 18 && currentHour <= 23) || (currentHour >= 0 && currentHour < 6)) {
            console.log("저녁 시간입니다.");
        } else {
            console.log("낮 시간입니다.");
        }
    } else if (mainWeather >= 801 && mainWeather <= 804) {
        mainWeather = '구름많음';
        weatherImage = 'cloud.png';
    }
    

    return { temperature, humidity, mainWeather, weatherImage };
};


module.exports = {
    view,
    
};