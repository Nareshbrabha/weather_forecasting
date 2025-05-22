const apiKey = 'f27b269d54e4fa1e72993364a80fa8bd'; // Your API key
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
let particlesInstance;

// Initialize Particles.js
particlesJS.load('particles-js', 'particles.json', function (instance) {
    particlesInstance = instance; // Store the Particles.js instance
});

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeather(city);
    } else {
        alert('Please enter a city name');
    }
});

async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        if (data.cod === 200) {
            displayWeather(data);
            updateBackground(data.main.temp);
            updateParticles(data.main.temp); // Update particles based on temperature
        } else {
            weatherInfo.innerHTML = `<p class="error">City not found. Please try again.</p>`;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayWeather(data) {
    const { name, main, weather, wind } = data;
    const iconClass = getWeatherIconClass(weather[0].id, main.temp); // Pass temperature for icon selection

    weatherInfo.innerHTML = `
        <div class="weather-card">
            <i class="weather-icon ${iconClass}"></i>
            <h2>${name}</h2>
            <p>🌡️ Temperature: ${main.temp}°C</p>
            <p>☁️ Weather: ${weather[0].description}</p>
            <p>💧 Humidity: ${main.humidity}%</p>
            <p>🌬️ Wind Speed: ${wind.speed} m/s</p>
        </div>
    `;
}

function getWeatherIconClass(weatherId, temperature) {
    // Weather condition codes from OpenWeatherMap API
    if (weatherId >= 200 && weatherId < 300) {
        return 'wi wi-thunderstorm'; // Thunderstorm
    } else if (weatherId >= 300 && weatherId < 400) {
        return 'wi wi-sprinkle'; // Drizzle
    } else if (weatherId >= 500 && weatherId < 600) {
        return 'wi wi-rain'; // Rain
    } else if (weatherId >= 600 && weatherId < 700) {
        return 'wi wi-snow'; // Snow
    } else if (weatherId >= 700 && weatherId < 800) {
        return 'wi wi-fog'; // Atmosphere (fog, mist, etc.)
    } else if (weatherId === 800) {
        // Clear sky
        if (temperature >= 30) {
            return 'wi wi-day-sunny'; // Hot
        } else if (temperature < 10) {
            return 'wi wi-day-sunny'; // Cold
        } else {
            return 'wi wi-day-sunny'; // Normal
        }
    } else if (weatherId > 800) {
        // Cloudy
        if (temperature >= 30) {
            return 'wi wi-day-cloudy-high'; // Hot
        } else if (temperature < 10) {
            return 'wi wi-day-cloudy'; // Cold
        } else {
            return 'wi wi-day-cloudy'; // Normal
        }
    } else {
        return 'wi wi-day-sunny'; // Default
    }
}

function updateBackground(temperature) {
    let color1, color2;

    if (temperature < 0) {
        color1 = '#1e3c72'; // Dark Blue
        color2 = '#2a5298'; // Light Blue
    } else if (temperature >= 0 && temperature < 10) {
        color1 = '#4b6cb7'; // Blue
        color2 = '#182848'; // Dark Blue
    } else if (temperature >= 10 && temperature < 20) {
        color1 = '#00c6fb'; // Light Blue
        color2 = '#005bea'; // Blue
    } else if (temperature >= 20 && temperature < 30) {
        color1 = '#f46b45'; // Orange
        color2 = '#eea849'; // Yellow
    } else {
        color1 = '#ff4b2b'; // Red
        color2 = '#ff416c'; // Pink
    }

    document.body.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
}

function updateParticles(temperature) {
    if (particlesInstance) {
        if (temperature >= 30) {
            // High temperature: Very fast particles
            particlesInstance.particles.move.speed = 20;
            particlesInstance.particles.color.value = '#ff0000'; // Red particles
        } else if (temperature < 10) {
            // Cold temperature: Very slow particles
            particlesInstance.particles.move.speed = 0.5;
            particlesInstance.particles.color.value = '#00ffff'; // Light blue particles
        } else {
            // Normal temperature: Normal speed
            particlesInstance.particles.move.speed = 6;
            particlesInstance.particles.color.value = '#ffffff'; // White particles
        }
        particlesInstance.fn.particlesRefresh(); // Refresh particles to apply changes
    }
}