const dotenv = require("dotenv").config();
let genres;

// Reset time back to 00:00:00:00 for the given date
function zeroClock(date) {
  date.setMinutes(0);
  date.setHours(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

async function initializeGenres() {
  const response = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.MOVIE}&language=en-US`
  );
  const genreList = await response.json();

  genres = [...genreList.genres];
}

function filterUpcoming(arr) {
  const today = new Date();
  zeroClock(today);

  return arr.filter((item) => {
    const releaseDate = new Date(item.release_date);

    return (
      releaseDate > today &&
      item.original_language === "en" &&
      item.adult === false
    );
  });
}

async function getUpcomingMovies() {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.MOVIE}&language=en-US&page=1`
  );
  const movies = await response.json();
  let page = 2;

  let upcoming = filterUpcoming(movies.results);

  while (upcoming.length < 10 && page < movies.total_pages) {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.MOVIE}&language=en-US&page=${page}`
    );
    const movs = await res.json();

    let filtered = filterUpcoming(movs.results);
    upcoming.push(...filtered);

    page++;
  }

  // sort upcoming by date
  upcoming = upcoming.sort((a, b) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);

    return dateA - dateB;
  });

  return { movies: movies, upcoming: upcoming };
}

function genreList() {
  return genres;
}

module.exports = { getUpcomingMovies, initializeGenres, genreList };