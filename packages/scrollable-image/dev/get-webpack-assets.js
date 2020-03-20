import webpackAssets from '../dist/webpack-assets.json'
import { packageName, cdnLinkPrefix } from '../src/constants'

export default function getWebpackAssets() {
  const isProduction = process.env.NODE_ENV === 'production'
  const pathToDist = isProduction ? cdnLinkPrefix : '../dist/'
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
