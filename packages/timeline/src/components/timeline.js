import * as schema from '../tree/schema'
import defaultTheme from '../constants/default-theme'
import elementTypes from '../constants/element-types'
import mq from '@twreporter/core/lib/utils/media-query'
import nodeTypes from '../constants/node-types'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import renderTree from '../tree/render'
import styled, { ThemeProvider } from 'styled-components'
// lodash
import merge from 'lodash/merge'

const _ = {
  merge,
}

const TimelineContainer = styled.article`
  &,
  * {
    box-sizing: border-box;
  }
  position: relative;
  padding-right: 13px;
  padding-bottom: 18px;
  margin-top: 20px;
  margin-bottom: 20px;
  ${mq.tabletAndBelow`
    text-align: initial;
  `}
`

const Line = styled.div`
  border-right: 2px solid ${props => props.theme.lineColor};
  width: 13px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
`

export default class Timeline extends PureComponent {
  static propTypes = {
    content: PropTypes.instanceOf(schema.Tree),
    theme: PropTypes.shape({
      fontFamily: PropTypes.string,
      [elementTypes.record]: PropTypes.shape({
        color: PropTypes.string,
        figcaptionColor: PropTypes.string,
        figcaptionFontWeight: PropTypes.string,
        fontFamily: PropTypes.string,
        linkColor: PropTypes.string,
        linkUnderlineColor: PropTypes.string,
        pFontWeight: PropTypes.string,
        strongColor: PropTypes.string,
        titleColor: PropTypes.string,
        titleFontWeight: PropTypes.string,
      }),
      [elementTypes.unitFlag]: PropTypes.shape({
        color: PropTypes.string,
        background: PropTypes.string,
        fontFamily: PropTypes.string,
        labelFontWeight: PropTypes.string,
        titleFontWeight: PropTypes.string,
      }),
      [elementTypes.groupFlag]: PropTypes.shape({
        color: PropTypes.string,
        background: PropTypes.string,
        fontFamily: PropTypes.string,
        labelFontWeight: PropTypes.string,
        titleFontWeight: PropTypes.string,
      }),
      emphasizedElements: PropTypes.shape({
        background: PropTypes.string,
      }),
      lineColor: PropTypes.string,
    }),
    maxHeadingTagLevel: PropTypes.number,
    emphasizedLevel: PropTypes.oneOf([
      nodeTypes.groupSection,
      nodeTypes.unitSection,
    ]),
    showRecordBullet: PropTypes.bool,
  }
  static defaultProps = {
    maxHeadingTagLevel: 3,
    data: [],
    emphasizedLevel: nodeTypes.unitSection,
    theme: {},
    showRecordBullet: true,
  }
  render() {
    const { content, theme, ...appProps } = this.props
    return (
      <ThemeProvider theme={_.merge({}, defaultTheme, theme)}>
        <TimelineContainer>
          <Line />
          {renderTree(content, appProps)}
        </TimelineContainer>
      </ThemeProvider>
    )
  }
}
