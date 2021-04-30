export default {}

/**
 * Image type definition
 * @typedef {Object} Image
 * @property {number} marginTop
 * @property {number} marginLeft
 * @property {number} marginRight
 * @property {number} marginBottom
 */

/**
 * Overlay type definition
 * @typedef {Object} Overlay
 * @property {string} background
 * @property {number} opacity
 * @property {number} zIndex
 */

/**
 * Caption type definition
 * @typedef {Object} Caption
 * @property {number} marginTop
 * @property {number} marginLeft
 * @property {number} marginRight
 * @property {number} marginBottom
 * @property {number} fontSize
 * @property {number} lineHeight
 * @property {number} letterSpacing
 * @property {string} color
 * @property {string} fontFamily
 * @property {boolean} showCaptionWhenZoomOut
 */

/**
 * Options type definition
 * @typedef {Object} Options
 * @property {number} transitionDuration
 * @property {string} transitionFunction
 * @property {number} scrollOffset
 */

/**
 * Frame type definition
 * @typedef {Object} Frame
 * @property {number} top
 * @property {number} bottom
 * @property {number} left
 * @property {number} right
 */

/**
 * Theme type definition
 * @typedef {Object} Theme
 * @property {Image} image
 * @property {Overlay} overlay
 * @property {Caption} caption
 * @property {Options} zoomOptions
 * @property {Frame} frame
 */
