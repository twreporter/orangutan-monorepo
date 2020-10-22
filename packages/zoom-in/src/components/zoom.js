import React, { Children, useContext, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import animations from '../animations'
import styled, { ThemeContext } from 'styled-components'
import useEventListener from '../hooks/use-event-listener'
import { getViewportSize } from '../utils'

const Container = styled.div`
  position: relative;
`

const imgWrapper = styled.div`
  & > img {
    width: 100%;
    height: auto;
    display: block;
  }
`

const Original = styled(imgWrapper)`
  visibility: hidden;
  position: relative;
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0;
  transition: opacity ${props => props.transitionDuration}ms;
  background: ${props => props.background};
`

const Zoomable = styled(imgWrapper)`
  cursor: pointer;
  cursor: zoom-in;
  position: absolute;
  left: 0;
  top: 0;
`

const Caption = styled.figcaption`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  margin: 0;
  color: ${props => props.color};
  font-size: ${props => props.fontSize}px;
  line-height: ${props => props.lineHeight}px;
  letter-spacing: ${props => props.letterSpacing}px;
  text-align: left;
  ${props => (props.fontFamily ? `font-family: ${props.fontFamily};` : '')}
`

const Zoom = props => {
  const themeContext = useContext(ThemeContext)
  const { zoomOptions } = themeContext
  const animate = animations[themeContext.caption.side] || animations.default
  const overlayRef = useRef(null)
  const originalRef = useRef(null)
  const zoomedRef = useRef(null)
  const containerRef = useRef(null)
  const captionRef = useRef(null)

  let isAnimating = false
  const setAnimating = bool => {
    isAnimating = bool
  }

  let isZoomed = false
  const setZoom = bool => {
    isZoomed = bool
  }

  const getCaptionHeight = captionLength => {
    const { fontSize, letterSpacing, width, lineHeight } = themeContext.caption
    const height =
      Math.ceil((captionLength * (fontSize + letterSpacing)) / width) *
      lineHeight
    return height
  }

  const handleOpenEnd = () => {
    if (!isAnimating) return
    if (!captionRef.current) return

    setAnimating(false)
    captionRef.current.style.opacity = 1
  }

  const handleCloseEnd = () => {
    if (!containerRef.current || !overlayRef.current || !zoomedRef.current)
      return

    overlayRef.current.style.cursor = ''
    zoomedRef.current.setAttribute(
      'style',
      `position: absolute;
		   left: 0;
       top: 0;
       cursor: pointer;
       cursor: zoom-in;`
    )
    setAnimating(false)
    containerRef.current.style.zIndex = '0'
    overlayRef.current.style.display = 'none'
  }

  const handleTransitionEnd = () =>
    isZoomed ? handleOpenEnd() : handleCloseEnd()

  let scrollTop = 0

  const open = ({ target } = {}) => {
    if (!target) return
    if (isZoomed) return
    if (!containerRef.current || !overlayRef.current || !zoomedRef.current)
      return

    const { overlay } = themeContext
    const { width: clientWidth, height: clientHeight } = getViewportSize()

    scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0

    setAnimating(true)
    setZoom(true)

    containerRef.current.style.zIndex = overlay.zIndex
    overlayRef.current.style.display = 'block'

    overlayRef.current.setAttribute(
      'style',
      `cursor: pointer;
      cursor: zoom-out;`
    )
    zoomedRef.current.setAttribute(
      'style',
      `cursor: pointer;
      cursor: zoom-out;`
    )

    animate({
      originalNode: originalRef.current,
      zoomedNode: zoomedRef.current,
      captionNode: captionRef.current,
      themeContext,
      captionHeight: getCaptionHeight(props.caption.length),
      clientWidth,
      clientHeight,
    })

    overlayRef.current.style.opacity = overlay.opacity
  }

  const close = () => {
    if (isAnimating || !isZoomed) return
    if (
      !overlayRef.current ||
      !zoomedRef.current ||
      !captionRef.current ||
      !originalRef.current
    )
      return

    setAnimating(true)
    setZoom(false)

    overlayRef.current.style.opacity = '0'
    zoomedRef.current.style.transform = ''

    captionRef.current.setAttribute(
      'style',
      `position: absolute;
       top: 0;
       left: 0;
       opacity: 0;
       visibility: hidden;`
    )
    originalRef.current.setAttribute(
      'style',
      `visibility: hidden;
       position: relative;`
    )
  }

  const toggle = ({ target } = {}) => {
    if (isZoomed) {
      return close()
    }
    if (target) {
      return open({ target })
    }
  }

  const handleScroll = () => {
    if (isAnimating || !isZoomed) return

    const currentScroll =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0

    if (Math.abs(scrollTop - currentScroll) > zoomOptions.scrollOffset) {
      setTimeout(close, 50)
    }
  }

  const handleKeyUp = event => {
    const key = event.key || event.keyCode

    // Close if escape key is pressed
    if (key === 'Escape' || key === 'Esc' || key === 27) {
      close()
    }
  }

  useEffect(() => {
    if (!originalRef.current || !zoomedRef.current) return
    originalRef.current.style.width = '100%'
    zoomedRef.current.style.width = '100%'
    overlayRef.current.style.display = 'none'
  }, [])
  useEventListener(document, 'keyup', handleKeyUp)
  useEventListener(document, 'scroll', handleScroll)
  useEventListener(window, 'resize', close)
  useEventListener(zoomedRef, 'transitionend', handleTransitionEnd)

  if (Children.count(props.children) !== 1) {
    console.error(`
      Error: Adjacent JSX elements must be wrapped in an enclosing tag. 
      Did you want a <div>...</div>?
    `)
    return null
  }

  const { overlay, caption } = themeContext

  return (
    <Container ref={containerRef}>
      <Original ref={originalRef} onClick={toggle}>
        {props.children}
      </Original>
      <Overlay
        ref={overlayRef}
        background={overlay.background}
        onClick={close}
        transitionDuration={zoomOptions.transitionDuration}
      />
      <Zoomable ref={zoomedRef} onClick={toggle}>
        {props.children}
      </Zoomable>
      <Caption
        ref={captionRef}
        fontSize={caption.fontSize}
        lineHeight={caption.lineHeight}
        letterSpacing={caption.letterSpacing}
        color={caption.color}
        fontFamily={caption.fontFamily}
      >
        {props.caption}
      </Caption>
    </Container>
  )
}

Zoom.propTypes = {
  children: PropTypes.node.isRequired,
  caption: PropTypes.string,
}

Zoom.defaultProps = {
  caption: '',
}

export default Zoom
