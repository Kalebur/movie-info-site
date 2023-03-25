const modal = document.querySelector(".modal");
const body = document.querySelector("body");

import {
  createGenreTag,
  createPosterItem,
  createResultsItem,
} from "./createItems.js";

import { filterNullPosters, parseDate } from "./helpers.js";

async function getRecommendedMedia(query) {
  const response = await fetch(`/recommended/${query}`);
  const data = response.json();

  return data;
}

async function getStreamingProviders(query) {
  const response = await fetch(`/streaming-info/${query}`);
  const data = response.json();

  return data;
}

async function performSearch(query) {
  query = encodeURIComponent(query);
  const resultsList = document.querySelector(".search-results");
  const movieHeader = document.getElementById("movie-results-header");
  const movieResults = document.getElementById("movie-results");
  const tvHeader = document.getElementById("tv-results-header");
  const tvResults = document.getElementById("tv-results");
  const resultsError = document.querySelector(".results-error");
  const response = await fetch(`/search/${query}`);
  const results = await response.json();

  movieResults.innerHTML = "";
  tvResults.innerHTML = "";

  // Filter items without poster images from the results
  // and display the list of movies returned, if any
  const movieResultsList = results.movies.results.filter((item) => {
    return filterNullPosters(item);
  });
  resultsError.classList.add("no-display");
  try {
    if (movieResultsList.length > 0) {
      for (let i = 0; i < movieResultsList.length; i++) {
        movieHeader.classList.remove("no-display");
        movieResults.classList.remove("no-display");
        movieResults.appendChild(createResultsItem(movieResultsList[i]));
      }
    } else {
      movieHeader.classList.add("no-display");
      movieResults.classList.add("no-display");
    }
  } catch (err) {}

  // Filter items without poster images from the results
  // and display the list of TV shows returned, if any
  const tvResultsList = results.tv.results.filter((item) => {
    return filterNullPosters(item);
  });

  try {
    if (tvResultsList.length > 0) {
      tvHeader.classList.remove("no-display");
      tvResults.classList.remove("no-display");
      for (let i = 0; i < tvResultsList.length; i++) {
        tvResults.appendChild(createResultsItem(tvResultsList[i]));
      }
    } else {
      tvHeader.classList.add("no-display");
      tvResults.classList.add("no-display");
    }
  } catch (err) {}

  // If no results are returned, display proper message
  if (movieResultsList.length === 0 && tvResultsList.length === 0) {
    resultsError.classList.remove("no-display");
  }

  resultsList.classList.remove("no-display");
}

export async function populateModalData(data) {
  modal.scrollTop = 0;

  const title = document.querySelector(".media-name");
  const response = await fetch("/all-genres");
  const genres = await response.json();
  const genreList = document.querySelector(".genre-list");
  const releaseDateField = document.querySelector(".release-date");
  const overview = document.querySelector(".media-desc");
  const mediaType = data.title ? "movie" : "tv";
  genreList.innerHTML = "";
  setModalBG(data);

  title.textContent = data.title || data.name;
  data.genre_ids.forEach((g) => {
    const genreIndex = genres.findIndex((item) => {
      return item.id === g;
    });
    try {
      genreList.appendChild(createGenreTag(genres[genreIndex].name));
    } catch (err) {
      return;
    }
  });

  if (data.release_date) {
    releaseDateField.textContent = `Release Date: ${parseDate(
      new Date(data.release_date)
    )}`;
    releaseDateField.classList.remove("no-display");
  }
  overview.textContent = data.overview;

  const queryString = `${data.id}:${mediaType}`;
  const similarMedia = await getRecommendedMedia(queryString);
  const similarHeader = document.querySelector("#similar-header");
  const similarList = document.querySelector("#similar-list");
  similarList.innerHTML = "";

  try {
    const streaming = await getStreamingProviders(queryString);
    const streamingList = document.querySelector("#streaming-list");
    const streamingHeader = document.querySelector("#streaming-header");
    streamingList.innerHTML = "";

    if (streaming.length > 0) {
      streamingHeader.classList.remove("no-display");
      const logoPathBase = "https://image.tmdb.org/t/p/w92";
      streaming.forEach((service) => {
        const logo = document.createElement("img");
        logo.src = logoPathBase + service.logo_path;
        logo.title = service.provider_name;
        logo.alt = service.provider_name;
        logo.classList.add("streaming-logo");
        streamingList.appendChild(logo);
      });
    } else {
      streamingHeader.classList.add("no-display");
    }
  } catch (err) {
    streamingList.innerHTML = "";
  }

  // Hide "You May Also Like" section if no similiar
  // media are returned from API
  if (similarMedia.length <= 0) {
    similarHeader.classList.add("no-display");
    similarList.classList.add("no-display");
  } else {
    similarList.classList.remove("no-display");
    similarHeader.classList.remove("no-display");
    similarList.scrollLeft = 0;
    similarMedia.forEach((item) => {
      similarList.appendChild(createPosterItem(item, "modal"));
    });
  }
}

