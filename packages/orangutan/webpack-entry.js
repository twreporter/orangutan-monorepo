const dualChannel = require('@twreporter/dual-channel').default
const scrollableImage = require('@twreporter/scrollable-image').default
const zoomIn = require('@twreporter/zoom-in').default

module.exports = {
  'dual-channel': dualChannel.getWebpackEntry(),
  'scrollable-image': scrollableImage.getWebpackEntry(),
  'zoom-in': zoomIn.getWebpackEntry(),
}
