const dualChannel = require('@twreporter/dual-channel').default
// const scrollableImage = require('@twreporter/scrollable-image').default
// const timeline = require('@twreporter/timeline').default

module.exports = {
  'dual-channel': dualChannel.getWebpackEntry(),
  // 'scrollable-image': scrollableImage.getWebpackEntry(),
  // timeline: timeline.getWebpackEntry(),
}
