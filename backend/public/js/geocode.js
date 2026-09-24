const axios = require('axios');
require('dotenv').config();
const mapToken = process.env.MAP_TOKEN;
const geocodingToken = process.env.GEO_CODING_API_KEY;


//geocoding 
async function forwardGeocode(query) {
  if (!geocodingToken) throw new Error("Missing OpenCage API key");
  const url = 'https://api.opencagedata.com/geocode/v1/json';

  const response = await axios.get(url, {
    params: {
         key: geocodingToken, 
         q: query,
         limit: 1 ,
        }
  });

  const result = response.data.results[0];
  if (!result) return null;

  return {
    lat: result.geometry.lat,
    lng: result.geometry.lng,
    formatted: result.formatted,
  };
}

 module.exports = { forwardGeocode };