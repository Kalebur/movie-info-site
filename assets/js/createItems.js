import { displayModal, populateModalData } from "./index.js";

export function createPosterItem(mediaInfo, type = "top-level") {
  const listItem = document.createElement("li");
  const posterImg = document.createElement("img");

  posterImg.src = "https://image.tmdb.org/t/p/w154" + mediaInfo.poster_path;
  posterImg.alt = mediaInfo.title || mediaInfo.name;
  posterImg.title = mediaInfo.title || mediaInfo.name;

  listItem.appendChild(posterImg);
  listItem.classList.add("poster");
  if (type === "top-level") {
    listItem.addEventListener("click", () => {
      displayModal(mediaInfo);
    });
  } else if (type === "modal") {
    listItem.addEventListener("click", () => {
      populateModalData(mediaInfo);
    });
  }

  return listItem;
}

export function createResultsItem(mediaInfo = null) {
  const resultItem = document.createElement("li");
  resultItem.classList.add("result-item");

  const resultPoster = document.createElement("img");
  resultPoster.src = "https://image.tmdb.org/t/p/w154" + mediaInfo.poster_path;
  resultPoster.alt = mediaInfo.title || mediaInfo.name;
  resultPoster.title = mediaInfo.title || mediaInfo.name;
  resultPoster.classList.add("search-results-poster");

  resultItem.appendChild(resultPoster);

  resultItem.addEventListener("click", () => {
    displayModal(mediaInfo);
  });

  return resultItem;
}

export function createGenreTag(genreName) {
  const tag = document.createElement("li");

  tag.textContent = genreName;
  tag.classList.add("genre-tag");

  return tag;
}
