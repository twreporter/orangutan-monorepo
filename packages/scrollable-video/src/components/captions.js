import styled, { css } from 'styled-components'
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
// lodash
import map from 'lodash/map'

const _ = {
  map,
}

/**
 * example: '10%' -> ' + 10%', '87px' -> ' + 87px', '-5em' -> ' - 5em'
 *
 * @param {string} [offset=''] - the offset string likes '10%', '87px', '-5em'...
 * @returns
 */
function buildOffsetCSSExpression(offset = '') {
  const number = parseInt(offset, 10)
  if (!number) {
    return ''
  }
  if (number > 0) {
    return ` + ${offset}`
  }
  // if (number < 0)
  return ` - ${offset.slice(1)}`
}

function getStyleOfY(
  yBoxAlign,
  yPositionExp,
  yLocalOffsetExp,
  yPerSecond,
  captionTime,
  duration
) {
  switch (yBoxAlign) {
    case 'bottom': {
      const y = Math.round((duration - captionTime) * yPerSecond)
      const bottom =
        yLocalOffsetExp || yPositionExp
          ? `calc(${`${y}px` + yLocalOffsetExp + yPositionExp})`
          : `${y}px`
      return css`
        bottom: ${bottom};
      `
    }
    case 'top':
    default: {
      const y = Math.round(captionTime * yPerSecond)
      const top =
        yLocalOffsetExp || yPositionExp
          ? `calc(${`${y}px` + yLocalOffsetExp + yPositionExp})`
          : `${y}px`
      return css`
        top: ${top};
      `
    }
  }
}

function geyStyleOfX(xBoxAlign, xPositionExp, xLocalOffsetExp) {
  switch (xBoxAlign) {
    case 'right': {
      const right =
        xPositionExp || xLocalOffsetExp
          ? `calc(${'0px' + xPositionExp + xLocalOffsetExp})`
          : '0'
      return css`
        right: ${right};
      `
    }
    case 'center': {
      /* If the offset = x > 0, it means that the caption is moved from left to right x pixels. */
      const left =
        xPositionExp || xLocalOffsetExp
          ? `calc(${'50%' + xPositionExp + xLocalOffsetExp})`
          : '50%'
      return css`
        left: ${left};
        transform: translateX(-50%);
      `
    }
    case 'left':
    default: {
      const left =
        xPositionExp || xLocalOffsetExp
          ? `calc(${'0px' + xPositionExp + xLocalOffsetExp})`
          : '0'
      return css`
        left: ${left};
      `
    }
  }
}

const Caption = styled.div`
  opacity: ${props => (props.show ? '1' : '0')};
  transition: opacity 900ms ease-in;
  width: ${props => props.theme.captions.box.width};
  z-index: 5;
  > span {
    font-size: ${props => props.theme.captions.fontSize};
    background: ${props => props.theme.captions.box.background};
    box-decoration-break: clone;
    padding: ${props => props.theme.captions.box.spanPadding};;
    line-height: ${props => props.theme.captions.lineHeight};
    font-weight: ${props => props.theme.captions.fontWeight};
    font-stretch: normal;
    font-style: ${props => props.theme.captions.fontStyle};
    letter-spacing: 0.44px;
    color: ${props => props.theme.captions.color};
    a,
    a:link,
    a:visited,
    a:active,
    a:hover {
      color: ${props => props.theme.captions.link.color};
      text-decoration: none;
      border-bottom: ${props => props.theme.captions.link.underlineColor};
    }
  }
  position: absolute;
  text-align: ${props => props.textAlign};
  ${props =>
    geyStyleOfX(props.xBoxAlign, props.xPositionExp, props.xLocalOffsetExp)};
  ${props =>
    getStyleOfY(
      props.yBoxAlign,
      props.yPositionExp,
      props.yLocalOffsetExp,
      props.yPerSecond,
      props.captionTime,
      props.duration
    )}
  @media screen and (max-width: ${props => props.theme.mq.mobileMaxWidth}) {
    >span {
      font-size: ${props => props.theme.captions.mobileFontSize};
      background: transparent;
      box-decoration-break: initial;
      padding: 0;
    }
    padding: ${props => props.theme.captions.box.mobilePadding};
    background: ${props => props.theme.captions.box.background};
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.theme.captions.box.mobileWidth};
    line-height: ${props => props.theme.captions.mobileLineHeight};
  }
`

