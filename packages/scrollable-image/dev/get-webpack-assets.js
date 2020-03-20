import fs from 'fs'
import path from 'path'
import { packageName, cdnLinkPrefix } from '../src/constants'

export default function getWebpackAssets() {
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

  return {
    bundles,
    chunks,
  }
}
