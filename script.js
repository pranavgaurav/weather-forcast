
const apiKey = 'd8c9ce7e0d58e4cf0d23e4bc493b9088'; 

async function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) return;

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    const data = await response.json();
    updateCurrentWeather(data);

    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
    const forecastData = await forecastResponse.json();
    updateForecast(forecastData);
}

function updateCurrentWeather(data) {
    document.getElementById('city-name').textContent = `${data.name} (${new Date().toISOString().split('T')[0]})`;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById('wind').textContent = `Wind: ${data.wind.speed} M/S`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    document.getElementById('weather-description').textContent = data.weather[0].description;
}

function updateForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt_txt).toISOString().split('T')[0];
        const temp = forecast.main.temp;
        const wind = forecast.wind.speed;
        const humidity = forecast.main.humidity;
        const icon = forecast.weather[0].icon;
        const description = forecast.weather[0].description;

        const forecastItem = document.createElement('div');
        forecastItem.className = 'bg-gray-200 p-4 rounded-lg text-center';
        forecastItem.innerHTML = `
            <p>${date}</p>
            <img class="weather-icon" src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather icon"/>
            <p>Temp: ${temp}°C</p>
            <p>Wind: ${wind} M/S</p>
            <p>Humidity: ${humidity}%</p>
        `;
        forecastContainer.appendChild(forecastItem);
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
            const data = await response.json();
            updateCurrentWeather(data);

            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
            const forecastData = await forecastResponse.json();
            updateForecast(forecastData);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}