export function displayModal(mediaInfo) {
  populateModalData(mediaInfo);

  modal.classList.remove("modal-hidden");
  modal.classList.add("active");

  body.classList.add("no-scroll");
}

function setModalBG(mediaInfo) {
  const baseUrl = "https://image.tmdb.org/t/p/w500";
  const posterUrl = baseUrl + mediaInfo.poster_path;
  const backdropBaseUrl = "https://image.tmdb.org/t/p/w1280";
  const backdropUrl = backdropBaseUrl + mediaInfo.backdrop_path;

  // Check to see if screen is larger than 960px. If so, show
  // the media backdrop image instead of the poster if it has one
  // If not, show the poster. For smaller screens, use the poster
  // as the background image
  const bgStyle = `linear-gradient(to top, var(--color-background) 10%, rgba(0, 5, 16, 0.7)), url('${
    window.innerWidth >= 960
      ? mediaInfo.backdrop_path
        ? backdropUrl // backdrop, if available
        : posterUrl
      : posterUrl
  }')`;
  modal.style.backgroundImage = bgStyle;
}

function closeModal() {
  modal.classList.add("modal-hidden");
  modal.classList.remove("active");

  body.classList.remove("no-scroll");
  setTimeout(() => {
    document.querySelector(".release-date").classList.add("no-display");
  }, 450);
}

async function populateLists() {
  try {
    const upcoming = await (await fetch("/upcoming")).json();
    const upcomingList = document.querySelector(".upcoming ul");

    upcoming.forEach((item) => {
      upcomingList.appendChild(createPosterItem(item));
    });

    const nowPlaying = await (await fetch("/now-playing")).json();
    const nowPlayingList = document.querySelector(".now-playing ul");

    nowPlaying.forEach((item) => {
      nowPlayingList.appendChild(createPosterItem(item));
    });

    const trendingMovies = await (await fetch("/trending-movies")).json();
    const trendingMoviesList = document.querySelector(".trending-movies ul");

    trendingMovies.forEach((item) => {
      trendingMoviesList.appendChild(createPosterItem(item));
    });

    const trendingTV = await (await fetch("/trending-tv")).json();
    const trendingTVList = document.querySelector(".trending-tv ul");

    trendingTV.forEach((item) => {
      trendingTVList.appendChild(createPosterItem(item));
    });
  } catch (err) {}
}

window.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector(".btn-close-modal")
    .addEventListener("click", closeModal);

  document.getElementById("search").addEventListener("input", (e) => {
    const searchResultsList = document.querySelector(".search-results");
    if (e.target.value.length >= 3) {
      performSearch(e.target.value);
    } else {
      if (!searchResultsList.classList.contains("no-display")) {
        searchResultsList.classList.add("no-display");
      }
    }
  });
  populateLists();
});
