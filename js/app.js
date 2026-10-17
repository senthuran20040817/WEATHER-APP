let area = "Panadura";

loadData(area);
function searchCity() {
    area=document.getElementById("txtSearchCity").value;
    loadData(area);
}

let choice = "c";
function unit_c() {
    document.getElementById("temp_c").innerHTML = `<input class="h-9 w-9 rounded-md bg-[#313D82] hover:text-white text-white dark:bg-[#6EA2FF]"
                    type="button" value="ºC" onclick="unit_c()">`
    document.getElementById("temp_f").innerHTML = `<input class="h-9 w-9 rounded-md bg-white hover:bg-[#313D82] hover:text-white text-[#4A5A72] dark:hover:bg-[#6EA2FF] dark:bg-transparent"
                    type="button" value="ºF" onclick="unit_f()">`
    choice = "c";
    loadData(area);
}
function unit_f() {
    document.getElementById("temp_c").innerHTML = `<input class="h-9 w-9 rounded-md bg-white hover:bg-[#313D82] hover:text-white text-[#4A5A72] dark:bg-transparent dark:hover:bg-[#6EA2FF]"
                    type="button" value="ºC" onclick="unit_c()">`
    document.getElementById("temp_f").innerHTML = `<input class="h-9 w-9 rounded-md bg-[#313D82] hover:bg-[#313D82] hover:text-white text-white dark:bg-[#6EA2FF]"
                    type="button" value="ºF" onclick="unit_f()">`
    choice = "f";
    loadData(area);
}

document.getElementById("toggle1").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
});

document.getElementById("toggle2").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
});

