import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Zoom from './zoom'
import defaultTheme from '../themes/default-theme'
import merge from 'lodash/merge'
import mq from '@twreporter/core/lib/utils/media-query'
import styled, { ThemeProvider } from 'styled-components'
import useEventListener from '../hooks/use-event-listener'

const _ = {
  merge,
}

const Figure = styled.figure`
  margin: 0;
  flex: 1 0 280px;
`

const Caption = styled.figcaption`
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.34px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
`

const Hd = styled.div`
  display: none;
  ${mq.hdOnly`
    display: block;
  `}
`
const Desktop = styled.div`
  display: none;
  ${mq.desktopOnly`
    display: block;
  `}
`
const Tablet = styled.div`
  display: none;
  ${mq.tabletOnly`
    display: block;
  `}
`
const Mobile = styled.div`
  display: none;
  ${mq.mobileOnly`
    display: block;
  `}
`

const ZoomableImage = ({ src, caption, alt, theme }) => {
  const [, setWindowWidth] = useState(0)
  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }

  useEventListener(window, 'resize', handleResize)

  const themedImage = customizedTheme => {
    if (!src) return null
    const theme = _.merge({}, defaultTheme, customizedTheme)
    return (
      <ThemeProvider theme={theme}>
        <Figure>
          <Zoom caption={caption}>
            <img src={src} alt={alt} />
          </Zoom>
          {theme.caption.showCaptionWhenZoomOut ? (
            <Caption>{caption}</Caption>
          ) : null}
        </Figure>
      </ThemeProvider>
    )
  }

  return (
    <React.Fragment>
      <Hd>{themedImage(theme.hd)}</Hd>
      <Desktop>{themedImage(theme.desktop)}</Desktop>
      <Tablet>{themedImage(theme.tablet)}</Tablet>
      <Mobile>{themedImage(theme.mobile)}</Mobile>
    </React.Fragment>
  )
}

ZoomableImage.propTypes = {
  src: PropTypes.string,
  caption: PropTypes.string,
  alt: PropTypes.string,
  theme: PropTypes.shape({
    image: PropTypes.shape({
      marginTop: PropTypes.number,
      marginBottom: PropTypes.number,
      marginLeft: PropTypes.number,
      marginRight: PropTypes.number,
    }),
    overlay: PropTypes.shape({
      background: PropTypes.string,
      opacity: PropTypes.number,
      zIndex: PropTypes.number,
    }),
    caption: PropTypes.shape({
      marginTop: PropTypes.number,
      marginBottom: PropTypes.number,
      marginLeft: PropTypes.number,
      marginRight: PropTypes.number,
      fontSize: PropTypes.number,
      lineHeight: PropTypes.number,
      letterSpacing: PropTypes.number,
      color: PropTypes.string,
      fontFamily: PropTypes.string,
      showCaptionWhenZoomOut: PropTypes.bool,
    }),
    zoomOptions: PropTypes.shape({
      transitionDuration: PropTypes.number,
      transitionFunction: PropTypes.string,
      scrollOffset: PropTypes.number,
    }),
    frame: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
    }),
  }),
}

ZoomableImage.defaultProps = {
  src: '',
  caption: '',
  alt: '',
  theme: defaultTheme,
}

export default ZoomableImage
