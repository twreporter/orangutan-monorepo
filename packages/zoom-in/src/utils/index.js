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
