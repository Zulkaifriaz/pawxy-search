import { placeholderLogo, searchIcon } from './icons.js'

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
    searchBoxEl.innerHTML = `
      <form data-js="search-form" class="search-form">
        <input class="search-form__field" type="search" name="search" placeholder="Search">

        <button class="search-form__btn" type="submit">
          ${searchIcon}
        </button>
      </form>
    `

    if (window.location.hash.includes('gsc.q=')) {
      resultsEl.innerHTML = 'loading...'
    } else {
      resultsEl.innerHTML = `
        <div class="placeholder">
          ${placeholderLogo}

          <h2 class="placeholder__title">Seach for a video</h2>
        </div>
      `
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

      resultsEl.innerHTML = 'loading...'
    }

    const resultsReady = (name, q, promos, results) => {
      const resultsEl = document.getElementById('search-results')

      resultsEl.innerHTML = results.map(result => (
        `<h6>${result.title}</h6>`
      )).join('')

      return true
    }

    window.__gcse = {
      parsetags: 'explicit',
      initializationCallback: init,
      searchCallbacks: {
        web: {
          starting: resultsStarting,
          ready: resultsReady,
        },
      },
    }
  }

  return {
    search,
  }
})()
