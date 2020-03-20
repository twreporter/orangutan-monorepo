/* eslint no-console: 0 */
import Express from 'express'
import ScrollableImage from '../src/index'
import getWebpackAssets from './get-webpack-assets'
import path from 'path'
import { mockImgSrcs } from './mock-data'

function testEmbeddedCode(embeddedCode) {
  const app = new Express()
  app.use('/dist', Express.static(path.join(__dirname, '../dist')))
  app.get('/', (req, res) => {
    const html = `
      <html>
        <body>
          ${embeddedCode}
        </body>
      </html>
    `
    res.send(html)
  })

  app.listen(3000, () => {
    console.log('You can test generated embedded code on localhost:3000')
  })
}
const config = {
  data: mockImgSrcs,
}
const webpackAssets = getWebpackAssets()
const embeddedCode = ScrollableImage.buildEmbeddedCode(config, webpackAssets)

testEmbeddedCode(embeddedCode)
