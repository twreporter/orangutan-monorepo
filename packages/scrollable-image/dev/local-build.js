import ScrollableImage from '../src/index'
import fs from 'fs'
import getWebpackAssets from './get-webpack-assets'
import path from 'path'
import { mockImgSrcs } from './mock-data'

const config = {
  data: mockImgSrcs,
  lazyload: true,
}

const webpackAssets = getWebpackAssets()

fs.writeFileSync(
  path.resolve(__dirname, 'output.txt'),
  ScrollableImage.buildEmbeddedCode(config, webpackAssets),
  { flags: 'w', encoding: 'utf8' }
)
