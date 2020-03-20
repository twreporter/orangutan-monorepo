import fs from 'fs'
import path from 'path'
import ScrollableImage from '../src/index'
import { packageName, cdnLinkPrefix } from '../src/constants'

// const data = [
//  'https://static01.nyt.com/newsgraphics/2016/08/14/men-100-meters-bolt-horizontal/09c0dfe010da583c01f23709a11f6153e10cbb7b/bolt-100m-race-a3698x450.jpg',
// ]

const imgSrcs = Array.apply(null, Array(5)).map(() => {
  const min = 50
  const max = 500
  const height = Math.floor(Math.random() * (max - min + 1)) + min
  const width = Math.floor(Math.random() * (max - height + 1)) + height
  return `https://picsum.photos/${width}/${height}`
})

const config = {
  data: imgSrcs,
  lazyload: true,
}

const isProduction = process.env.NODE_ENV === 'production'
const pathToDist = isProduction ? cdnLinkPrefix : '../dist/'
const assets = fs.readFileSync(
  path.resolve(__dirname, '../dist/webpack-assets.json')
)
const webpackAssets = JSON.parse(assets)

const bundles = webpackAssets[packageName].bundles.map(bundle => {
  return pathToDist + bundle
})
const chunks = webpackAssets[packageName].chunks.map(chunk => {
  return pathToDist + chunk
})

fs.writeFileSync(
  path.resolve(__dirname, 'output.txt'),
  ScrollableImage.buildEmbeddedCode(config, { bundles, chunks }),
  { flags: 'w', encoding: 'utf8' }
)
