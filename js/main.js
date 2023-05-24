import { app } from './app.js'
import { logo } from './icons.js'

const root = document.querySelector('[data-js="root"]')

root.innerHTML = `
  <div class="wrapper">
    <header class="header">
      <h1 class="header__logo" title="Pawxy Search">
        <a href="/">
          ${logo}

          <span>Pawxy Search</span>
        </a>
      </h1>
    </header>
    <main class="content">
      <div id="search-box" class="content__search-box"></div>

      <div id="search-results" class="content__results"></div>
    </main>
  </div>
`
app.search()
