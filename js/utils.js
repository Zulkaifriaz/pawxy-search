import { loadingIcon } from './icons.js'

export const loading = `
  <div class="placeholder">
    <span class="placeholder__loading">
      ${loadingIcon}
    </span>
  </div>
`

export const replaceHTML = (el, html) => {
  el.replaceChildren()
  el.insertAdjacentHTML('afterbegin', html)
}

export const getParam = (hash, param) => {
  const params = hash.split('&')

  for (let item of params) {
    if (item.includes(param)) {
      return decodeURI(item.split('=')[1])
    }
  }

  return ''
}
