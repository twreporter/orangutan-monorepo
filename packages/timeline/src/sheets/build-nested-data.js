import sectionLevels from '../constants/section-levels'
import get from 'lodash/get'

const _ = {
  get,
}

const levelsCount = sectionLevels.length
const maxLevel = levelsCount - 1

/**
 * return an array of empty arrays
 *
 * @returns [][]
 */
function buildEmptyStacks(length) {
  let _stacks = []
  for (let i = 0; i < length; i++) {
    _stacks.push([])
  }
  return _stacks
}

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
 * Build the `section` to which the heading element belong.
 * The elements and the subsections in the stacks will be aggregate into the section.
 *
 * @param {Object} headingElement
 * @param {[][]} stacks
 * @returns {[]} a section array like [headingElement, [...subsectionsOrElements]]
 */
/* 
 EXAMPLE 1
  INPUT :
    HEADING ELEMENT:
      elements[8] = {
        index: 8,
        type: 'unit-flag',
        ...
      }
    STACKS:
      [
        [],                               // groups
        [],                               // units
        [
          { type: 'record', index: 9, ... },
          { type: 'record', index: 10, ... },
        ],                                // records
      ]
  OUTPUT:
    [
      [],
      [
        [
          { index: 8, type: 'unit-flag', ... },
          [
            { type: 'record', index: 9, ... },
            { type: 'record', index: 10, ... },
          ]
        ]
      ],
      [],
    ]

EXAMPLE 2
  INPUT :
    HEADING ELEMENT:
      { index: 5, type: 'group-flag', ... },
    STACKS:
    [
      [],
      [
        [
          { index: 8, type: 'unit-flag', ... },
          [
            { type: 'record', index: 9, ... },
            { type: 'record', index: 10, ... },
          ]
        ]
      ],
      [
        { type: 'record', index: 6, ... },
        { type: 'record', index: 7, ... },
      ],
    ]
  OUTPUT:
    [
      [
        [
          { index: 5, type: 'group-flag', ... },
          [
            [
              null,
              [
                { type: 'record', index: 6, ... },
                { type: 'record', index: 7, ... },
              ]
            ],
            [
              { index: 8, type: 'unit-flag', ... },
              [
                { type: 'record', index: 9, ... },
                { type: 'record', index: 10, ... },
              ]
            ]
          ]
        ]
      ],
      [],
      [],
    ]
 */
function aggregateSection(headingElement, stacks) {
  const newStacks = buildEmptyStacks(levelsCount)
  const targetLevel = getElementHeadingLevel(headingElement.type)
  for (let level = maxLevel; level > targetLevel; level--) {
    const _levelStack = stacks[level]
    if (_levelStack.length > 0) {
      const _headingElement = targetLevel === level - 1 ? headingElement : null
      const _section = [_headingElement, [..._levelStack]]
      newStacks[level - 1].unshift(_section)
    }
  }
  return newStacks[targetLevel][0]
}

/**
 * Transform flat elements into nested sections.
 * A `section` can be represent by an array with two items: `[headingElement, [...subsectionsOrElements]]`
 * @export
 * @param {Object[]} elements
 * @returns
 */
/* 
  EXAMPLE:
    INPUT:
      const elements =  [
            {
              index: 0,
              type: 'group-flag',
              ...
            },
            {
              index: 1,
              type: 'unit-flag',
              ...
            },
            {
              index: 2,
              type: 'record',
              ...
            },
            {
              index: 3,
              type: 'group-flag', 
              ...
            },
            {
              index: 4,
              type: 'record',
              ...
            },
            {
              index: 5,
              type: 'record',
              ...
            },
            {
              index: 6,
              type: 'unit-flag',
              ...
            },
            {
              index: 7,
              type: 'record',
              ...
            },
            {
              index: 8,
              type: 'unit-flag',
              ...
            },
            {
              index: 9,
              type: 'record',
              ...
            },
            {
              index: 10,
              type: 'record',
              ...
            },
          ]
    OUTPUT:
      buildNestedData(elements) = [
          [
            elements[0], // group-flag
            [
              [
                elements[1], // unit-flag
                [ elements[1] ] // records
              ]
            ]
          ],
          [
            elements[3], // group-flag
            [
              [
                null, // unit-flag
                [ elements[4], elements[5] ] // records
              ],
              [
                elements[6], // unit-flag
                [ elements[7] ]  // records
              ], 
              [
                elements[8], // unit-flag
                [ elements[9], elements[10] ]  // records
              ]
            ]
          ]
        ]
*/
export function buildNestedData(elements) {
  let _stack = buildEmptyStacks(levelsCount)
  const elementsCount = elements.length
  // loop from the end of list
  for (let i = elementsCount - 1; i >= 0; i--) {
    const element = elements[i]
    const headingLevel = getElementHeadingLevel(element.type)
    if (headingLevel === -1) {
      // If the current element is not a heading element,
      // insert it to the head of corresponding level.
      // (it's only could be a `record` currently)
      _stack[maxLevel].unshift(element)
    } else {
      // If the current element is a heading element,
      // collect the elements below it and pack them into the subsection.
      const newSection = aggregateSection(element, _stack)
      _stack[headingLevel].unshift(newSection)
      // Clear the packed elements
      for (let level = maxLevel; level > headingLevel; level--) {
        _stack[level] = []
      }
    }
  }
  const topSectionLevel = _stack.findIndex(level => level.length > 0)
  if (topSectionLevel >= 0) {
    return _stack[topSectionLevel]
  }
  throw new Error('build nested data failed, no elements in any section')
}
