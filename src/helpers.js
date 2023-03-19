function splitParams(params) {
  return params.split(":");
}

// Reset time back to 00:00:00:00 for the given date
function zeroClock(date) {
  date.setMinutes(0);
  date.setHours(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

module.exports = { splitParams, zeroClock };
