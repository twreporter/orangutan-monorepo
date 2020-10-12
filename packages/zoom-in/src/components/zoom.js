import React, {
  Children,
  cloneElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import animations from '../animations'
import styled, { ThemeContext } from 'styled-components'
import useEventListener from '../hooks/use-event-listener'
import { getViewportSize } from '../utils'

const Container = styled.div`
  position: relative;
`

const Original = styled.div`
  visibility: hidden;
  ${props =>
    props.isZoomed
      ? `position: absolute;
		 left: 0;
     top: 0;`
      : `position: relative;`}
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
  ${props =>
    props.show
      ? `cursor: pointer;
     cursor: zoom-out;`
      : ''}
`

const Zoomable = styled.div`
  cursor: pointer;
  cursor: zoom-in;
  ${props =>
    props.isZoomed
      ? `cursor: pointer;
     cursor: zoom-out;`
      : `position: absolute;
		 left: 0;
     top: 0;
     `}
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
  const [isZoomed, setZoom] = useState(false)
  const overlayRef = useRef(null)
  const originalRef = useRef(null)
  const zoomedRef = useRef(null)
  const containerRef = useRef(null)
  const captionRef = useRef(null)

  let isAnimating = false
  const setAnimating = bool => {
    isAnimating = bool
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
    if (!zoomedRef.current || !captionRef.current) return

    setAnimating(false)
    captionRef.current.style.opacity = 1
    zoomedRef.current.removeEventListener('transitionend', handleOpenEnd)
  }

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
    containerRef.current.style.zIndex = overlay.zIndex
    overlayRef.current.style.display = 'block'
    window.requestAnimationFrame(() => {
      overlayRef.current.style.opacity = overlay.opacity
    })

    zoomedRef.current.addEventListener('transitionend', handleOpenEnd)
    setZoom(true)
    animate({
      originalNode: originalRef.current,
      zoomedNode: zoomedRef.current,
      captionNode: captionRef.current,
      themeContext,
      captionHeight: getCaptionHeight(props.caption.length),
      clientWidth,
      clientHeight,
    })
  }

  const handleCloseEnd = () => {
    if (!zoomedRef.current) return

    setZoom(false)
    setAnimating(false)
    containerRef.current.style.zIndex = '0'
    overlayRef.current.style.display = 'none'
    zoomedRef.current.removeEventListener('transitionend', handleCloseEnd)
  }

  const close = () => {
    if (isAnimating || !isZoomed) return
    if (!containerRef.current || !overlayRef.current || !zoomedRef.current)
      return

    setAnimating(true)
    overlayRef.current.style.opacity = '0'
    zoomedRef.current.addEventListener('transitionend', handleCloseEnd)
    zoomedRef.current.style.transform = ''

    captionRef.current.setAttribute(
      'style',
      `position: absolute;
       top: 0;
       left: 0;
       opacity: 0;
       visibility: hidden;`
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
    if (isAnimating) return

    const currentScroll =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0

    if (Math.abs(scrollTop - currentScroll) > zoomOptions.scrollOffset) {
      setTimeout(close, 150)
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
      <Original isZoomed={isZoomed} onClick={toggle}>
        {cloneElement(props.children, { ref: originalRef })}
      </Original>
      <Overlay
        ref={overlayRef}
        show={isZoomed}
        background={overlay.background}
        onClick={close}
        transitionDuration={zoomOptions.transitionDuration}
      />
      <Zoomable isZoomed={isZoomed} onClick={toggle}>
        {cloneElement(props.children, { ref: zoomedRef })}
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
