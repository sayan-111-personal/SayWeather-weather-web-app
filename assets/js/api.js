/**
 * @fileoverview All api related stuff like api_key, api request etc.
 * @copyright Sayan Paul 2024 All rights reserved
 * @author Sayan Paul <sayaanpaul666.ap@gmail.com>
 */

'use strict'

const apiKey = "859986fd1ed20a2266a35c70fefc2300"

/**
 * Fetch data from server
 * @param {string} URL API url
 * @param {Function} callback callback
 */
export const fetchData = function(URL, callback) {
    fetch(`${URL}&appid=${apiKey}`)
        .then((response) => {return response.json()})
        .then((data) => callback(data))
}


export const urls = {
    currentWeather(lat, long) {
        return `https://api.openweathermap.org/data/2.5/weather?${lat}&${long}&units=metric`
    },

    forecast(lat, long) {
        return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${long}&units=metric`
    },

    airPollution(lat, long) {
        return `http://api.openweathermap.org/data/2.5/air_pollution?${lat}&${long}`
    },
 
    reverseGeo(lat, long) {
        return `http://api.openweathermap.org/geo/1.0/reverse?${lat}&${long}&limit=5`
    }, 

    /**
     * @param {String} query Search query Example: "Kolkata", "Varanasi"
    */
    geo(query) {
        return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
    }
    
}
