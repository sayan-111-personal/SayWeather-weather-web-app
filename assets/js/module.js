/**
 * @fileoverview All module functions
 * @copyright Sayan Paul 2024 All rights reserved
 * @author Sayan Paul <sayaanpaul666.ap@gmail.com>
 */

'use strict'

export const weekDays = [
    "Sunday",
    "Monday",
    "Tuessday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

export const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
]

/**
 * @param {Number} dateUnix Unix Date in seconds
 * @param {Number} timeZone Timezone shift from UTC in seconds
 * @returns {String} Date String. Example: "Wednesay 19, Jun"
 */
export const getDate = function(dateUnix, timeZone) {
    const date = new Date((dateUnix+timeZone)*1000)
    const weekDay = weekDays[date.getUTCDay()]
    const month = months[date.getUTCMonth()]

    return `${weekDay} ${date.getUTCDate()}, ${month}`
}

/**
 * @param {Number} timeUnix Unix Time in seconds
 * @param {Number} timeZone Timezone shift from UTC in seconds
 * @returns {String} Time String. Example: "9:27 PM/AM"
 */
export const getTime = function(timeUnix, timeZone) {
    const date = new Date((timeUnix+timeZone)*1000)
    const hour = date.getUTCHours()
    const minute = date.getUTCMinutes()
    const period = hour >= 12? "PM": "AM"

    return `${hour%12 || 12}:${minute} ${period}`
}

/**
 * @param {Number} timeUnix Unix Time in seconds
 * @param {Number} timeZone Timezone shift from UTC in seconds
 * @returns {String} Time String. Example: "9:27 PM/AM"
 */
export const getHour = function(timeUnix, timeZone) {
    const date = new Date((timeUnix+timeZone)*1000)
    const hour = date.getUTCHours()
    const period = hour >= 12? "PM": "AM"

    return `${hour%12 || 12} ${period}`
}

/**
 * @param {Number} mps Speed in metre per second (m/s)
 * @returns {Number} Speed in kilometre per hour (km/h)
 */
export const mpsToKmh = function(mps) {
    return mps*(18/5)
}

export const aqiMessage = {
    1: {
        level: "Good",
        message: "Air Quality is considered satisfactory, and air pollution poses little or no risk."
    },
    2: {
        level: "Fair",
        message: "Air Quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are usually sensitive to air pollution."
    },
    3: {
        level: "Moderate",
        message: "Members of sensitive groups may experience health effects. The general public is not likely to be affected."
    },
    4: {
        level: "Poor",
        message: "Everyone may begin to experience health efects; members of sensitive groups may experience more serious health effects."
    },
    5: {
        level: "Very Poor",
        message: "Health warnings of emergency conditions. The entire population is more likely to be affected."
    }
}