'use strict';
const searchInput = document.querySelector('.js-search-bar');
const searchBtn = document.querySelector('.js-search-btn');
const searchList = document.querySelector('.js-series-list');
let favorites = [];
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

    codeHTML += `<li class="serie__container">
      <img src="${picture}">
      <h3 class="name">${title}</h3>
      </li>`;
  }
  searchList.innerHTML = CodeHTML;
}
/*function searchHandler() {
  getInfoFromApi();
  paintResults();
}*/
//listener
searchBtn.addEventListener('click', getInfoFromApi);
getInfoFromApi();
