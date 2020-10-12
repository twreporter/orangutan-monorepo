import { isSvg } from '../utils'

/**
 * animate function for zoom component
 * @param {Object} config - The config object for animation
 * @param {HTMLDivElement | null} config.originalRef
 * @param {HTMLDivElement | null} config.zoomedRef
 * @param {import('../typedef').Theme} config.themeContext
 * @param {number} config.captionHeight
 * @param {number} clientWidth
 * @param {number} clientHeight
 */
const animate = ({
  originalRef,
  zoomedRef,
  captionRef,
  themeContext,
  captionHeight,
  clientWidth,
  clientHeight,
}) => {
  if (!originalRef.current || !zoomedRef.current) return
  const { frame, image, caption, zoomOptions } = themeContext
  const { transitionDuration, transitionFunction } = zoomOptions

  const zoomTarget = originalRef.current

  const captionWidth = caption.width + caption.marginLeft + caption.marginRight

  const frameWidth =
    frame.width ||
    clientWidth - captionWidth - (image.marginLeft + image.marginRight)
  const frameHeight =
    frame.height || clientHeight - (image.marginTop + image.marginBottom)

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
  const targetTranslateX =
    (-left + (frameWidth - width) / 2 + image.marginLeft + frame.left) / scale
  const targetTranslateY =
    (-top + (frameHeight - height) / 2 + image.marginTop + frame.top) / scale

  const transform = `scale(${scale}) translate3d(${targetTranslateX}px, ${targetTranslateY}px, 0)`
  const transition = `transform ${transitionDuration}ms ${transitionFunction}`
  zoomedRef.current.style.transition = transition
  zoomedRef.current.style.transform = transform

  const captionTranslateX =
    targetTranslateX * scale + (width + scale * width) / 2 + image.marginRight

  const captionTranslateY =
    caption.align === 'top'
      ? targetTranslateY * scale +
        (height - scale * height) / 2 +
        caption.marginTop
      : targetTranslateY * scale +
        (height + scale * height) / 2 -
        (caption.marginBottom + captionHeight)

  if (captionRef.current) {
    captionRef.current.setAttribute(
      'style',
      `position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      visibility: visible;
      width: ${caption.width}px;
      transform: translate(${captionTranslateX}px, ${captionTranslateY}px);
      margin: ${caption.marginTop}px ${caption.marginRight}px ${caption.marginBottom}px ${caption.marginLeft}px;
    `
    )
  }
}

export default animate
