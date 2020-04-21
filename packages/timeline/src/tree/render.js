import nodeTypes from '../constants/node-types'
import React from 'react'
import styled from 'styled-components'
// lodash
import map from 'lodash/map'
// components
import GroupFlag from '../components/group-flag'
import Record from '../components/record'
import RecordsSection from '../components/records-section'
import UnitFlag from '../components/unit-flag'

const _ = {
  map,
}

const SubsectionsWrapper = styled.div`
  background: ${props => (props.emphasized ? '#fff' : 'transparent')};
`

/**
 * @typedef {object} AppProps
 * @property {string} options.emphasizedLevel the level name emphasized
 * @property {number} options.maxHeadingTagLevel indicates the maximum number of <h?> tag used in timeline
 * @property {boolean} options.showRecordBullet show bullet of record or not
 */

/**
 *
 *
 * @export
 * @param {import('./schema').Tree} tree
 * @param {AppProps} appProps
 * @returns {import('React').ElementType}
 */
export default function renderTree(tree, appProps) {
  return _.map(tree.root.children, (child, i) => renderNode(child, appProps, i))
}

/**
 *
 *
 * @param {import('./schema').Node} node
 * @param {AppProps} appProps
 * @param {number} [index=0]
 * @returns
 */
function renderNode(node, appProps, index = 0) {
  const key = `${node.type}-${index}`
  switch (node.type) {
    case nodeTypes.groupFlag: {
      return (
        <GroupFlag
          {...node.data}
          key={key}
          as={`h${appProps.maxHeadingTagLevel}`}
        />
      )
    }
    case nodeTypes.unitFlag: {
      return (
        <UnitFlag
          {...node.data}
          key={key}
          as={`h${appProps.maxHeadingTagLevel + 1}`}
        />
      )
    }
    case nodeTypes.record: {
      return (
        <Record
          {...node.data}
          key={key}
          showBullet={appProps.showRecordBullet}
          as={`h${appProps.maxHeadingTagLevel + 2}`}
        />
      )
    }
    case nodeTypes.groupSection: {
      const headingExists = node.children[0].type === nodeTypes.groupFlag
      const subsections = headingExists ? node.children.slice(1) : node.children
      return (
        <section key={key}>
          {headingExists ? renderNode(node.children[0], appProps) : null}
          <SubsectionsWrapper
            emphasized={appProps.emphasizedLevel === nodeTypes.groupSection}
          >
            {_.map(subsections, (child, i) => renderNode(child, appProps, i))}
          </SubsectionsWrapper>
        </section>
      )
    }
    case nodeTypes.unitSection: {
      const headingExists = node.children[0].type === nodeTypes.unitFlag
      const subsections = headingExists ? node.children.slice(1) : node.children
      return (
        <section key={key}>
          {headingExists ? renderNode(node.children[0], appProps) : null}
          <SubsectionsWrapper
            emphasized={appProps.emphasizedLevel === nodeTypes.unitSection}
          >
            {_.map(subsections, (child, i) => renderNode(child, appProps, i))}
          </SubsectionsWrapper>
        </section>
      )
    }
    case nodeTypes.recordsSection: {
      return (
        <RecordsSection
          key={key}
          emphasized={appProps.emphasizedLevel === nodeTypes.recordsSection}
        >
          {_.map(node.children, (child, i) => renderNode(child, appProps, i))}
        </RecordsSection>
      )
    }
    default: {
      console.error('invalid node type:', node.type)
      return null
    }
  }
}
