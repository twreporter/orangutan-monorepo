import * as predefinedPropTypes from '../../constants/prop-types'
import get from 'lodash/get'
import map from 'lodash/map'
import PropTypes from 'prop-types'
import React, { PureComponent, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import mq from '../../utils/media-query'
import styles from '../../constants/theme'
import { connect } from 'react-redux'
import { Waypoint } from 'react-waypoint'

const _ = {
  get,
  map,
}

const mockup = {
  itemWidth: {
    mobile: '100%',
    desktop: 415,
    hd: 540,
  },
  itemHeight: {
    mobile: '50vh',
    desktop: '453px',
    hd: '590px',
  },
}

export const TopOffset = '90px'

const buildItemPosition = (props, device) => {
  const itemHeight = mockup.itemHeight[device]
  const top = device === 'mobile' ? '0px' : TopOffset
  switch (props.sectionsPosition) {
    case Waypoint.below:
      return 'position:absolute;top:0px;'
    case Waypoint.above:
      return `position:absolute;bottom:calc(100vh - ${TopOffset} - ${itemHeight});`
    case Waypoint.inside:
      return `position:fixed;top:${top};`
    default:
      return ''
  }
}

const itemSize = css`
  ${mq.tabletBelow`
    width: ${mockup.itemWidth.mobile};
    height: 100%;
  `}
  ${mq.desktopOnly`
    width: ${mockup.itemWidth.desktop}px;
    height: ${mockup.itemHeight.desktop};
  `}
  ${mq.hdAbove`
    width: ${mockup.itemWidth.hd}px;
    height: ${mockup.itemHeight.hd};
  `}
`

const Container = styled.div`
  overflow: hidden;
  position: relative;
  ${mq.desktopOnly`
    width: ${mockup.itemWidth.desktop}px;
  `}
  ${mq.hdAbove`
    width: ${mockup.itemWidth.hd}px;
  `}
  ${mq.tabletBelow`
    z-index: ${styles.zIndex.embeddedItem};
    width: ${mockup.itemWidth.mobile};
    ${props =>
      props.sectionsPosition !== Waypoint.inside ? '' : `padding-bottom: 100%`};
    position: fixed;
    top: 0;
    left: 0;
  `}
`

const SectionWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  ${mq.tabletBelow`
    left: 50%;
    transform: translateX(-50%);
  `}
`

const ItemViewport = styled.div`
  ${itemSize}
  ${mq.tabletBelow`
    ${props => {
      return buildItemPosition(props, 'mobile')
    }}
  `}
  ${mq.desktopOnly`
    ${props => {
      return buildItemPosition(props, 'desktop')
    }}
  `}
  ${mq.hdAbove`
    ${props => {
      return buildItemPosition(props, 'hd')
    }}
  `}
  overflow: hidden;
`

const ItemAnimationWrapper = styled.div`
  ${itemSize}
  overflow: hidden;
  ${props => {
    switch (props.animation) {
      case 'slideUp': {
        return css`
          transform: translateY(
            ${props => (props.isFocused || props.isPrevious ? '0' : '100%')}
          );
          transition: transform 500ms ease;
        `
      }
      case 'fadeIn': {
        return css`
          opacity: ${props =>
            props.isFocused || props.isPrevious ? '100' : '0'};
          transition: opacity 500ms ease;
        `
      }
      case 'none':
      default: {
        return css`
          opacity: ${props =>
            props.isFocused || props.isPrevious ? '100' : '0'};
        `
      }
    }
  }}

  ${mq.tabletBelow`
    text-align: center;
    background-color: #f1f1f1;
  `}
`

function SectionItem(props) {
  const { animation, html, isPrevious, isFocused, sectionsPosition } = props
  const embeddedEle = useRef(null)
  useEffect(() => {
    try {
      const embedded = document.createRange().createContextualFragment(html)
      if (embedded.querySelector('script')) {
        /* reflow and rerender the document */
        embeddedEle.current.innerHTML = ''
        embeddedEle.current.appendChild(embedded)
      }
    } catch (error) {
      console.error(
        'failed to set embedded html with `createContextualFragment`',
        error
      )
    }
  }, [html])
  return (
    <SectionWrapper>
      <ItemViewport sectionsPosition={sectionsPosition}>
        <ItemAnimationWrapper
          isPrevious={isPrevious}
          isFocused={isFocused}
          animation={animation}
          dangerouslySetInnerHTML={{ __html: html }}
          ref={embeddedEle}
        />
      </ItemViewport>
    </SectionWrapper>
  )
}

SectionItem.propTypes = {
  animation: PropTypes.string,
  html: PropTypes.string,
  isPrevious: PropTypes.bool,
  isFocused: PropTypes.bool,
  sectionsPosition: PropTypes.string,
}

class EmbeddedItems extends PureComponent {
  static propTypes = {
    embeddedItems: PropTypes.arrayOf(
      PropTypes.arrayOf(predefinedPropTypes.embeddedItem)
    ).isRequired,
    // provided by redux
    currentSection: PropTypes.number.isRequired,
    currentChapter: PropTypes.number.isRequired,
    sectionsPosition: PropTypes.oneOf([
      Waypoint.above,
      Waypoint.below,
      Waypoint.inside,
    ]),
  }

  _isFocus(chapterIndex, sectionIndex) {
    const { currentChapter, currentSection } = this.props
    let isFocused = false

    // first embedded item of all chapters
    if (
      chapterIndex === 0 &&
      sectionIndex === 0 &&
      currentChapter === -1 &&
      currentSection === -1
    ) {
      isFocused = true
    }

    if (sectionIndex === currentSection && chapterIndex === currentChapter) {
      isFocused = true
    }

    return isFocused
  }

  _isPrevious(chapterIndex, sectionIndex) {
    const { currentChapter, currentSection, embeddedItems } = this.props
    let isPrevious = false

    // same chapter and
    // target section is prior to current section
    if (
      currentChapter === chapterIndex &&
      sectionIndex + 1 === currentSection
    ) {
      isPrevious = true
    }

    // target chapter is prior to current chapter and
    // target section is the last section of its chapter
    if (
      chapterIndex + 1 === currentChapter &&
      sectionIndex === embeddedItems[chapterIndex].length - 1
    ) {
      isPrevious = true
    }

    return isPrevious
  }

  _buildSectionItems = (chapters, chapterIndex) => {
    const { sectionsPosition } = this.props
    return _.map(chapters, (sectionItems, sectionIndex) => (
      <SectionItem
        key={`embedded-${chapterIndex}-${sectionIndex}`}
        animation={_.get(sectionItems, 1, 'none')}
        html={_.get(sectionItems, 0, '')}
        isPrevious={this._isPrevious(chapterIndex, sectionIndex)}
        isFocused={this._isFocus(chapterIndex, sectionIndex)}
        sectionsPosition={sectionsPosition}
      />
    ))
  }

  render() {
    return (
      <Container sectionsPosition={this.props.sectionsPosition}>
        {_.map(this.props.embeddedItems, this._buildSectionItems)}
      </Container>
    )
  }
}

const mapStateToProps = ({ position, sectionsPositionRelativeToViewport }) => ({
  currentSection: position.currentSection,
  currentChapter: position.currentChapter,
  sectionsPosition: sectionsPositionRelativeToViewport,
})

export default connect(mapStateToProps)(EmbeddedItems)
