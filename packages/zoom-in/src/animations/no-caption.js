import { isSvg } from '../utils'

/**
 * animate function for zoom component
 * @param {Object} config - The config object for animation
 * @param {HTMLDivElement | null} config.originalRef
 * @param {HTMLDivElement | null} config.zoomedRef
 * @param {Theme} config.themeContext
 * @param {number} clientWidth
 * @param {number} clientHeight
 */
const animate = ({
  originalRef,
  zoomedRef,
  themeContext,
  clientWidth,
  clientHeight,
}) => {
  if (!originalRef.current || !zoomedRef.current) return
  const { frame, image, zoomOptions } = themeContext

  const { marginTop, marginLeft, marginRight, marginBottom } = image
  const { transitionDuration, transitionFunction } = zoomOptions

  const zoomTarget = originalRef.current

  const frameWidth = frame.width || clientWidth - (marginLeft + marginRight)
  const frameHeight = frame.height || clientHeight - (marginTop + marginBottom)

  const naturalWidth = isSvg(zoomTarget)
    ? frameWidth
    : zoomTarget.naturalWidth || frameWidth
  const naturalHeight = isSvg(zoomTarget)
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
  zoomedRef.current.style.transition = transition
  zoomedRef.current.style.transform = transform
}

export default animate
