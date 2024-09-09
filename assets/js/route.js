/**
 * @fileoverview Menage all routes
 * @copyright Sayan Paul 2024 All rights reserved
 * @author Sayan Paul <sayaanpaul666.ap@gmail.com>
 */

"use strict"

import { updateWeather, error404 } from "./app.js";
const myLocation = "#/weather?lat=22.6239492&lon=88.411294"        //Nagerbazar, Kolkata

const currentLocation = function() {
    window.navigator.geolocation.getCurrentPosition((res)=>{const {latitude, longitude} = res.coords
    updateWeather(`lat=${latitude}`, `lon=${longitude}`)
    }, (err)=>{
        window.location.hash = myLocation
    })
}

/**
* @param {String} query Searched query
*/
const searchedLocation = (query) => updateWeather(...query.split("&"))
// updateWeather("lat=22.6239492", "long=88.411294")

const routes = new Map([
    ["/current-location", currentLocation],
    ["/weather", searchedLocation]
])

const checkHash = function() {
    const requestUrl = window.location.hash.slice(1)
    const [route, query] = requestUrl.includes("?") ? requestUrl.split("?") : [requestUrl]

    routes.get(route) ? routes.get(route)(query) : error404()
}

window.addEventListener("hashchange", checkHash)

window.addEventListener("load", function() {
    if (!window.location.hash) {
        window.location.hash = "/current-location"
    } else {
        checkHash()
    }
})