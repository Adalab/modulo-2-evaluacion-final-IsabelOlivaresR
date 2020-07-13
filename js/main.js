'use strict';
const searchInput = document.querySelector('.js-search-bar');
const searchBtn = document.querySelector('.js-search-btn');
const searchList = document.querySelector('.js-series-list');
const favoriteSection = document.querySelector('.js-fav-series-container');
const resetBtn = document.querySelector('.js-reset-btn');
let favoritesList = [];
let searchResult = [];

//get series from Api
function getInfoFromApi() {
  fetch(`http://api.tvmaze.com/search/shows?q=${searchInput.value}`)
    .then((response) => response.json())
    .then((data) => {
      searchResult = data;
      paintResults();
    });
}
//paint series search results
function paintResults() {
  let codeHTML = '';
  for (let i = 0; i < searchResult.length; i++) {
    const title = searchResult[i].show.name;
    let picture = searchResult[i].show.image;
    if (searchResult[i].show.image) {
      picture = searchResult[i].show.image.medium;
    } else {
      picture =
        'https://via.placeholder.com/210x295/ffffff/666666/?text=No+imagen.';
    }
    let favClass = '';
    for (let index = 0; index < favoritesList.length; index++) {
      const favTitle = favoritesList[index].show.name;

      if (favTitle === title) {
        favClass = 'favorite';
      }
    }
    codeHTML += `<li class="serie__container js-serie-container ${favClass}">
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

//Include favorites in the favorites aside section
function paintFavoritesList() {
  let HTMLCode = '';
  for (let i = 0; i < favoritesList.length; i++) {
    const title = favoritesList[i].show.name;
    let picture = favoritesList[i].show.image;
    if (favoritesList[i].show.image) {
      picture = favoritesList[i].show.image.medium;
    } else {
      picture =
        'https://via.placeholder.com/210x295/ffffff/666666/?text=No+imagen.';
    }

    HTMLCode += `<li class="favorite-item js-favorite-container">
      <img src="${picture}">
      <h3 class="name">${title}</h3>
      <button class="cross-btn js-cross-btn"><i class="fa fa-times-circle" aria-hidden="true"></i></button>
      </li>`;
  }
  favoriteSection.innerHTML = HTMLCode;
  removeOrAddMessage();
  listenCrossBtnClick();
}

function removeOrAddMessage() {
  const noFavMessage = document.querySelector('p');
  if (favoriteSection.innerHTML === '') {
    noFavMessage.classList.remove('hidden');
  } else {
    noFavMessage.classList.add('hidden');
  }
}

//Remove favorites from aside section and local storage with cross button
function listenCrossBtnClick() {
  const crossBtnList = document.querySelectorAll('.js-cross-btn');
  for (let i = 0; i < crossBtnList.length; i++) {
    const crossBtnItem = crossBtnList[i];
    crossBtnItem.addEventListener('click', removeFavFromSection);
  }
}

function removeFavFromSection(event) {
  const elementTarget = event.currentTarget.parentElement;
  const seriesTitle = elementTarget.querySelector('h3').innerHTML;
  const seriesFavIndex = favoritesList.findIndex(
    (serie) => serie.show.name === seriesTitle
  );
  if (seriesFavIndex !== -1) {
    favoritesList.splice(seriesFavIndex, 1);
  }
  paintFavoritesList();
  paintResults();
  addFavToLocalStorage();
}

//LOCAL STORAGE
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

//reset button
function resetFavSection() {
  favoritesList = [];
  searchResult = [];
  paintResults();
  paintFavoritesList();
  addFavToLocalStorage();
}
//Listeners
searchBtn.addEventListener('click', getInfoFromApi);
resetBtn.addEventListener('click', resetFavSection);

//start app
getFromLocalStorage();
