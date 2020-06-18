import { buildEmbeddedCode } from '../src/build-code'
import fs from 'fs'
import path from 'path'

const dataPath = path.resolve(__dirname, './data.json')
const webpackAssetsPath = path.resolve(__dirname, '../dist/webpack-assets.json')

const data = JSON.parse(fs.readFileSync(dataPath, { encoding: 'utf8' }))

const webpackAssets = JSON.parse(
  fs.readFileSync(webpackAssetsPath, { encoding: 'utf8' })
)

fs.writeFileSync(
  path.resolve(__dirname, 'output.html'),
  buildEmbeddedCode(data, webpackAssets),
  { flags: 'w', encoding: 'utf8' }
)
