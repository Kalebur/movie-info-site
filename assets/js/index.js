const modal = document.querySelector(".modal");
const body = document.querySelector("body");

import {
  createGenreTag,
  createPosterItem,
  createResultsItem,
} from "./createItems.js";

import { parseDate } from "./helpers.js";

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
  const movieResults = document.getElementById("movie-results");
  const tvResults = document.getElementById("tv-results");
  const response = await fetch(`/search/${query}`);
  const results = await response.json();

  movieResults.innerHTML = "";
  tvResults.innerHTML = "";
  let item = 0;
  do {
    movieResults.appendChild(createResultsItem(results.movies.results[item]));
    item++;
  } while (item < 5);

  item = 0;

  try {
    do {
      tvResults.appendChild(createResultsItem(results.tv.results[item]));
      item++;
    } while (item < 5);
  } catch (err) {}

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

  console.log(similarMedia);

  try {
    const streaming = await getStreamingProviders(queryString);
    console.log(streaming);
  } catch (err) {}

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

  modal.style.top = `${window.scrollY}px`;
  modal.classList.remove("modal-hidden");
  modal.classList.add("active");

  body.classList.add("no-scroll");
}

function setModalBG(mediaInfo) {
  const baseUrl = "https://image.tmdb.org/t/p/w500";
  const bgStyle = `linear-gradient(to top, #000510 10%, rgba(0, 5, 16, 0.7)), url('${
    baseUrl + mediaInfo.poster_path
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
