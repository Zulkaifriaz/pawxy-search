import { arrowIcon, placeholderLogo, searchIcon, youtubeIcon } from './icons.js'
import { getParam, loading, replaceHTML } from './utils.js'

export const app = (() => {
  const searchBox = {
    div: "search-box",
    tag: 'searchbox',
    attributes: {
      as_sitesearch: 'https://www.youtube.com/',
      webSearchQueryAddition: 'song music',
    },
  }
  const searchResults = {
    div: "search-results",
    tag: 'searchresults',
    attributes: {
      personalizedAds: false,
      as_sitesearch: 'https://www.youtube.com/',
      webSearchQueryAddition: 'song music',
    },
  }

  function render () {
    const searchBoxEl = document.getElementById('search-box')
    const resultsEl = document.getElementById('search-results')

    google.search.cse.element.render(searchBox, searchResults)

    replaceHTML(searchBoxEl, `
      <form data-js="search-form" class="search-form">
        <input data-js="search-field" class="search-form__field" type="search" name="search" placeholder="Search">

        <button class="search-form__btn" type="submit">
          ${searchIcon}
        </button>
      </form>
  ` )

    const searchForm = document.querySelector('[data-js="search-form"]')

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault()
      const form = e.currentTarget

      window.location.hash = `gsc.tab=0&gsc.q=${form.search.value}`
    })

    if (window.location.hash.includes('gsc.q=')) {
      const searchForm = document.querySelector('[data-js="search-field"]')

      replaceHTML(resultsEl, loading)
      searchForm.value = getParam(window.location.hash, 'gsc.q')
    } else {
      replaceHTML(resultsEl, `
        <div class="placeholder">
          ${placeholderLogo}

          <h2 class="placeholder__title">Seach for a video</h2>
        </div>
      `)
    }
  }

  function search () {
    const init = () => {
      if (document.readyState == 'complete') {
        render()
      } else {
        google.setOnLoadCallback(render, true)
      }
    }

    const resultsStarting = () => {
      const resultsEl = document.getElementById('search-results')

      replaceHTML(resultsEl, loading)
    }

    const resultsReady = (name, q, promos, results) => {
      const resultsEl = document.getElementById('search-results')

      console.log(results)

      replaceHTML(resultsEl, results.map(result => (
        `
          <div class="video">
            <div class="video__thumb-container">
              <img src="${result.thumbnailImage.url}" class="video__img">

              <div class="video__duration">4:15</div>
            </div>

            <div class="video__content-container">
              <div class="video__content">
                <h2 class="video__title">${result.titleNoFormatting}</h2>

                <span class="video__channel">Blackpink</span>
              </div>

              <div class="video__info">
                <div class="video__host">
                  ${youtubeIcon}

                  <span>youtube.com</span>
                </div>

                <span class="video__views">65m views</span>
              </div>
            </div>
          </div>
        `
      )).join(''))

      return true
    }

    function resultsRendered (name, q, promos, results) {
      const resultsEl = document.getElementById('search-results')
      const page = Number(getParam(window.location.hash, 'gsc.page'))
      console.log(page)

      if (page > 1) {
        resultsEl.insertAdjacentHTML('beforeend', `
          <div class="pagination pagination--prev">
            <button data-js="pagination-btn" class="pagination__btn pagination__btn--prev" data-id="${page - 1}">
              ${arrowIcon}

              <span>Prev</span>
            </button>

            <span class="pagination__count">${page}</span>

            <button data-js="pagination-btn" class="pagination__btn" data-id="${page + 1}">
              <span>Next</span>

              ${arrowIcon}
            </button>
          </div>
        `)
      } else {
        resultsEl.insertAdjacentHTML('beforeend', `
          <div class="pagination">
            <button data-js="pagination-btn" class="pagination__btn" data-id="${2}">
              <span>Next</span>

              ${arrowIcon}
            </button>
          </div>
        `)
      }

      resultsEl.insertAdjacentHTML('beforeend', `
        <div class="more">
          ${searchIcon}

          <a href="https://www.google.com/search?client=ms-google-coop&q=${q}&cx=242c924c8ae1145f8" class="more__link">Search <span class="more__query">${q}</span> on Google</a>
        </div>
      `)

      pagination(q)
    }

    window.__gcse = {
      parsetags: 'explicit',
      initializationCallback: init,
      searchCallbacks: {
        web: {
          starting: resultsStarting,
          ready: resultsReady,
          rendered: resultsRendered,
        },
      },
    }
  }

  function pagination (query) {
    const btns = Array.from(document.querySelectorAll('[data-js="pagination-btn"]'))

    btns.map(btn => btn.addEventListener('click', (e) => {
      const page = e.currentTarget.dataset.id

      if (page > 1) {
        window.location.hash = `gsc.tab=0&gsc.q=${query}&gsc.page=${page}`
      } else {
        window.location.hash = `gsc.tab=0&gsc.q=${query}`
      }
    }))
  }

  return {
    search,
  }
})()