/**
 *
 *
 * @export
 * @param {Object} props
 * @param {import('../types.js').Caption[]} props.captions
 * @param {import('../types.js').CaptionsSetting} props.captionsSetting
 * @param {number} props.duration - Duration of the video (in second)
 * @param {number} props.sectionHeight - Height of the section (in px)
 * @param {number} props.pixel100vh - Height of 100vh (in px)
 * @returns
 */
export default function Captions(props) {
  const {
    show,
    captions,
    duration,
    secondsPer100vh,
    pixel100vh,
    captionsSetting,
  } = props
  const {
    xBoxAlign: globalXBoxAlign,
    xPosition: globalXPosition,
    yBoxAlign: globalYBoxAlign,
    yPosition: globalYPosition,
    textAlign,
  } = captionsSetting
  return (
    <React.Fragment>
      {useMemo(() => {
        if (!duration || !pixel100vh) return null
        const yPerSecond = pixel100vh / secondsPer100vh
        const globalXPositionExp = buildOffsetCSSExpression(globalXPosition)
        const globalYPositionExp = buildOffsetCSSExpression(globalYPosition)
        return _.map(captions, (caption, i) => (
          <Caption
            key={`${i}-caption`}
            show={show}
            yPerSecond={yPerSecond}
            captionTime={caption.time}
            duration={duration}
            xBoxAlign={caption.xBoxAlign || globalXBoxAlign}
            xPositionExp={
              caption.xPosition
                ? buildOffsetCSSExpression(caption.xPosition)
                : globalXPositionExp
            }
            xLocalOffsetExp={buildOffsetCSSExpression(caption.xOffset)}
            yBoxAlign={caption.yBoxAlign || globalYBoxAlign}
            yPositionExp={
              caption.yPosition
                ? buildOffsetCSSExpression(caption.yPosition)
                : globalYPositionExp
            }
            yLocalOffsetExp={buildOffsetCSSExpression(caption.yOffset)}
            textAlign={caption.textAlign || textAlign}
          >
            <span dangerouslySetInnerHTML={{ __html: caption.text }} />
          </Caption>
        ))
      }, [
        pixel100vh,
        duration,
        captions,
        secondsPer100vh,
        globalXBoxAlign,
        globalXPosition,
        globalYBoxAlign,
        globalYPosition,
        textAlign,
        show,
      ])}
    </React.Fragment>
  )
}

const captionsSettingShape = {
  xBoxAlign: PropTypes.oneOf(['center', 'left', 'right']),
  xPosition: PropTypes.string,
  yBoxAlign: PropTypes.oneOf(['top', 'bottom']),
  yPosition: PropTypes.string,
  textAlign: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
}

Captions.propTypes = {
  show: PropTypes.bool,
  captions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      time: PropTypes.number,
      xOffset: PropTypes.string,
      yOffset: PropTypes.string,
      ...captionsSettingShape,
    })
  ).isRequired,
  duration: PropTypes.number,
  sectionHeight: PropTypes.number,
  pixel100vh: PropTypes.number,
  captionsSetting: PropTypes.shape(captionsSettingShape),
  secondsPer100vh: PropTypes.number,
}

Captions.defaultProps = {
  show: false,
  captions: [],
  duration: 0,
  sectionHeight: 0,
  pixel100vh: 0,
  captionsSetting: {
    xBoxAlign: 'left',
    xPosition: '8.7%',
    yBoxAlign: 'bottom',
    yPosition: '0.5%',
    textAlign: 'left',
  },
}
