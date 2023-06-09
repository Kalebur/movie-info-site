const dotenv = require("dotenv").config();
const helpers = require("./helpers.js");
let genres;

async function initializeGenres() {
  const response = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.MOVIE}&language=en-US`
  );
  const genreList = await response.json();
  genreList.genres.push({ id: 10765, name: "Sci-fi & Fantasy" });
  genreList.genres.push({ id: 10759, name: "Action & Adventure" });

  genres = [...genreList.genres];
}

async function fetchMoreMedia(fetchURL, filterFuncs = []) {
  const media = await (await fetch(fetchURL)).json();

  let filteredMedia = media.results.filter((item) => {
    return filterFuncs[0](item);
  });

  return filteredMedia;
}

async function getUpcomingMovies() {
  let page = 1;
  const fetchUrlBase = `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.MOVIE}&language=en-US&page=`;
  const response = await fetch(fetchUrlBase + page);
  const movies = await response.json();

  let upcoming = movies.results.filter((movie) => {
    helpers.filterUpcoming(movie);
  });
  page++;

  while (upcoming.length < 10 && page < movies.total_pages) {
    // const res = await fetch(
    //   `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.MOVIE}&language=en-US&page=${page}`
    // );
    // const movs = await res.json();

    // let filtered = helpers.filterUpcoming(movs.results);
    const response = await fetchMoreMedia(fetchUrlBase + page, [
      helpers.filterUpcoming,
    ]);
    upcoming.push(...response);

    page++;
  }

  // return upcoming list sorted by release date
  return upcoming.sort((a, b) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);

    return dateA - dateB;
  });
}

async function getNowPlaying() {
  let currentPage = 1;
  const fetchUrlBase = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.MOVIE}&region=US&language=en-US&page=`;
  const response = await fetch(fetchUrlBase + currentPage);
  const movies = await response.json();

  const filteredMovies = movies.results.filter((movie) => {
    return helpers.filterNowPlaying(movie);
  });

  currentPage++;

  while (filteredMovies.length < 10 && currentPage < movies.total_pages) {
    const response = await fetchMoreMedia(fetchUrlBase + currentPage, [
      helpers.filterNowPlaying,
    ]);
    filteredMovies.push(...response);
    currentPage++;
  }

  return filteredMovies;
}

async function getTrending(type = "movie") {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/${type}/day?api_key=${process.env.MOVIE}`
  );
  const trendingMedia = await response.json();

  return trendingMedia.results.filter((item) => {
    return item.original_language === "en" && item.adult === false;
  });
}

async function getRecommendations(mediaID, type = "movie") {
  const response = await fetch(
    `https://api.themoviedb.org/3/${type}/${mediaID}/similar?api_key=${process.env.MOVIE}`
  );
  const recommendations = await response.json();

  return recommendations.results.filter((item) => {
    return (
      (item.original_language === "en" || item.original_language === "ja") &&
      item.adult === false &&
      item.poster_path
    );
  });
}

async function getSearchResults(query) {
  const resultsObj = {};
  let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${
    process.env.MOVIE
  }&language=en-US&query=${encodeURIComponent(
    query
  )}&page=1&include_adult=false`;

  const movieRes = await fetch(searchUrl);
  const movieData = await movieRes.json();

  resultsObj.movies = movieData;
  searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${
    process.env.MOVIE
  }&language=en-US&query=${encodeURIComponent(
    query
  )}&page=1&include_adult=false`;

  const tvRes = await fetch(searchUrl);
  const tvData = await tvRes.json();

  resultsObj.tv = tvData;
  return resultsObj;
}

async function getStreamingProviders(mediaID, type = "movie") {
  const response = await fetch(
    `https://api.themoviedb.org/3/${type}/${mediaID}/watch/providers?api_key=${process.env.MOVIE}`
  );
  const data = await response.json();

  if (data.results && data.results.US && data.results.US.flatrate) {
    return data.results.US.flatrate;
  } else {
    return { msg: "No Providers Found" };
  }
}

function genreList() {
  return genres;
}

module.exports = {
  getUpcomingMovies,
  initializeGenres,
  genreList,
  getNowPlaying,
  getRecommendations,
  getSearchResults,
  getStreamingProviders,
  getTrending,
};
