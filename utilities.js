async function getF1Sessions() {
  const response = await fetch(
    "https://api.openf1.org/v1/sessions?year=2025"
  );

  const data = await response.json();

  console.log(data);
}

getF1Sessions();