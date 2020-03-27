import fs from 'fs'
import path from 'path'
import serialize from 'serialize-javascript'
import data from '../src/test-data/data.json'

/**
 * Data
 * @typedef {Object} Data
 * @typedef {} embeddedItems
 * @typedef {} chapters
 */

/**
 *
 *
 * @export
 * @param {Data} [data={}]
 * @param {string} [baseUrl='']
 * @returns
 */
function createIndexHtml(data = {}) {
  const { embeddedItems, chapters } = data
  const html = `
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="minimum-scale=1, initial-scale=1, width=device-width"
    />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Test Document</title>
  </head>
  <body
    style="margin:0;font-family: source-han-sans-traditional, Noto Sans TC, PingFang TC, Apple LiGothic Medium, Roboto, Microsoft JhengHei, Lucida Grande, Lucida Sans Unicode, sans-serif;"
  >
		<script>
      (function() {
        window.__embeddedItems=${serialize(embeddedItems)};
        window.__chapters=${serialize(chapters)};
      })()
    </script>
    <div id="root"></div>
  </body>
</html>
  `
  fs.writeFileSync(path.resolve(__dirname, './index.html'), html, {
    encoding: 'utf8',
  })
}

createIndexHtml(data)
