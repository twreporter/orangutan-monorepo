import buildConst from './constants'
import serialize from 'serialize-javascript'
import { v4 as uuidv4 } from 'uuid'
// lodash
import get from 'lodash/get'
import map from 'lodash/map'

const _ = {
  get,
  map,
}

/**
 *
 * @export
 * @param {import('../types.js').Data} data - Data for Scrollable Video root React component
 * @param {Object} webpackAssets - Webpack bundles and chunks
 * @param {string[]} webpackAssets.chunks - Webpack common chunks
 * @param {string[]} webpackAssets.bundles - Webpack bundles
 * @returns {string} Embedded code
 */
export function buildEmbeddedCode(data, webpackAssets) {
  // use uuid to avoid duplication id
  const uuid = uuidv4()
  const dataWithUuid = {
    video: data.video,
    captions: data.captions,
    appProps: data.appProps,
    theme: data.theme,
    uuid,
  }

  const { chunks, bundles } = webpackAssets

  return `
    <script>
      (function() {
        var namespace = '${buildConst.namespace}';
        var pkg = '${buildConst.pkgName}';
        if (typeof window != 'undefined') {
          if (!window.hasOwnProperty(namespace)) {
            window[namespace] = {};
          }
          if (window[namespace] && !window[namespace].hasOwnProperty(pkg)) {
            window[namespace][pkg] = [];
          }
          if (Array.isArray(window[namespace][pkg])) {
            var data = ${serialize(dataWithUuid)};
            window[namespace][pkg].push(data);
          }
        }
      })()
    </script>
    <div id="${uuid}"></div>
    ${_.map(chunks, chunk => {
      return `<script type="text/javascript" crossorigin src="${chunk}"></script>`
    }).join('')}
    ${_.map(bundles, bundle => {
      return `<script type="text/javascript" crossorigin src="${bundle}"></script>`
    }).join('')}
  `
}
