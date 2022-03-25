import View from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultPerPage
    );

    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupBtn(curPage, 'next');
    }
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupBtn(curPage, 'prev');
    }
    if (curPage < numPages) {
      return `${this._generateMarkupBtn(curPage, 'prev')}
      ${this._generateMarkupBtn(curPage, 'next')}`;
    }
    return '';
  }

  _generateMarkupBtn(currentP, goTo) {
    // next or prev
    return `
        <button data-goto="${
          goTo === 'next' ? currentP + 1 : currentP - 1
        }" class="btn--inline pagination__btn--${goTo}">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-${
      goTo === 'next' ? 'right' : 'left'
    }"></use>
            </svg>
            <span>Page ${goTo === 'next' ? currentP + 1 : currentP - 1}</span>
        </button>
    `;
  }
}

export default new PaginationView();
