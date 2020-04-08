import GroupFlag from '../components/group-flag'
import UnitFlag from '../components/unit-flag'
import styled from 'styled-components'
import elementTypes from './element-types'

const Section = styled.section``

const Div = styled.div`
  background: ${props => (props.emphasized ? '#fff' : 'transparent')};
`

const RecordsWrapper = styled.div`
  background: ${props => (props.emphasized ? '#fff' : 'transparent')};
  margin-left: 20px;
  margin-bottom: 24px;
  &:last-of-type {
    margin-bottom: 12px;
  }
`

const sectionLevels = [
  {
    name: 'group',
    heading: {
      type: elementTypes.groupFlag,
      Component: GroupFlag,
    },
    Container: Section,
    SubContentWrapper: Div,
  },
  {
    name: 'unit',
    heading: {
      type: elementTypes.unitFlag,
      Component: UnitFlag,
    },
    Container: Section,
    SubContentWrapper: RecordsWrapper,
  },
  {
    name: 'record',
    Container: Section,
  },
]

// sectionLevel.forEach((level, i) => { level.index = i })

export default sectionLevels
