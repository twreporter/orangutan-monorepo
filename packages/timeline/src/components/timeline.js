import fontFamily from '../constants/font-family'
import mq from '@twreporter/core/lib/utils/media-query'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Record from './record'
import sectionLevels from '../constants/section-levels'
import styled from 'styled-components'
// lodash
import forEach from 'lodash/forEach'
import get from 'lodash/get'
import map from 'lodash/map'
import isArray from 'lodash/isArray'

const _ = {
  forEach,
  get,
  map,
  isArray,
}

const TimelineContainer = styled.article`
  &,
  * {
    box-sizing: border-box;
  }
  a,
  a:link,
  a:visited,
  a:active {
    color: rgb(166, 122, 68);
    text-decoration: none;
    border-bottom: 1px solid rgb(216, 216, 216);
  }
  a:hover {
    border-bottom: 1px solid rgb(166, 122, 68);
  }
  position: relative;
  padding-right: 13px;
  padding-bottom: 18px;
  margin-top: 20px;
  margin-bottom: 20px;
  ${mq.tabletAndBelow`
    text-align: initial;
  `}
  font-family: ${fontFamily.sansSerif};
`

const Line = styled.div`
  border-right: 2px solid black;
  width: 13px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
`

/**
 *
 *
 * @param {string} elementType
 * @returns {number} return the heading level of given element type.
 *                   if the element is not a heading element, it will return -1
 */
function getElementHeadingLevel(elementType) {
  return sectionLevels.findIndex(
    level => _.get(level, 'heading.type') === elementType
  )
}

/**
 *
 *
 * @param {Object} element
 * @param {number} maxHeadingTagLevel indicates the maximum number of <h?> tag used in timeline
 * @returns
 */
function renderElement(element, maxHeadingTagLevel) {
  // Render element by type
  const key = `${element.index}-element`
  const type = _.get(element, 'type')
  switch (type) {
    case 'record': {
      return (
        <Record
          key={key}
          {...element}
          as={`h${maxHeadingTagLevel + sectionLevels.length - 1}`}
        />
      )
    }
    default: {
      // if the element is a section heading element
      const headingLevel = getElementHeadingLevel(element.type)
      if (headingLevel > -1) {
        const Component = sectionLevels[headingLevel].heading.Component
        return (
          <Component
            key={key}
            as={`h${headingLevel + maxHeadingTagLevel}`}
            {...element}
          />
        )
      }
      // if no matched element type
      return null
    }
  }
}

/**
 *
 *
 * @param {[]} section a tuple as [headingElement, [...SubsectionsOrElements]]
 * @param {string} emphasizedLevel the level name emphasized
 * @param {number} maxHeadingTagLevel indicates the maximum number of <h?> tag used in timeline
 * @returns
 */
function renderSection(section, emphasizedLevel, maxHeadingTagLevel) {
  const [headingElement, subsectionsOrElements] = section
  const level = getElementHeadingLevel(headingElement.type)
  const SectionContainer = sectionLevels[level].Container
  const SubContentWrapper = sectionLevels[level].SubContentWrapper
  const emphasized = sectionLevels[level].name === emphasizedLevel
  return (
    <SectionContainer key={`${headingElement.type}-${headingElement.index}`}>
      {renderElement(headingElement, maxHeadingTagLevel)}
      <SubContentWrapper emphasized={emphasized}>
        {_.map(subsectionsOrElements, subsectionOrElement => {
          if (_.isArray(subsectionOrElement)) {
            const subsection = subsectionOrElement
            return renderSection(
              subsection,
              emphasizedLevel,
              maxHeadingTagLevel
            )
          }
          const element = subsectionOrElement
          return renderElement(element, maxHeadingTagLevel)
        })}
      </SubContentWrapper>
    </SectionContainer>
  )
}

export default class Timeline extends PureComponent {
  static propTypes = {
    maxHeadingTagLevel: PropTypes.number,
    emphasizedLevel: PropTypes.oneOf(_.map(sectionLevels, level => level.name)),
    data: PropTypes.array,
  }
  static defaultProps = {
    maxHeadingTagLevel: 3,
    data: [],
    emphasizedLevel: sectionLevels[1].name,
  }
  render() {
    const { data, emphasizedLevel, maxHeadingTagLevel } = this.props
    return (
      <TimelineContainer>
        <Line />
        {_.map(data, section =>
          renderSection(section, emphasizedLevel, maxHeadingTagLevel)
        )}
      </TimelineContainer>
    )
  }
}
