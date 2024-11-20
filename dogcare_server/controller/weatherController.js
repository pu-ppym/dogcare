const axios = require('axios');

/*
const apiKey = 'YOUR_API_KEY';  
const city = 'Seoul';  // 원하는 도시 이름

const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=kr`;
*/

const view = async(req, res) => {
    try {
        const response = await axios.get(url);
        const weatherData = response.data;
        const temperature = weatherData.main.temp;  // 온도
        const description = weatherData.weather[0].description;  // 날씨 설명
        const humidity = weatherData.main.humidity;  // 습도

        console.log(`날씨 정보: ${city}`);
        console.log(`온도: ${temperature}°C`);
        console.log(`상태: ${description}`);
        console.log(`습도: ${humidity}%`);

        res.render('weather/weatherView', {
            city,
            temperature,
            description,
            humidity
        });
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
};

module.exports = {
    view
};