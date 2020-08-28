import get from 'lodash/get'
import serialize from 'serialize-javascript'
import { packageName } from '../constants'
import { v4 as uuidv4 } from 'uuid'

const _ = {
  get,
}

/**
 *
 *
 * @export
 * @param {Object} - config
 * @param {Object} - webpackAssets
 * @returns {string} - html string
 */
export function buildEmbeddedCode(config, webpackAssets) {
  const uuid = uuidv4()

  const dataWithUuid = {
    uuid,
    data: _.get(config, 'data'),
  }

  const contentMarkup = `<div id="${uuid}"></div>`

  const loadDataScript = `
    <script>
      (function() {
        var namespace = '__twreporterEmbeddedData'
        var packageName = '${packageName}'
        if (typeof window != 'undefined') {
          if (!window[namespace]) { 
            window[namespace] = {}
          }
          if (window[namespace] && !window[namespace][packageName]) { 
            window[namespace][packageName] = [] 
          }
        }
        if (Array.isArray(window[namespace][packageName])) {
          var data = ${serialize(dataWithUuid)}
          window[namespace][packageName].push(data)
        }
      })()
    </script>`

  const { chunks, bundles } = webpackAssets
  const assets = [...chunks, ...bundles]
  const assetScript = assets
    .map(src => `<script type="text/javascript" src="${src}"></script>`)
    .join('')

  return contentMarkup + loadDataScript + assetScript
}
