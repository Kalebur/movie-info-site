function displayModal(mediaInfo) {
  console.log(mediaInfo.title || mediaInfo.name);
}

function createPosterItem(mediaInfo) {
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

populateLists();
