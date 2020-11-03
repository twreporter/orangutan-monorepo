import { isSvg } from '../utils'

/**
 * animate function for zoom component
 * @param {Object} config - The config object for animation
 * @param {HTMLDivElement | null} config.originalNode
 * @param {HTMLDivElement | null} config.zoomedNode
 * @param {import('../typedef').Theme} config.themeContext
 * @param {number} clientWidth
 * @param {number} clientHeight
 */
const animate = ({
  originalNode,
  zoomedNode,
  themeContext,
  clientWidth,
  clientHeight,
}) => {
  if (!originalNode || !zoomedNode) return
  const { frame, image, zoomOptions } = themeContext

  const { marginTop, marginLeft, marginRight, marginBottom } = image
  const { transitionDuration, transitionFunction } = zoomOptions

  const zoomTarget = originalNode

  const frameWidth = frame.width || clientWidth - (marginLeft + marginRight)
  const frameHeight = frame.height || clientHeight - (marginTop + marginBottom)

  const isSvgTarget = isSvg(zoomTarget)
  const naturalWidth = isSvgTarget
    ? frameWidth
    : zoomTarget.naturalWidth || frameWidth
  const naturalHeight = isSvgTarget
    ? frameHeight
    : zoomTarget.naturalHeight || frameHeight
  const { top, left, width, height } = zoomTarget.getBoundingClientRect()

  const scaleX = Math.min(naturalWidth, frameWidth) / width
  const scaleY = Math.min(naturalHeight, frameHeight) / height
  const scale = Math.min(scaleX, scaleY)
  const translateX =
    (-left + (frameWidth - width) / 2 + marginLeft + frame.left) / scale
  const translateY =
    (-top + (frameHeight - height) / 2 + marginTop + frame.top) / scale

  const transform = `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0)`
  const transition = `transform ${transitionDuration}ms ${transitionFunction}`
  zoomedNode.style.transition = transition
  zoomedNode.style.transform = transform
}

export default animate
