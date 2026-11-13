/*
AI Disclosure:
ChatGPT was used to help develop and refine portions of this JavaScript file.
Assistance included organizing Fetch API requests, working with JSON data,
adding event listeners, and troubleshooting syntax and logic errors.

I reviewed, tested, and modified the code as part of the development process.
*/

let meetings = [];

async function getF1Meetings() {
  const response = await fetch(
    "https://api.openf1.org/v1/meetings?year=2025"
  );

  const data = await response.json();

  meetings = data;

  const raceSelect = document.getElementById("race-select");

  meetings.forEach(function (meeting) {
    const option = document.createElement("option");

    option.value = meeting.meeting_key;
    option.textContent = meeting.meeting_name;

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
    getRaceWinner(selectedRace);
  }
});

function displayRaceInfo(race) {
  const raceInfo = document.getElementById("race-info");

  raceInfo.innerHTML = `
    <h3>${race.meeting_name}</h3>

    <img
      src="${race.circuit_image}"
      alt="Circuit layout for ${race.meeting_name}"
      class="circuit-image"
    >

    <p>
      <strong>Location:</strong>
      ${race.location}, ${race.country_name}
    </p>

    <p>
      <strong>Circuit:</strong>
      ${race.circuit_short_name}
    </p>

    <p>
      <strong>Circuit Type:</strong>
      ${race.circuit_type}
    </p>

    <p>
      <strong>Year:</strong>
      ${race.year}
    </p>
  `;
}

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

async function getRaceWinner(race) {
  const sessionsResponse = await fetch(
    `https://api.openf1.org/v1/sessions?meeting_key=${race.meeting_key}`
  );

  const sessions = await sessionsResponse.json();

  const raceSession = sessions.find(function (session) {
    return session.session_name === "Race";
  });

  if (!raceSession) {
    document.getElementById("winner-info").innerHTML =
      "<p>Race winner information could not be found.</p>";
    return;
  }

  const resultResponse = await fetch(
    `https://api.openf1.org/v1/session_result?session_key=${raceSession.session_key}&position=1`
  );

  const results = await resultResponse.json();

  if (results.length === 0) {
    document.getElementById("winner-info").innerHTML =
      "<p>Race winner information could not be found.</p>";
    return;
  }

  const winner = results[0];

  const driverResponse = await fetch(
    `https://api.openf1.org/v1/drivers?session_key=${raceSession.session_key}&driver_number=${winner.driver_number}`
  );

  const drivers = await driverResponse.json();

  if (drivers.length === 0) {
    document.getElementById("winner-info").innerHTML =
      "<p>Driver information could not be found.</p>";
    return;
  }

  displayWinner(drivers[0]);
}

function displayWinner(driver) {
  const winnerInfo = document.getElementById("winner-info");

  winnerInfo.innerHTML = `
    <h3>Race Winner</h3>

    <img
      src="${driver.headshot_url}"
      alt="${driver.full_name}"
      class="driver-image"
    >

    <p>
      <strong>Driver:</strong>
      ${driver.full_name}
    </p>

    <p>
      <strong>Team:</strong>
      ${driver.team_name}
    </p>
  `;
}

getF1Meetings();