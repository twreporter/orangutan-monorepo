/* eslint no-console: 0 */
import Express from 'express'
import path from 'path'
import webpackAssets from '../dist/webpack-assets.json'
import { buildEmbeddedCode } from '../src/build-code/index'

// mock data
import data from '../src/test-data/data.json'

function testGeneratedEmbeddedCode(data) {
  const distRoute = '/dist'
  const distFolder = path.resolve(__dirname, '../dist')

  let script = null
  try {
    script = buildEmbeddedCode(data, webpackAssets)
  } catch (e) {
    console.error('Error to build embedded code: ', e)
    return
  }
  const html = `
    <html>
      <body>
        ${script}
      </body>
    </html>
  `

  const app = new Express()

  app.use(distRoute, Express.static(distFolder))
  app.get('/', (req, res) => {
    res.send(html)
  })

  app.listen(8080, () => {
    console.log('You can test generated embedded code on localhost:8080')
  })
}

testGeneratedEmbeddedCode(data)
