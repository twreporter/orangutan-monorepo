/* 
TODO:
  The major part of this function is the logic of where a node should be placed when it is added to a tree.
  Try to move the logic to the class Tree.
*/

import * as schema from './schema'
import elementTypes from '../constants/element-types'
import nodeTypes from '../constants/node-types'
// lodash
import map from 'lodash/map'

const _ = {
  map,
}

/**
 *
 *
 * @param {object}} element
 * @param {string} element.type
 * @returns {schema.Node}
 */
function elementToNode(element) {
  switch (element.type) {
    case elementTypes.record: {
      return new schema.Node({
        type: nodeTypes.record,
        data: element,
      })
    }
    case elementTypes.unitFlag: {
      return new schema.Node({
        type: nodeTypes.unitFlag,
        data: element,
      })
    }
    case elementTypes.groupFlag: {
      return new schema.Node({
        type: nodeTypes.groupFlag,
        data: element,
      })
    }
    default: {
      console.error('invalid element type: ', element.type)
    }
  }
}

/**
See `Content Format` section in `README.md` for details.

  Given:
    elements = [
      { type: 'group-flag', ... },
      { type: 'unit-flag', ... },
      { type: 'record', ... },
      { type: 'record', ... },
      { type: 'group-flag', ... },
      { type: 'unit-flag', ... },
      { type: 'record', ... },
    ]
  The output tree structure will be:
    root
    └── group-section
        ├── group-flag
        ├── unit-section
        |   ├── unit-flag
        │   └── records-section
        |       ├──record
        |       └──record
        └── unit-section
            ├── unit-flag
            └── records-section
                └──record
 *
 * @export
 * @param {object} elements
 * @returns
 */
export default function elementsToTree(elements) {
  const leafNodes = _.map(elements, elementToNode)
  const tree = new schema.Tree()
  let prevNode = tree.root
  leafNodes.forEach(leafNode => {
    switch (leafNode.type) {
      case nodeTypes.groupFlag: {
        // since group is the top type, always add group section to tree root
        new schema.Node({ type: nodeTypes.groupSection })
          .append(leafNode)
          .appendTo(tree.root)
        // set previous node before break
        prevNode = leafNode
        break
      }
      case nodeTypes.unitFlag: {
        // find the group section to which previous node belongs
        const groupSection =
          prevNode.findAncestor(node => node.type === nodeTypes.groupSection) ||
          new schema.Node({ type: nodeTypes.groupSection }).appendTo(tree.root)
        // add unit section to the group section
        new schema.Node({ type: nodeTypes.unitSection })
          .append(leafNode)
          .appendTo(groupSection)
        // set previous node before break
        prevNode = leafNode
        break
      }
      case nodeTypes.record: {
        // append the record to a records section
        const recordsSection = (
          prevNode.findAncestor(
            node => node.type === nodeTypes.recordsSection
          ) || new schema.Node({ type: nodeTypes.recordsSection })
        ).append(leafNode)
        // append the records section to a unit section
        let unitSection = prevNode.findAncestor(
          node => node.type === nodeTypes.unitSection
        )
        if (!unitSection) {
          // append the unit section to a group section
          const groupSection =
            prevNode.findAncestor(
              node => node.type === nodeTypes.groupSection
            ) ||
            new schema.Node({ type: nodeTypes.groupSection }).appendTo(
              tree.root
            )
          unitSection = new schema.Node({
            type: nodeTypes.unitSection,
          }).appendTo(groupSection)
        }
        unitSection.append(recordsSection)
        // set previous node before break
        prevNode = leafNode
        break
      }
      default:
        console.error('invalid node type', leafNode.type)
        break
    }
  })
  return tree
}
