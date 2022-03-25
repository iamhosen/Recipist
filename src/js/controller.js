import '../sass/main.scss';
import logoPng from '../img/logo.png';
const logo = document.querySelector('.header__logo');
logo.src = logoPng;

import * as model from './model';
import reciptView from './views/reciptView';
import searchView from './views/searchView';
import resultView from './views/resultView';
import paginationView from './views/paginationView';
import bookmarkView from './views/bookmarkView';
import addRecipeView from './views/addRecipeView';

// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
// import { async } from 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    reciptView.spinnerRender();

    resultView.render(model.getSearchResultPage());
    bookmarkView.render(model.state.bookmark);

    await model.loadRecipe(id);
    reciptView.render(model.state.recipe);
  } catch (err) {
    reciptView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultView.spinnerRender();

    const query = await searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);

    // resultView.render(model.state.search.result);
    resultView.render(model.getSearchResultPage());

    paginationView.render(model.state.search);
  } catch (err) {
    reciptView.renderError();
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  resultView.render(model.getSearchResultPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  reciptView.render(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  reciptView.render(model.state.recipe);

  bookmarkView.render(model.state.bookmark);
};

const controlBookmark = function () {
  bookmarkView.render(model.state.bookmark);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.spinnerRender();

    await model.uploadRecipe(newRecipe);

    reciptView.render(model.state.recipe);
    addRecipeView.renderMessage();

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    bookmarkView.render(model.state.bookmark);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 2.5 * 1000);
  } catch (err) {
    addRecipeView.renderError(err);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  reciptView.addHandlerRender(controlRecipes);
  reciptView.addHandlerUpdateServings(controlServings);
  reciptView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
