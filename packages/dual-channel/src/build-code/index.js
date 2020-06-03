/* eslint no-console: 0 */
import buildConst from './constants'
import get from 'lodash/get'
import map from 'lodash/map'
import serialize from 'serialize-javascript'
import { v4 as uuidv4 } from 'uuid'

const _ = {
  get,
  map,
}

/**
 *
 * @export
 * @param {Object} data - Data for Dual Channel Root React Component
 * @param {Object[]} data.chapters - chapters for Dual Channel Root React Component
 * @param {Object[]} data.embeddedItems - embeddedItems for Dual Channel Root React Component
 * @param {boolean} data.isFullWidth - should Dual Channel Component extend to full viewport width
 * @param {Object} webpackAssets - webpack bundles and chunks
 * @param {string[]} webpackAssets.chunks - webpack common chunks
 * @param {string[]} webpackAssets.bundles - webpack bundles
 * @returns {string} embedded code
 */
export function buildEmbeddedCode(data, webpackAssets) {
  // use uuid to avoid duplication id
  const uuid = uuidv4()
  const dataWithUuid = {
    chapters: data.chapters,
    embeddedItems: data.embeddedItems,
    isFullWidth: data.isFullWidth,
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
    <div id=${uuid}></div>
    ${_.map(chunks, chunk => {
      return `<script type="text/javascript" crossorigin src="${chunk}"></script>`
    }).join('')}
    ${_.map(bundles, bundle => {
      return `<script type="text/javascript" crossorigin src="${bundle}"></script>`
    }).join('')}
  `
}
