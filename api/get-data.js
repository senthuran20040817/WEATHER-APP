export default async function handler(req, res) {
  const city = req.query.city;
  const key = process.env.API_KEY;

  const url =
    "http://api.weatherapi.com/v1/forecast.json?key=" + key + "&q=" + city +"&days=7";


  const response = await fetch(url);
  const data = await response.json();
  res.status(200).json(data);
}    