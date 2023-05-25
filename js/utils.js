import { loadingIcon, placeholderLogo } from './icons.js'

export const loading = `
  <div class="placeholder">
    <span class="placeholder__loading">
      ${loadingIcon}
    </span>
  </div>
`

export const placeholder = (text) => `
  <div class="placeholder">
    ${placeholderLogo}

    <h2 class="placeholder__title">${text}</h2>
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

export const loadingPromise = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined)
    }, seconds * 1000)
  })
}

export const exceedPagesFeedback = async (el, num) => {
  if (Number(getParam(window.location.hash, 'gsc.page')) > num) {
    await loadingPromise(2)
    replaceHTML(el, placeholder('No more results'))
  }
}
