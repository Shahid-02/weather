let input = document.getElementById("cityname");
let searchbtn = document.getElementById("searchbtn");
let cityNameElement = document.getElementById("city");
let temp = document.getElementById("temp");
let description = document.getElementById("description");
let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");
let weatherIcon = document.getElementById("weather-icon");
let errorMassage = document.getElementById("error")

const apiCall = async (cityName) => {
  let api = `http://localhost:4000/weather/city/${cityName}`;
  try {
    const response = await fetch(api);
    const data = await response.json()
    console.log(data);
    return data;
  } catch (error) {
    errorMassage.textContent = "City not found. Please try again.....!";
    errorMassage.style.display = "block"
    console.log("Error fetching data", error);
    throw error;
  }
};

searchbtn.addEventListener("click", async () => {
  let cityName = input.value;

  try {
    let fdata = await apiCall(cityName);

    cityNameElement.textContent = `Weather in ${cityName}`;
    temp.textContent = `${fdata.result.data.main.temp}°C`;
    description.textContent = `${fdata.result.data.weather[0].description}`;
    humidity.textContent = `Humidity: ${fdata.result.data.main.humidity}`;
    wind.textContent = `Wind Speed: ${fdata.result.data.wind.speed} km/h`;

    const iconCode = fdata.result.data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    weatherIcon.src = iconUrl;
  } catch (error) {
    console.log("Error:", error);
  }
  input.value = "";
  input.focus();
});