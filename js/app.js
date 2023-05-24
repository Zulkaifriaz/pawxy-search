export const app = (() => {
  const searchEl = {
    div: "search-element",
    tag: 'search',
    attributes: {
      as_sitesearch: 'https://www.youtube.com/',
      webSearchQueryAddition: 'song music',
    },
  }

  function search () {
    const init = () => {
      if (document.readyState == 'complete') {
        google.search.cse.element.render(searchEl)
      } else {
        google.setOnLoadCallback(() => {
            google.search.cse.element.render(searchEl)
        }, true)
      }
    }

    const resultsStarting = () => {
      console.log('loading...')
    }

    const resultsReady = (name, q, promos, results, resultsDiv) => {
      console.log('rendered...')


      return true
    }

    const resultsRendered = (name, q, promos, results, resultsDiv) => {
      console.log('stop loading...')
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

  return {
    search,
  }
})()
