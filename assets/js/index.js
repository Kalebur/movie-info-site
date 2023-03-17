const modal = document.querySelector(".modal");
const body = document.querySelector("body");
import { createGenreTag, createPosterItem } from "./createItems.js";
import { parseDate } from "./helpers.js";

async function populateModalData(data) {
  const title = document.querySelector(".media-name");
  const response = await fetch("/all-genres");
  const genres = await response.json();
  const genreList = document.querySelector(".genre-list");
  const releaseDateField = document.querySelector(".release-date");
  const overview = document.querySelector(".media-desc");
  genreList.innerHTML = "";
  console.log(data);
  console.log(genres);

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
    console.log(data.release_date);
    releaseDateField.textContent = `Release Date: ${parseDate(
      new Date(data.release_date)
    )}`;
    releaseDateField.classList.remove("no-display");
  }
  overview.textContent = data.overview;
}

export function displayModal(mediaInfo) {
  const baseUrl = "https://image.tmdb.org/t/p/w500";
  const bgStyle = `linear-gradient(to top, #000510 10%, rgba(0, 5, 16, 0.7)), url('${
    baseUrl + mediaInfo.poster_path
  }')`;

  populateModalData(mediaInfo);

  modal.style.top = `${window.scrollY}px`;
  modal.style.backgroundImage = bgStyle;
  modal.classList.remove("modal-hidden");
  modal.classList.add("active");

  body.classList.add("no-scroll");
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
  populateLists();
});
