import { displayModal } from "./index.js";

export function createPosterItem(mediaInfo) {
  const listItem = document.createElement("li");
  const posterImg = document.createElement("img");

  posterImg.src = "https://image.tmdb.org/t/p/w154" + mediaInfo.poster_path;
  posterImg.alt = mediaInfo.title || mediaInfo.name;
  posterImg.title = mediaInfo.title || mediaInfo.name;

  listItem.appendChild(posterImg);
  listItem.classList.add("poster");
  listItem.addEventListener("click", () => {
    displayModal(mediaInfo);
  });

  return listItem;
}

export function createGenreTag(genreName) {
  const tag = document.createElement("li");

  tag.textContent = genreName;
  tag.classList.add("genre-tag");

  return tag;
}
