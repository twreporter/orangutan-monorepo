import genUniqueId from '../utils/id-generator'
import path from 'path'
import { packageName, urlPrefix } from '../constants'

/**
 *
 *
 * @export
 * @param {Object[]} - data
 * @param {Object} - webpackAssets
 * @params {string} - env
 * @returns {string} - html string
 */
export function buildEmbeddedCode(config, webpackAssets, env = 'production') {
  const uniqueId = `${packageName}-${genUniqueId()}`
  const stringifyData = data.reduce((acc, cur, index) => {
    if (index === 0) {
      return `["${cur}"`
    }
    if (index === data.length - 1) {
      return `${acc}, "${cur}"]`
    }
    return `${acc}, "${cur}"`
  }, '')

  const loadDataScript = `
    <script>
      (function() {
        var namespace = '__twreporterEmbeddedData'
        var packageName = '${packageName}'
        if (!window[namespace]) { window[namespace] = {} }
        if (!window[namespace][packageName]) { window[namespace][packageName] = {} }
        window[namespace][packageName]["${uniqueId}"] = {
          data: ${stringifyData},
        }
      })()
    </script>`

  const contentMarkup = `<div id="${uniqueId}" data-status="tbRendered"></div>`

  const { chunks, bundles } = webpackAssets[packageName]
  const assets = [...chunks, ...bundles]
  const pathToDist =
    env === 'production'
      ? urlPrefix
      : path.resolve(__dirname, '../../../../dist')
  const assetScript = assets
    .map(src => {
      if (src.endsWith('bundle.js')) {
        if (src.indexOf(`${packageName}`) !== -1) {
          return `<script type="text/javascript" data-id="${uniqueId}" data-name="${packageName}" src="${pathToDist}/${src}"></script>`
        }
        return
      }
      return `<script type="text/javascript" src="${pathToDist}/${src}"></script>`
    })
    .join('')

  return contentMarkup + loadDataScript + assetScript
}
