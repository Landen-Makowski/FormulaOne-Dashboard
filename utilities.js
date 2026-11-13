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