function convertTo24Hour(time) {
    var hours = parseInt((time.split(':'))[0])
    if(time.indexOf('am') != -1 && hours == 12) {
        time = time.replace('12', '0')
    }
    if(time.indexOf('pm')  != -1 && hours < 12) {
        time = time.replace(hours, (hours + 12))
    }
    return time.replace(/(am|pm)/, '') + ':00'
}

function convertTo12Hour(time) {
    var hours = parseInt((time.split(':'))[0])
    var mins = parseInt((time.split(':'))[1])
    if (hours > 12)
        time = (hours - 12) + ':' + mins
    else if (hours == 12)
        time = time.substr(0, time.length-3)
    else if (hours == 0)
        time = '12' + time.substr(2, time.length)
    else 
        time = hours + ':' + mins
    return hours >= 12 ? time + ' pm' : time + ' am'
}

module.exports = {
    convertTo12Hour,
    convertTo24Hour
}