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
  </div>
`
