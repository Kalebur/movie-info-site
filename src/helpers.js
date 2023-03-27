function filterUpcoming(item) {
  const today = new Date();
  zeroClock(today);

  const releaseDate = new Date(item.release_date);

  return (
    releaseDate > today &&
    item.original_language === "en" &&
    item.adult === false &&
    item.poster_path !== null
  );
}

function filterNowPlaying(movie) {
  const release = new Date(movie.release_date);
  const earliestRelease = zeroClock(new Date());
  earliestRelease.setDate(earliestRelease.getDate() - 21);

  return (
    release >= earliestRelease &&
    release <= new Date() &&
    movie.original_language === "en" &&
    movie.poster_path !== null
  );
}

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

module.exports = { filterNowPlaying, filterUpcoming, splitParams, zeroClock };
