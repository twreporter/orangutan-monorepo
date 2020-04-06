import dualChannel from '@twreporter/dual-channel'
import scrollableImage from '@twreporter/scrollable-image'
// `webpack-assets.json` is created by `make build`
import webpackAssets from '../dist/webpack-assets.json'

/**
 *  @typedef {Object} DualChannel
 *  @property {Object} ReactComponent - React Component to render Dual Channel style web page
 *  @property {Object} Sheets - Dual Channel specific data handler integration with spreadsheet API
 *  @property {Function} buildEmbeddedCode - Build Dual Channel embedded code
 */

/**
 *  @typedef {Object} ScrollableImage
 *  @property {Object} Component - React Component to render Scrollable Image style web page
 *  @property {Function} buildEmbeddedCode - Build Scrollable Image embedded code
 */

/**
 *  @function buildCode
 *  @param {Object} data
 *  @return {string} embedded code script
 */

/**
 *  @typedef {Object} Orangutan
 *  @property {DualChannel} dualChannel
 *  @property {buildCode} buildDualChannelEmbeddedCode
 *  @property {ScrollableImage} scrollableImage
 *  @property {buildCode} buildScrollableImageEmbeddedCode
 */

/**
 *  @type {Orangutan}
 */
export default {
  dualChannel,
  buildDualChannelEmbeddedCode: data => {
    return dualChannel.buildEmbeddedCode(data, webpackAssets['dual-channel'])
  },
  scrollableImage,
  buildScrollableImageEmbeddedCode: data => {
    return scrollableImage.buildEmbeddedCode(
      data,
      webpackAssets['scrollable-image']
    )
  },
}
