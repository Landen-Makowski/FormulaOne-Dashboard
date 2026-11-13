let meetings = [];

async function getF1Sessions() {
  const response = await fetch(
    "https://api.openf1.org/v1/sessions?year=2025"
  );

  const data = await response.json();

  const raceSelect = document.getElementById("race-select");

  data.forEach(function (session) {
    const alreadyAdded = meetings.some(function (meeting) {
      return meeting.meeting_key === session.meeting_key;
    });

    if (!alreadyAdded) {
      meetings.push(session);
    }
  });

  meetings.forEach(function (meeting) {
    const option = document.createElement("option");

    option.value = meeting.meeting_key;
    option.textContent =
      meeting.country_name + " - " + meeting.location;

    raceSelect.appendChild(option);
  });
}

const raceForm = document.getElementById("race-form");

raceForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const raceSelect = document.getElementById("race-select");
  const selectedMeetingKey = Number(raceSelect.value);

  const selectedRace = meetings.find(function (meeting) {
    return meeting.meeting_key === selectedMeetingKey;
  });

  if (selectedRace) {
  displayRaceInfo(selectedRace);
  getWeather(selectedRace);
}
});

function displayRaceInfo(race) {
  const raceInfo = document.getElementById("race-info");

  raceInfo.innerHTML = `
    <h3>${race.country_name} Grand Prix</h3>
    <p><strong>Location:</strong> ${race.location}</p>
    <p><strong>Circuit:</strong> ${race.circuit_short_name}</p>
    <p><strong>Year:</strong> ${race.year}</p>
  `;
}

getF1Sessions();

async function getWeather(race) {
  const searchName = race.location;

  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${searchName}&count=1`
  );

  const geoData = await geoResponse.json();

  if (!geoData.results) {
    document.getElementById("weather-info").innerHTML =
      "<p>Weather information could not be found.</p>";
    return;
  }

  const latitude = geoData.results[0].latitude;
  const longitude = geoData.results[0].longitude;

  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`
  );

  const weatherData = await weatherResponse.json();

  displayWeather(weatherData);
}

function displayWeather(weather) {
  const weatherInfo = document.getElementById("weather-info");

  weatherInfo.innerHTML = `
    <h3>Current Conditions</h3>

    <p>
      <strong>Temperature:</strong>
      ${weather.current.temperature_2m}
      ${weather.current_units.temperature_2m}
    </p>

    <p>
      <strong>Humidity:</strong>
      ${weather.current.relative_humidity_2m}
      ${weather.current_units.relative_humidity_2m}
    </p>

    <p>
      <strong>Precipitation:</strong>
      ${weather.current.precipitation}
      ${weather.current_units.precipitation}
    </p>

    <p>
      <strong>Wind Speed:</strong>
      ${weather.current.wind_speed_10m}
      ${weather.current_units.wind_speed_10m}
    </p>
  `;
}