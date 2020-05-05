/* 
TODO:
  Try to move function `render` to the class Node
  So it can render the tree by traversing the tree with invoking method of each node
*/

import nodeTypes from '../constants/node-types'
import React from 'react'
import styled from 'styled-components'
// lodash
import map from 'lodash/map'
// components
import GroupFlag from '../components/group-flag'
import Record from '../components/record'
import UnitFlag from '../components/unit-flag'

const _ = {
  map,
}

const GroupContent = styled.div`
  background: ${props => (props.emphasized ? '#fff' : 'transparent')};
  margin-left: 20px;
`

const UnitContent = styled.div`
  background: ${props => (props.emphasized ? '#fff' : 'transparent')};
`

const GroupSection = styled.section`
  margin-top: 36px;
  &:first-of-type {
    margin-top: 12px;
  }
`

const UnitSection = styled.section`
  margin-top: 24px;
  &:first-of-type {
    margin-top: 12px;
  }
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
        <GroupSection key={key}>
          {headingExists ? renderNode(node.children[0], appProps) : null}
          <GroupContent
            emphasized={appProps.emphasizedLevel === nodeTypes.groupSection}
          >
            {_.map(subsections, (child, i) => renderNode(child, appProps, i))}
          </GroupContent>
        </GroupSection>
      )
    }
    case nodeTypes.unitSection: {
      const headingExists = node.children[0].type === nodeTypes.unitFlag
      const subsections = headingExists ? node.children.slice(1) : node.children
      return (
        <UnitSection key={key}>
          {headingExists ? renderNode(node.children[0], appProps) : null}
          <UnitContent
            emphasized={appProps.emphasizedLevel === nodeTypes.unitSection}
          >
            {_.map(subsections, (child, i) => renderNode(child, appProps, i))}
          </UnitContent>
        </UnitSection>
      )
    }
    default: {
      console.error('invalid node type:', node.type)
      return null
    }
  }
}
