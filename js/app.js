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
  let data

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
      const prettyResults = results.map(result => {
        const formatDuration = (dur) => {
          const duration = dur.replace('PT', '').replace('S', '').split('M')
          const hours = Math.floor(Number(duration[0]) / 60)
          const minutes = Number(duration[0]) % 60

          return `${hours ? `${hours}:` : ''}${minutes}:${duration[1]}`
        }

        const formatViews = (views) => {
          return views > 999999999 ? `${Math.round(views / 1000000000)}b` : views > 999999 ? `${Math.round(views / 1000000)}m` : views > 999 ? `${Math.round(views / 1000)}k` : views
        }

        return {
          id: crypto.randomUUID(),
          title: result?.titleNoFormatting || 'Undefined',
          thumbnail: result.thumbnailImage?.url || '/assets/thumbnail-placeholder.svg',
          channel: result.richSnippet.person?.name || 'Undefined',
          views: formatViews(Number(result.richSnippet.videoobject?.interactioncount || '0')),
          embed: result.richSnippet.videoobject?.embedurl,
          duration: formatDuration(result.richSnippet.videoobject?.duration || 'PT0M0S'),
          url: result.richSnippet.videoobject?.url || '',
        }
      })

      data = prettyResults

      replaceHTML(resultsEl, prettyResults.map(result => (
        `
          <div class="video" data-js="video" data-id="${result.id}">
            <div class="video__thumb-container">
              <img src="${result.thumbnail}" class="video__img">

              <div class="video__duration">${result.duration}</div>
            </div>

            <div class="video__content-container">
              <div class="video__content">
                <h2 class="video__title">${result.title}</h2>

                <span class="video__channel">${result.channel}</span>
              </div>

              <div class="video__info">
                <div class="video__host">
                  ${youtubeIcon}

                  <span>Youtube.com</span>
                </div>

                <span class="video__views">${result.views} views</span>
              </div>
            </div>
          </div>
        `
      )).join(''))

      openDetails()

      return true
    }

    function resultsRendered (name, q, promos, results) {
      const resultsEl = document.getElementById('search-results')
      const page = Number(getParam(window.location.hash, 'gsc.page'))

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

  function openDetails () {
    const videos = Array.from(document.querySelectorAll('[data-js="video"]'))
    const root = document.querySelector('[data-js="root"]')
    const wrapper = document.querySelector('[data-js="wrapper"]')

    videos.map(video => video.addEventListener('click', (e) => {
      const videoId = e.currentTarget.dataset.id
      const videoData = data.find(item => item.id === videoId)

      const rect = wrapper.getBoundingClientRect()
      wrapper.classList.add('no-scroll')
      wrapper.style.top = `${rect.top}px`

      root.insertAdjacentHTML('beforeend', `
        <div data-js="overlay" class="overlay">
          <div class="video-details">
            <div class="video-details__container">
              <iframe class="video-details__embed" src="${videoData.embed}" title="YouTube video player" frameborder="0"></iframe>

              <div class="video-details__content">
                <h3 class="video-details__title">${videoData.title}</h3>

                <div class="video-details__info">
                  <div class="video-details__channel">
                    ${youtubeIcon}

                    <span>${videoData.channel}</span>
                  </div>

                  <span>•</span>

                  <div>${videoData.views} views</div>
                </div>
              </div>
            </div>

            <div class="video-details__actions">
              <a href="${videoData.url}" class="video-details__btn video-details__btn--primary" target="_blank">Visit</a>

              <button data-js="close-overlay-btn" class="video-details__btn video-details__btn--secondary">Close</button>
            </div>
          </div>
        </div>
      `)

      const closeBtn = document.querySelector('[data-js="close-overlay-btn"]')
      const overlay = document.querySelector('[data-js="overlay"]')

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          overlay.remove()
          wrapper.classList.remove('no-scroll')
          wrapper.style.removeProperty('top')
          document.documentElement.scrollTop = Math.abs(rect.top)
        })
      }
    }))
  }

  return {
    search,
  }
})()
