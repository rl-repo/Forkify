import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksViews.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

if (module.hot) {
	module.hot.accept();
}

async function controlRecipes() {
	try {
		const id = window.location.hash.slice(1);

		if (!id) return;
		recipeView.renderSpinner();

		// Update view
		resultsView.update(model.getSearchResultsPage());

		// Bookmark view
		bookmarksView.update(model.state.bookmarks);

		// Load Recipe
		await model.loadRecipe(id);

		// Render Recipe
		recipeView.render(model.state.recipe);
	} catch (err) {
		recipeView.renderError();
	}
}

const controlSearchResults = async function () {
	try {
		resultsView.renderSpinner();

		// Get Query
		const query = searchView.getQuery();
		if (!query) return;

		// Load search
		await model.loadSearchResults(query);

		// Render Results
		resultsView.render(model.getSearchResultsPage());

		// Render inital pagination
		paginationView.render(model.state.search);
	} catch (err) {
		console.log(err);
	}
};

// Refresh result / button
const controlPagination = function (goToPage) {
	resultsView.render(model.getSearchResultsPage(goToPage));
	paginationView.render(model.state.search);
};

// Update serving state and recipe view
const controlServings = function (newServings) {
	model.updateServings(newServings);
	recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
	// Add / remove boomkmark
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);

	// Update recipe
	recipeView.update(model.state.recipe);

	// Render bokmark
	bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
	bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
	try {
		addRecipeView.renderSpinner();
		await model.uploadRecipe(newRecipe);
		recipeView.render(model.state.recipe);

		// Success
		addRecipeView.renderMessage();

		// Render bookmark
		bookmarksView.render(model.state.bookmarks);

		// Update url w/o reload page
		window.history.pushState(null, '', `#${model.state.recipe.id}`);

		//Close form
		setTimeout(function () {
			addRecipeView.closeWindow();
		}, MODAL_CLOSE_SEC * 1000);
	} catch (err) {
		console.error('XXXXX', err);
		addRecipeView.renderError(err.message);
	}
	setTimeout(function () {
		location.reload();
	}, 2500);
};

function init() {
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();
