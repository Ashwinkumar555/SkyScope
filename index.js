const API_KEY = '324e8d3b93a91cf1a86649c540a906cb'; // replace with your OpenWeatherMap key

const form = document.getElementById("citySearchForm");
const cityInput = document.getElementById("cityInput");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value;
  if (city) {
    getWeather(city);
  }
});

async function getWeather(city) {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
  const data = await res.json();

  const { lat, lon } = data.coord;

  document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById("description").textContent = data.weather[0].main;
  document.getElementById("location").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("extra").textContent =
    `Wind: ${data.wind.speed} km/h | Rain: ${data.rain?.['1h'] || 0}% | Humidity: ${data.main.humidity}%`;
  document.getElementById("icon").innerHTML = getWeatherIcon(data.weather[0].icon);

  getForecast(lat, lon);
}

async function getForecast(lat, lon) {
  const res = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${API_KEY}`);
  const data = await res.json();

  displayHourly(data.hourly.slice(0, 7));
  displayDaily(data.daily.slice(0, 7));
}

function displayHourly(hourlyData) {
  const hourly = document.getElementById("hourly");
  hourly.innerHTML = "";
  hourlyData.forEach(hour => {
    const date = new Date(hour.dt * 1000);
    const hourText = date.getHours() + "h";
    const temp = Math.round(hour.temp);
    const icon = getWeatherIcon(hour.weather[0].icon);

    hourly.innerHTML += `
      <div class="hour-card">
        ${hourText}<br>${icon}<br>${temp}°C
      </div>
    `;
  });
}

function displayDaily(dailyData) {
  const daily = document.getElementById("daily");
  daily.innerHTML = "";
  dailyData.forEach(day => {
    const date = new Date(day.dt * 1000);
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const temp = Math.round(day.temp.day);
    const icon = getWeatherIcon(day.weather[0].icon);

    daily.innerHTML += `
      <div class="day-card">
        <span>${weekday}</span>
        <span>${icon}</span>
        <span>${temp}°C</span>
      </div>
    `;
  });
}

function getWeatherIcon(code) {
  return `<img src="https://openweathermap.org/img/wn/${code}@2x.png" width="40" />`;
}
