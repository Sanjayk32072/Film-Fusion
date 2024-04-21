const API_KEY = "42a4f5af1717e8565fd579e817fac4bb";
const imagePath = "http://image.tmdb.org/t/p/w1280";
const input = document.querySelector(".search input");
const btn = document.querySelector(".search button");
const mainGridTitle = document.querySelector(".movies-container h1");
const mainGridFavourite = document.querySelector(
  ".movies-container #movies-grid-favourite"
);
const mainGridTrending = document.querySelector(
  ".movies-container #movies-grid-Trending"
);
const mainGirdSearch = document.querySelector("#movies-grid-search");
let popupContainer = document.querySelector(".popup-container");
async function getMovieBy(search_term) {
  try {
    let response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search_term}`
    );
    if (response.status == 200) {
      let resData = await response.json();
      console.log(resData);
      return resData.results;
    } else {
      throw new Error(response.status + " " + response.statusText);
    }
  } catch (error) {
    console.log(error);
  }
}
async function addSearchMoviestoDOM() {
  let movieName = input.value;
  let data = await getMovieBy(movieName);
  console.log(data);
  let resultArr = data.map((m) => {
    return `
        <div class="card" data-id="${m.id}">
            <div class="img">
              <img src=" ${imagePath + m.poster_path} " alt="" />
            </div>
            <div class="info">
              <h2>${m.title}</h2>
              <div class="single-info">
                <span>Rating :</span>
                <span>${m.vote_average} / 10</span>
              </div>
              <div class="single-info">
                <span>Release Date : </span>
                <span>${m.release_date} </span>
              </div>
            </div>
          </div>
        `;
  });
  mainGirdSearch.innerHTML = resultArr.join(" ");
  const cards = document.querySelectorAll(".card");
  addClickEffectTocards(cards);
}
function addClickEffectTocards(cards) {
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      showPopUp(card);
    });
  });
}
async function getMovieById(movieId) {
  let response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
}
async function getMovieTrailerById(movieId) {
  let response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results[0].key;
}
async function showPopUp(card) {
  const movieId = card.getAttribute("data-id");
  const movie = await getMovieById(movieId);
  const key = await getMovieTrailerById(movieId);
  popupContainer.innerHTML = ` <span class="x-icon">&#10006;</span>
  <div class="content">
    <!--Left content div start here-->
    <div class="left">
      <div class="poster-img">
        <img src="${imagePath + movie.poster_path}" alt="" />
      </div>
      <div class="single-info">
        <span>Add to favourites :</span>
        <span class="heart-icon">&#9829;</span>
      </div>
    </div>
    <!--left content div ends here-->

    <!--right content div starts here-->
    <div class="right">
      <h1>${movie.title}</h1>
      <h3>${movie.tagline}</h3>
      <!--Single info container starts here-->
      <div class="single-info-container">
        <div class="single-info">
          <span>Languages :</span>
          <span>${movie.spoken_languages[0].name}</span>
        </div>
        <div class="single-info">
          <span>Length :</span>
          <span>${movie.runtime} Minutes</span>
        </div>
        <div class="single-info">
          <span>Rating :</span>
          <span>${movie.vote_average} / 10</span>
        </div>
        <div class="single-info">
          <span>Budget :</span>
          <span>${movie.budget}</span>
        </div>
        <div class="single-info">
          <span>Release Date</span>
          <span>${movie.release_date}</span>
        </div>
      </div>
      <!--Single info container ends here-->

      <!--Movie genres Starts here-->
      <div class="genres">
        <h2>Genres</h2>
        <ul>
          ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
        </ul>
      </div>
      <!--Movie genres ends here-->

      <!--Overview content starts here-->
      <div class="overview">
        <h2>Overview</h2>
        <p>
          ${movie.overview}
        </p>
      </div>
      <!--Overview content ends here-->

      <!--Trailer content starts here-->
      <div class="trailer">
        <h2>Trailer</h2>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-pictur"></iframe>
        </div>
        </div>
        </div>`;
  popupContainer.classList.add("show-popup");
  let heartIcon = document.querySelector(".heart-icon");
  let n = localStorage.getItem(movieId);
  if (n != undefined) heartIcon.classList.add("heart-icon-color");
  heartIcon.addEventListener("click", () => {
    if (heartIcon.classList.contains("heart-icon-color")) {
      heartIcon.classList.remove("heart-icon-color");
      addFavouriteMovies(false, movieId);
    } else {
      heartIcon.classList.add("heart-icon-color");
      addFavouriteMovies(true, movieId);
    }
  });
  let crosIcon = document.querySelector(".x-icon");
  crosIcon.addEventListener("click", () => {
    popupContainer.classList.remove("show-popup");
  });
}
btn.addEventListener("click", addSearchMoviestoDOM);
async function getTrendingMovies() {
  const resp = await fetch(
    `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`
  );
  const data = await resp.json();
  return data.results;
}
async function addTrendingMoviestoDOM() {
  let data = await getTrendingMovies();
  let displayMovies = data.slice(0, 5);
  let resultArr = displayMovies.map((m) => {
    return `
        <div class="card" data-id="${m.id}">
            <div class="img">
              <img src=" ${imagePath + m.poster_path} " alt="" />
            </div>
            <div class="info">
              <h2>${m.title}</h2>
              <div class="single-info">
                <span>Rating :</span>
                <span>${m.vote_average} / 10</span>
              </div>
              <div class="single-info">
                <span>Release Date : </span>
                <span>${m.release_date} </span>
              </div>
            </div>
          </div>
        `;
  });
  mainGridTrending.innerHTML = resultArr.join(" ");
  const cards = document.querySelectorAll(".card");
  addClickEffectTocards(cards);
}
addTrendingMoviestoDOM();
async function addFavouriteMovies(card, id) {
  const movie = await getMovieById(id);
  let movies = JSON.stringify(movie);
  id = String(id);
  if (card) 
    localStorage.setItem(id, movies);
  else 
    localStorage.removeItem(id);
  loadAllFavirate();
}
function loadAllFavirate() {
  let main = "";
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let m = JSON.parse(localStorage.getItem(key));
    main += ` <div class="card" data-id="${m.id}">
    <div class="img">
      <img src=" ${imagePath + m.poster_path} " alt="" />
    </div>
    <div class="info">
      <h2>${m.title}</h2>
      <div class="single-info">
        <span>Rating :</span>
        <span>${m.vote_average} / 10</span>
      </div>
      <div class="single-info">
        <span>Release Date : </span>
        <span>${m.release_date} </span>
      </div>
    </div>
  </div>`;
  }
  mainGridFavourite.innerHTML = main;
  const cards = document.querySelectorAll(".card");
  addClickEffectTocards(cards);
}
window.onload = loadAllFavirate;
