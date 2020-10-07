import get from 'lodash/get'

const _ = {
  get,
}

export const isSvg = image => {
  const source = _.get(image, 'currentSrc') || _.get(image, 'src')
  if (typeof source === 'string') {
    return source.substr(-4).toLowerCase() === '.svg'
  }
  return false
}

export function getViewportWidth() {
  /* 
    We want to exclude the width of vertical scrollbar in all browsers.
    So we use the document.documentElement.clientWidth as the viewport width.
   */
  let width = 0
  if (
    typeof document !== 'undefined' &&
    document.documentElement &&
    document.documentElement.clientWidth
  ) {
    width = document.documentElement.clientWidth
  } else if (typeof window !== 'undefined' && window.innerWidth) {
    width = window.innerWidth
  }
  return width
}

export function getViewportHeight() {
  /*
    On mobile device, we want to exclude the height of browser toolbar and url bar.
    So we use window.innerHeight as the viewport height.
    window.innerHeight might include the horizontal scrollbar when it appears, but it seldom happens and the result is acceptable.
    Ref: https://www.notion.so/yucj/Viewport-Height-ab6cb48bb8f248d3a484c13da2c38d86
  */
  let height = 0
  if (typeof window !== 'undefined' && window.innerHeight) {
    height = window.innerHeight
  } else if (
    typeof document !== 'undefined' &&
    document.documentElement &&
    document.documentElement.clientHeight
  ) {
    height = document.documentElement.clientHeight
  }
  return height
}

export function getViewportSize() {
  return {
    width: getViewportWidth(),
    height: getViewportHeight(),
  }
}
