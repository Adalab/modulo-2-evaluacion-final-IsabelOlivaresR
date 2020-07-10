'use strict';
const searchInput = document.querySelector('.js-search-bar');
const searchBtn = document.querySelector('.js-search-btn');
const searchList = document.querySelector('.js-series-list');
let favorites = [];
let searchResult;

//get series from Api
function getInfoFromApi() {
  fetch(`http://api.tvmaze.com/search/shows?q=${searchInput.value}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const title = data[i].show.name;
        let picture = data[i].show.image;
        if (data[i].show.image) {
          picture = data[i].show.image.medium;
        } else {
          picture =
            'https://via.placeholder.com/210x295/ffffff/666666/?text=TV.';
        }

        const serieItem = `<li class="serie__container">
          <img src="${picture}">
          <h3 class="name">${title}</h3>
          </li>`;
        searchResult += serieItem;
      }
      searchList.innerHTML = searchResult;
    });
}

/*function paintResults() {
  for (let i = 0; i < searchResult.length; i++) {
    const picture = searchResult[i].image;
    console.log(picture);
    const title = searchResult[i].name;
    const serieItem = `<li class="serie__container">
      <img src="${picture}">
      <h3 class="name">${title}</h3>
      </li>`;
  }
  searchList.innerHTML = serieItem;
}
/*function searchHandler() {
  getInfoFromApi();
  paintResults();
}*/
//listener
searchBtn.addEventListener('click', getInfoFromApi);
