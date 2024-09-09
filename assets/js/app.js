/**
 * @copyright Sayan Paul 2024 All rights reserved
 * @author Sayan Paul <sayaanpaul666.ap@gmail.com>
 */

"use strict"

import { fetchData, urls } from "./api.js";
import * as module from "./module.js";

/**
* Add event Listener on multiple elements
* @param {NodeList} elements Elements node array
* @param {String} eventType Type of event. Example: "click", "mouseover"
* @param {Function} callback Callback for event listener
*/
const addEventOnElements = function(elements, eventType, callback) {
    for (const element of elements) {
        element.addEventListener(eventType, callback)
    }
}

// Toggle Search in mobile devices
const searchView = document.querySelector("[data-search-view]")
const searchTogglers = document.querySelectorAll("[data-search-toggler]")

const toggleSearch = function() {
    searchView.classList.toggle("active")
}
addEventOnElements(searchTogglers, "click", toggleSearch)

// Search API Integration
const searchInput = document.querySelector("[data-search-field]")
const searchResult = document.querySelector("[data-search-result]")

let searchTimeout = null
const searchTimeoutDelay = 500

searchInput.addEventListener("input", function() {
    searchTimeout ?? clearTimeout(searchTimeout)

    if (!searchInput.value) {
        searchResult.classList.remove("active")
        searchResult.innerHTML = ""
        searchResult.classList.remove("searching")
    } else {
        searchResult.classList.add("searching")
    }

    if (searchInput.value) {
        searchTimeout = setTimeout(function() {
            fetchData(urls.geo(searchInput.value),
        function(locations) {
            searchResult.classList.remove("searching")
            searchResult.classList.add("active")
            searchResult.innerHTML = `
            <ul class="view-list" data-search-list></ul>
            `
            const items = []
            for (const {name, lat, lon, country, state} of locations) {
                const searchItem = document.createElement("li")
                searchItem.classList.add("view-item")
                searchItem.innerHTML = `
                <span class="m-icon">location_on</span>
                <div>
                    <p class="item-title">${name}</p>
                    <p class="label-2 item-subtitle">${state || ""} ${country}</p>
                </div>
                <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label=${name} data-search-toggler></a>
                `
                searchResult.querySelector("[data-search-list]").appendChild(searchItem)
                items.push(searchItem.querySelector("[data-search-toggler]"))
            }
            addEventOnElements(items, "click", function() {
                toggleSearch()
                searchResult.classList.remove("active")
            })
        })
        }, searchTimeoutDelay)
    }
})

// Update Weather
const container = document.querySelector("[data-container]")
const loading = document.querySelector("[data-loading]")
const currentLocationBtn = document.querySelector("[data-current-location-btn]")
const errorContent = document.querySelector("[data-error-content]")


