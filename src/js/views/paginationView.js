import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
	_parentElement = document.querySelector('.pagination');

	addHandlerClick(handler) {
		this._parentElement.addEventListener('click', function (e) {
			const btn = e.target.closest('.btn--inline');
			if (!btn) return;

			const goToPage = +btn.dataset.goto;

			handler(goToPage);
		});
	}

	_generateMarkup() {
		const curPage = this._data.page;
		const numPages = Math.ceil(
			this._data.results.length / this._data.resultsPerPage
		);

		// Page 1 and other page
		if (curPage === 1 && numPages > 1) {
			return this._generatePageButton('next', curPage);
		}

		// Last page
		if (curPage === numPages && numPages > 1) {
			return this._generatePageButton('prev', curPage);
		}

		// Other pages
		if (curPage < numPages) {
			return `
			${this._generatePageButton('prev', curPage)} 
			${this._generatePageButton('next', curPage)}`;
		}

		// Page 1, no other page
		return '';
	}

	// prettier-ignore
	_generatePageButton(dir, page) {
		const tempPage = dir === 'prev' ? page - 1 : page + 1;

		return `
        <button data-goto="${tempPage}"
			class="btn--inline pagination__btn--${dir === 'prev' ? 'prev' : 'next'}">

            ${dir === 'prev' ? '' : `<span>Page ${tempPage}</span>`}

            <svg class="search__icon">
                <use href="${icons}#icon-arrow-${dir === 'prev' ? 'left' : 'right'}"></use>
            </svg>

            ${dir === 'prev' ? `<span>Page ${tempPage}</span>` : ''}
        </button>`;
	}
}

export default new PaginationView();