async function loadData(city) {
    const response = await fetch("api/get-data.js?city=" + city);
    const data = await response.json();
    document.getElementById("location").innerText = data.location.name + ", " + data.location.country;
    document.getElementById("time").innerText = data.location.localtime + " Updated just now";
    document.getElementById("currentTemperature").innerText = `${data.current["temp_" + choice]}º`;
    document.getElementById("conditionText").innerText = data.current.condition.text;
    document.getElementById("feelsLike").innerText = "Feels like " + data.current["feelslike_" + choice] + "º. High " + data.forecast.forecastday[0].day["maxtemp_" + choice] + "º. Low " + data.forecast.forecastday[0].day["mintemp_" + choice] + "º";
    document.getElementById("mainIcon").innerHTML = `<img class="w-50" src="${data.current.condition.icon}" alt="">`;

    let currentHourIndex = data.forecast.forecastday[0].hour.findIndex(element => element.time.substring(11, 13) === data.location.localtime.substring(11, 13))

    let count = 0;
    for (let i = currentHourIndex; i < data.forecast.forecastday[0].hour.length && count < 8; i++) {
        count++;
        if (count == 1) {
            document.getElementById("now").innerText = "Now";
            document.getElementById("img-now").innerHTML = `<img class="w-10" src="${data.forecast.forecastday[0].hour[currentHourIndex].condition.icon}" alt="">`;
            document.getElementById("temp-now").innerText = data.forecast.forecastday[0].hour[currentHourIndex]["temp_" + choice] + "º";
        } else {
            let time = data.forecast.forecastday[1].hour[i].time.substring(11, 12) === "0" ? data.forecast.forecastday[1].hour[i].time.substring(12, 13) : data.forecast.forecastday[1].hour[i].time.substring(11, 13);
            let timeSuffix = time > 12 ? "PM" : "AM";
            if (time > 12) {
                time = time - 12;
            }
            document.getElementById(`now+${count - 1}`).innerText = time + timeSuffix;
            document.getElementById(`img-now+${count - 1}`).innerHTML = `<img class="w-10" src="${data.forecast.forecastday[0].hour[currentHourIndex + count - 1].condition.icon}" alt="">`;
            document.getElementById(`temp-now+${count - 1}`).innerText = data.forecast.forecastday[0].hour[currentHourIndex + count - 1]["temp_" + choice] + "º";
        }
    }
    if (count < 8) {
        let num = count;
        for (let i = 0; i < 8 - num; i++) {
            count++;
            console.log(count);
            let time = data.forecast.forecastday[1].hour[i].time.substring(11, 12) === "0" ? data.forecast.forecastday[1].hour[i].time.substring(12, 13) : data.forecast.forecastday[1].hour[i].time.substring(11, 13);
            let timeSuffix = time > 12 ? "PM" : "AM";
            document.getElementById(`now+${count - 1}`).innerText = time + timeSuffix;
            document.getElementById(`img-now+${count - 1}`).innerHTML = `<img class="w-10" src="${data.forecast.forecastday[1].hour[i].condition.icon}" alt="">`;
            document.getElementById(`temp-now+${count - 1}`).innerText = data.forecast.forecastday[1].hour[i]["temp_" + choice] + "º";
        }
    }

    function getDayName(index) {
        let year = data.forecast.forecastday[index].date.substring(0, 4);
        let month = data.forecast.forecastday[index].date.substring(5, 7);
        let day = data.forecast.forecastday[index].date.substring(8, 10);
        const date = new Date(year, month, day);
        return ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'][date.getDay()];
    }


    for (let i = 0; i < 7; i++) {
        console.log(i);
        if (i === 0) {
            document.getElementById("day+1").innerText = "Today";
        } else {
            document.getElementById(`day+${i + 1}`).innerText = getDayName(i);
        }

        let min = data.forecast.forecastday[i].day.mintemp_c;
        let max = data.forecast.forecastday[i].day.maxtemp_c;
        let minTemp = data.forecast.forecastday[i].day["mintemp_" + choice];
        let maxTemp = data.forecast.forecastday[i].day["maxtemp_" + choice];
        document.getElementById(`img-day+${i + 1}`).innerHTML = `<img class="w-8 mx-2" src="${data.forecast.forecastday[i].day.condition.icon}" alt="">`;
        document.getElementById(`temp-min-day+${i + 1}`).innerText = minTemp + "º";
        document.getElementById(`progress-day+${i + 1}`).innerHTML = `<div class="bg-[#313D82] dark:bg-[#6EA2FF] h-1.5 rounded-full" style="margin-left: ${min}%; width: ${(max - min) * 4}%"></div>`;
        document.getElementById(`temp-max-day+${i + 1}`).innerText = maxTemp + "º";
    }

    document.getElementById("wind").innerText = data.current.wind_kph;
    document.getElementById("humidity").innerText = data.current.humidity;
    document.getElementById("humidity-bar").innerHTML = `<div class="bg-[#313D82] dark:bg-[#6EA2FF] h-2 rounded-full" style="width: ${data.current.humidity}%"></div>`;

    let uv = data.current.uv;
    document.getElementById("uv-index").innerText = uv;
    document.getElementById("uv-text").innerText = uv >= 0 && uv <= 2 ? "Low" : uv > 2 && uv <= 7 ? "Moderate" : uv > 7 && uv < 10 ? "Very High" : uv > 10 ? "Extreme" : null;
    document.getElementById("uv-bar").innerHTML = `<div class="bg-[#B45309] dark:bg-[#FBBF24] h-2 rounded-full" style="width: ${uv * 4}%"></div>`;

    document.getElementById("sunrise").innerText = data.forecast.forecastday[0].astro.sunrise;
    document.getElementById("sunset").innerText = data.forecast.forecastday[0].astro.sunset;

    let dir = data.current.wind_dir;
    console.log(dir);
    document.getElementById("wind-direction").innerText = "From the " + (dir == "N" ? "North" :
        dir == "W" ? "West" :
            dir == "S" ? "South" :
                dir == "E" ? "East" :
                    dir == "NW" ? "North-West" :
                        dir == "NE" ? "North-East" :
                            dir == "SW" ? "South-West" :
                                dir == "NNE" ? "North-Northeast" :
                                    dir == "ENE" ? "East-Northeast" :
                                        dir == "ESE" ? "East-Southeast" :
                                            dir == "SSE" ? "South-Souteast" :
                                                dir == "SSW" ? "South-Southwest" :
                                                    dir == "WSW" ? "West-Southwest" :
                                                        dir == "WNW" ? "West-Northwest" :
                                                            dir == "NNW" ? "North-Northwest" : "Calm");

}