/**
 * Fetch weather data and update UI
 * @param {Number} lat Latitude
 * @param {Number} long Longitude
*/
export const updateWeather = function(lat, long) {

    loading.style.display = "grid"
    container.style.overflowY = "hidden"
    container.classList.remove("fade-in")
    errorContent.style.display = "none"

    const currentWeatherSection = document.querySelector("[data-current-weather]")
    const highlightSection = document.querySelector("[data-highlights]")
    const hourlySection = document.querySelector("[data-hourly-forecast]")
    const forecastSection  =document.querySelector("[data-5-day-forecast]")

    currentWeatherSection.innerHTML = ""
    highlightSection.innerHTML = ""
    hourlySection.innerHTML = ""
    forecastSection.innerHTML = ""

    if(window.location.hash === "#/current-location") {
        currentLocationBtn.setAttribute("disabled", "")
    } else {
        currentLocationBtn.removeAttribute("disbled")
    }

    // currentWeatherSection
    fetchData(urls.currentWeather(lat, long), function(currentWeather) {

        const {
            weather,
            dt: dateUnix,
            sys: {sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC},
            main: {temp, feels_like, pressure, humidity},
            visibility,
            timezone
        } = currentWeather
        const [{description, icon}] = weather

        const card = document.createElement("div")
        card.classList.add("card", "card-lg", "current-weather-card")
        card.innerHTML = `
        <h2 class="title-2 card-title">Now</h2>

        <div class="weapper">
            <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>

            <img src="./assets/images/weather_icons/${icon}.png" width="64" height="64" alt="${description}" class="weather-icon">
        </div>

        <p class="body-3">${description}</p>

        <ul class="meta-list">
            <li class="meta-item">
                <span class="m-icon">calendar_today</span>
                <p class="title-3 meta-text">${module.getDate(dateUnix, timezone)}</p>
            </li>
            <li class="meta-item">
                <span class="m-icon">location_on</span>
                <p class="title-3 meta-text" data-location></p>
            </li>
        </ul>
        `
        fetchData(urls.reverseGeo(lat, long), function([{name, country}]) {
            card.querySelector("[data-location]").innerHTML = `${name}, ${country}`
        })
        currentWeatherSection.appendChild(card)

        // Today's Highlights
        fetchData(urls.airPollution(lat, long), function(airPollution) {

            const [{
                main: {aqi},
                components: {no2, o3, so2, pm2_5},
            }] = airPollution.list

            const card = document.createElement("div")
            card.classList.add("card", "card-lg")
            card.innerHTML = `
            <h2 class="title-2" id="highlights-label">Todays Highlights</h2>

            <div class="highlight-list">

                <div class="card card-sm highlight-card one">

                    <h3 class="title-3">Air Quality Index</h3>

                    <div class="wrapper">

                        <span class="m-icon">air</span>

                        <ul class="card-list">

                            <li class="card-item">
                                <p class="title-1">${pm2_5.toFixed(2)}</p>
                                <p class="label-1">PM<sub>2.5</sub></p>
                            </li>

                            <li class="card-item">
                                <p class="title-1">${so2.toFixed(2)}</p>
                                <p class="label-1">SO<sub>2</sub></p>
                            </li>

                            <li class="card-item">
                                <p class="title-1">${no2.toFixed(2)}</p>
                                <p class="label-1">NO<sub>2</sub></p>
                            </li>

                            <li class="card-item">
                                <p class="title-1">${o3.toFixed(2)}</p>
                                <p class="label-1">0<sub>3</sub></p>
                            </li>

                        </ul>

                    </div>

                    <span class="badge aqi-${aqi} label-${aqi}" title="${module.aqiMessage[aqi].message}">${module.aqiMessage[aqi].level}</span>

                </div>

                <div class="card card-sm highlight-card two">

                    <h3 class="title-3">Sunrise & Sunset</h3>

                    <div class="card-list">

                        <div class="card-item">

                            <span class="m-icon">clear_day</span>

                            <div>
                                <p class="label-1">Sunrise</p>
                                <p class="title-1">${module.getTime(sunriseUnixUTC, timezone)}</p>
                            </div>

                        </div>

                        <div class="card-item">

                            <span class="m-icon">clear_night</span>

                            <div>
                                <p class="label-1">Sunset</p>
                                <p class="title-1">${module.getTime(sunsetUnixUTC, timezone)}</p>
                            </div>

                        </div>

                    </div>

                </div>

                <div class="card card-sm highlight-card">

                    <h3 class="title-3">Humidity</h3>

                    <div class="wrapper">
                        <span class="m-icon">humidity_percentage</span>
                        <p class="title-1">${humidity}<sub>%</sub></p>
                    </div>

                </div>

                <div class="card card-sm highlight-card">

                    <h3 class="title-3">Pressure</h3>

                    <div class="wrapper">
                        <span class="m-icon">airwave</span>
                        <p class="title-1">${pressure}<sub>hPa</sub></p>
                    </div>

                </div>

                <div class="card card-sm highlight-card">

                    <h3 class="title-3">Visibility</h3>

                    <div class="wrapper">
                        <span class="m-icon">visibility</span>
                        <p class="title-1">${visibility/1000}<sub>km</sub></p>
                    </div>

                </div>

                <div class="card card-sm highlight-card">

                    <h3 class="title-3">Feels like</h3>

                    <div class="wrapper">
                        <span class="m-icon">thermostat</span>
                        <p class="title-1">${parseInt(feels_like)}&deg;<sup>c</sup></p>
                    </div>

                </div>

            </div>
            `
            highlightSection.appendChild(card)

        })

        // 24 Hourly Forecast
        fetchData(urls.forecast(lat, long), function(forecast) {

            const {
                list: forecastList,
                city: {timezone}
            } = forecast

            hourlySection.innerHTML = `
            <h2 class="tile-2">Today at</h2>

            <div class="slider-container">
                <ul class="slider-list" data-temp></ul>

                <ul class="slider-list" data-wind></ul>
            </div>
            `

            for (const [index, data] of forecastList.entries()) {
                if (index>7) break;

                const {
                    dt: dateTimeUnix,
                    main: {temp},
                    weather,
                    wind: {deg: windDirection, speed: windSpeed}
                } = data
                const [{ icon, description }] = weather

                const temperatureLi = document.createElement("li")
                temperatureLi.classList.add("slider-item")
                temperatureLi.innerHTML = `
                <div class="card card-sm slider-card">

                    <p class="body-3">${module.getHour(dateTimeUnix, timezone)}</p>

                    <img src="./assets/images/weather_icons/${icon}.png" alt="${description}" width="48" height="48" loading="lazy" title="${description}" class="weather-icon">

                    <p class="body-3">${parseInt(temp)}&deg;</p>

                </div>
                `
                hourlySection.querySelector("[data-temp]").appendChild(temperatureLi)

                const windLi = document.createElement("li")
                windLi.classList.add("slider-item")
                windLi.innerHTML = `
                <div class="card card-sm slider-card">
                    <p class="body-3">${module.getHour(dateTimeUnix, timezone)}</p>

                    <img src="./assets/images/weather_icons/direction.png" alt="direction" width="48" height="48" loading="lazy" class="weather-icon" style="transform: rotate(${windDirection - 180}deg)">

                    <p class="body-3">${parseInt(module.mpsToKmh(windSpeed))} km/h</p>
                </div>
                `
                hourlySection.querySelector("[data-wind]").appendChild(windLi)
            }

            // 5 Day Forecast
            forecastSection.innerHTML = `
            <h2 class="title-2" id="forecast-label">5 Days Forecast</h2>

            <div class="card card-lg forecast-card">
                <ul data-forecast-list></ul>
            </div>
            `

            for (let i=7, len=forecastList.length; i<len; i+=8) {

                const {
                    main: {temp_max},
                    weather,
                    dt_txt
                } = forecastList[i]
                const [{ icon, description }] = weather
                const date = new Date(dt_txt)

                const dayLi = document.createElement("li")
                dayLi.classList.add("card-item")
                dayLi.innerHTML = `
                <div class="icon-wrapper">
                    <img src="./assets/images/weather_icons/${icon}.png" alt="${description}" width="36" height="36" class="weather-icon" title="${description}">

                    <span class="span">
                        <p class="title-2">${parseInt(temp_max)}&deg;</p>
                    </span>
                </div>

                <p class="label-1">${date.getDate()} ${module.months[date.getUTCMonth()]}</p>

                <p class="label-1">${module.weekDays[date.getUTCDay()]}</p>
                `
                forecastSection.querySelector("[data-forecast-list]").appendChild(dayLi)

            }

            loading.style.display = "none"
            container.style.overflowY = "overlay"
            container.classList.add("fade-in")

        })

    })

}


// Render Error Section
export const error404 = function() {
    errorContent.style.display = "flex"
}