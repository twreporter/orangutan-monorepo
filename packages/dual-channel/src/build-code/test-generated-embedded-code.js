/* eslint no-console: 0 */
import Express from 'express'
import buildConst from './constants'
import path from 'path'
import { buildEmbeddedCode } from './index'

// mock data
import data from '../../dev/data.json'

function testGeneratedEmbeddedCode(data) {
  const distRoute = '/dist'
  const distFolder = path.resolve(__dirname, '../../dist')
  const filepath = path.resolve(distFolder, 'webpack-assets.json')
  let webpackAssets = null
  try {
    webpackAssets = require(filepath)
  } catch (e) {
    console.error(`Error to load ${filepath}: `, e)
    return
  }

  let script = null
  try {
    const chunks = webpackAssets[buildConst.pkgName].chunks.map(chunk => {
      return `${distRoute}/${chunk}`
    })
    const bundles = webpackAssets[buildConst.pkgName].bundles.map(bundle => {
      return `${distRoute}/${bundle}`
    })
    script = buildEmbeddedCode(data, { chunks, bundles })
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
