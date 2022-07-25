import * as predefinedPropTypes from '../../constants/prop-types'
import get from 'lodash/get'
import map from 'lodash/map'
import PropTypes from 'prop-types'
import React, { PureComponent, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import mq from '../../utils/media-query'
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
  const top = TopOffset
  switch (props.sectionsPosition) {
    case Waypoint.below:
      return 'position:absolute;top:0px;'
    case Waypoint.above:
      return `position:absolute;bottom:calc(100vh - ${top} - ${itemHeight});`
    case Waypoint.inside:
      return `position:fixed;top:${top};`
    default:
      return ''
  }
}

const Container = styled.div`
  overflow: hidden;
  background-color: #f1f1f1;
  ${mq.desktopOnly`
    width: ${mockup.itemWidth.desktop}px;
    position: relative;
  `}
  ${mq.hdAbove`
    width: ${mockup.itemWidth.hd}px;
    position: relative;
  `}
  ${mq.tabletBelow`
    width: ${mockup.itemWidth.mobile};
    height: ${mockup.itemHeight.mobile};
  `}
`

const GradientMask = styled.div`
  ${mq.tabletBelow`
    height: 70px;
    background-image: linear-gradient(to bottom, #f1f1f1 14%, rgba(241, 241, 241, 0.44) 65%, rgba(241, 241, 241, 0));
    top: 50vh;
    position: fixed;
    width: ${mockup.itemWidth.mobile};
  `}
`

const ItemViewport = styled.div`
  ${mq.tabletBelow`
    width: ${mockup.itemWidth.mobile};
    height: ${mockup.itemHeight.mobile};
    ${props => {
      if (props.isFirst && props.sectionsPosition !== Waypoint.inside) {
        return `position: static;`
      } else if (props.sectionsPosition === Waypoint.above) {
        return `position: absolute; bottom: 50vh;`
      } else if (props.sectionsPosition === Waypoint.below) {
        return `position: absolute; top:0px;`
      }
      return `position: fixed; top: 0px;`
    }}
  `}
  ${mq.desktopOnly`
    width: ${mockup.itemWidth.desktop}px;
    height: ${mockup.itemHeight.desktop};
    ${props => {
      return buildItemPosition(props, 'desktop')
    }}
  `}
  ${mq.hdAbove`
    width: ${mockup.itemWidth.hd}px;
    height: ${mockup.itemHeight.hd};
    ${props => {
      return buildItemPosition(props, 'hd')
    }}
  `}
  overflow: hidden;
`

const ItemAnimationWrapper = styled.div`
  width: 100%;
  height: 100%;
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

    /* default styles for img embedded items */
    /* users can overwrite these styles in the spreadsheet */
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }

  `}

  img {
    width: 100%;
  }
`

function SectionItem(props) {
  const {
    animation,
    html,
    isFirst,
    isPrevious,
    isFocused,
    sectionsPosition,
  } = props
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
    <ItemViewport isFirst={isFirst} sectionsPosition={sectionsPosition}>
      <ItemAnimationWrapper
        isPrevious={isPrevious}
        isFocused={isFocused}
        animation={animation}
        dangerouslySetInnerHTML={{ __html: html }}
        ref={embeddedEle}
      />
    </ItemViewport>
  )
}

SectionItem.propTypes = {
  animation: PropTypes.string,
  html: PropTypes.string,
  isFirst: PropTypes.bool,
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

  _buildSectionItems = (chapter, chapterIndex) => {
    const { sectionsPosition } = this.props
    return _.map(chapter, (sectionItems, sectionIndex) => {
      return (
        <SectionItem
          key={`embedded-${chapterIndex}-${sectionIndex}`}
          animation={_.get(sectionItems, 1, 'none')}
          html={_.get(sectionItems, 0, '')}
          isPrevious={this._isPrevious(chapterIndex, sectionIndex)}
          isFocused={this._isFocus(chapterIndex, sectionIndex)}
          isFirst={chapterIndex === 0 && sectionIndex === 0}
          sectionsPosition={sectionsPosition}
        />
      )
    })
  }

  render() {
    const { sectionsPosition } = this.props
    return (
      <Container>
        {_.map(this.props.embeddedItems, this._buildSectionItems)}
        {Waypoint.inside === sectionsPosition ? <GradientMask /> : null}
      </Container>
    )
  }
}

const mapStateToProps = ({ position, sectionsPositionRelativeToViewport }) => {
  const currentChapter = position.currentChapter
  const currentSection = position.currentSection
  let sectionsPosition = sectionsPositionRelativeToViewport

  // Handle edge case:
  // In some browsers, the web page won't scroll to top
  // when users click refresh button.
  //
  // If users refresh the page, and web page does not scroll to top,
  // `sectionsPositionRelativeToViewport` would be reset to default value,
  // which is `Waypoint.below`.
  // However, `position.currentChapter` and `position.currentSection` will be set
  // according to current position.
  //
  // This situation will cause inconsistent state.
  //
  // Therefore, we need to manually set `sectionsPositionRelativeToViewport` to
  // right value.
  if (
    currentChapter > 0 &&
    currentSection > 0 &&
    sectionsPosition === Waypoint.below
  ) {
    sectionsPosition = Waypoint.inside
  }

  return {
    currentSection,
    currentChapter,
    sectionsPosition,
  }
}

export default connect(mapStateToProps)(EmbeddedItems)
