'use strict';
const searchInput = document.querySelector('.js-search-bar');
const searchBtn = document.querySelector('.js-search-btn');
const searchList = document.querySelector('.js-series-list');
const favoriteSection = document.querySelector('.js-fav-series-container');
let favoritesList = [];
let searchResult = [];

//get series from Api
function getInfoFromApi() {
  fetch(`http://api.tvmaze.com/search/shows?q=${searchInput.value}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      searchResult = data;
      paintResults();
    });
}
//paint series info
function paintResults() {
  let codeHTML = '';
  for (let i = 0; i < searchResult.length; i++) {
    const title = searchResult[i].show.name;
    let picture = searchResult[i].show.image;
    if (searchResult[i].show.image) {
      picture = searchResult[i].show.image.medium;
    } else {
      picture = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV.';
    }

    codeHTML += `<li class="serie__container js-serie-container">
      <img src="${picture}">
      <h3 class="name">${title}</h3>
      </li>`;
  }
  searchList.innerHTML = codeHTML;
  listenSeriesClick();
}

// select the correct item
function listenSeriesClick() {
  const seriesList = document.querySelectorAll('.js-serie-container');

  for (let i = 0; i < seriesList.length; i++) {
    const serieItem = seriesList[i];
    console.log(serieItem);
    serieItem.addEventListener('click', addToFavorites);
  }
}

//add item to favorites, change color background and fonts
function addToFavorites(event) {
  const elemTarget = event.currentTarget;
  const seriesName = elemTarget.querySelector('h3').innerHTML;
  const seriesFavIndex = favoritesList.findIndex(
    (serie) => serie.show.name === seriesName
  );
  if (seriesFavIndex === -1) {
    elemTarget.classList.add('favorite');
    const seriesListObj = searchResult.find(
      (serie) => serie.show.name === seriesName
    );
    favoritesList.push(seriesListObj);
  } else {
    elemTarget.classList.remove('favorite');
    favoritesList.splice(seriesFavIndex, 1);
  }
  paintFavoritesList();
  addFavToLocalStorage();
}
console.log(favoritesList);

//Include favorites in the favorites aside section
function paintFavoritesList() {
  let HTMLCode = '';
  for (let i = 0; i < favoritesList.length; i++) {
    const title = favoritesList[i].show.name;
    let picture = favoritesList[i].show.image;
    if (favoritesList[i].show.image) {
      picture = favoritesList[i].show.image.medium;
    } else {
      picture = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV.';
    }

    HTMLCode += `<div class="favorite-item js-favorite-container">
      <img src="${picture}">
      <h3 class="name">${title}</h3>
      </div>`;
  }
  favoriteSection.innerHTML = HTMLCode;
}

//local storage
//add info to Local Storage
function addFavToLocalStorage() {
  localStorage.setItem('fav', JSON.stringify(favoritesList));
}

//get info from Local Storage
function getFromLocalStorage() {
  const favData = JSON.parse(localStorage.getItem('fav'));
  if (favData !== null) {
    favoritesList = favData;
  }
  paintFavoritesList();
}
searchBtn.addEventListener('click', getInfoFromApi);

//start app
getFromLocalStorage();
