import * as predefinedPropTypes from '../../constants/prop-types'
import BaseComponents from '../base'
import BlockQuote from './blockquote'
import get from 'lodash/get'
import HeaderTwo from './header-two'
import InfoBox from './infobox'
import map from 'lodash/map'
import Paragraph from './paragraph'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { Waypoint } from 'react-waypoint'
import { connect } from 'react-redux'

const _ = {
  get,
  map,
}

/**
 * The top and bottom boundary of a element
 * @typedef {Object} Boundary
 * @property {number} top
 * @property {number} bottom
 */

const Section = styled.section`
  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    background-color: #bfbfbf;
    margin: 90px auto;
  }
`

const Chapter = styled.section`
  &:first-child > section:first-of-type {
    &::before {
      height: 0;
    }
  }

  ${Section}:first-of-type > ${HeaderTwo}:first-of-type {
    font-size: 18px;
    font-weight: bold;
    color: #808080;
    background-color: white;
    padding: 6px;
    display: inline-block;
    margin: 0;
  }
`

const Body = styled(BaseComponents.ArticleContainer)`
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
  }
`

class ArticleText extends React.Component {
  static propTypes = {
    chapters: PropTypes.arrayOf(predefinedPropTypes.chapter).isRequired,
    // provided by redux
    // currentAnchor: PropTypes.number.isRequired,
    updatAnchorIndex: PropTypes.func.isRequired,
  }

  _handlePositionChange = (
    currentPosition,
    previousPosition,
    chapterIndex,
    sectionIndex
  ) => {
    const positionState = {}
    if (currentPosition === Waypoint.inside) {
      positionState.currentChapter = chapterIndex
      positionState.currentSection = sectionIndex
    }

    if (previousPosition === Waypoint.inside) {
      positionState.previousChapter = chapterIndex
      positionState.previousSection = sectionIndex
    }

    this.props.updatAnchorIndex({
      ...positionState,
    })
  }

  _renderElements(elements) {
    return _.map(elements, (block, index) => {
      let Component = Paragraph
      if (block.type === 'infobox') {
        Component = InfoBox
      } else if (block.type === 'quote') {
        Component = BlockQuote
      } else if (block.type === 'header-two') {
        Component = ({ content }) => <HeaderTwo>{content[0]}</HeaderTwo>
      }
      return <Component key={`para_${index}`} content={block.content} />
    })
  }

  _renderChapter = (chapter, chapterIndex) => {
    const _renderSection = (section, sectionIndex) => {
      const sectionJsx = (
        <Waypoint
          key={section.id}
          id={section.id}
          topOffset="49%"
          bottomOffset="50%"
          onPositionChange={({ currentPosition, previousPosition }) => {
            this._handlePositionChange(
              currentPosition,
              previousPosition,
              chapterIndex,
              sectionIndex
            )
          }}
        >
          <Section>{this._renderElements(section.content)}</Section>
        </Waypoint>
      )
      return sectionJsx
    }
    return (
      <Chapter key={chapter.id} id={chapter.id}>
        {_.map(chapter.content, _renderSection)}
      </Chapter>
    )
  }

  render() {
    const { chapters } = this.props
    return <Body>{_.map(chapters, this._renderChapter)}</Body>
  }
}

const mapDispatchToProps = dispatch => ({
  updatAnchorIndex: dispatch.position.update,
})

export default connect(
  undefined,
  mapDispatchToProps
)(ArticleText)
