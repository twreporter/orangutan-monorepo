import styled from 'styled-components'

const RecordsSection = styled.div`
  background: ${props => (props.emphasized ? '#fff' : 'transparent')};
  margin-left: 20px;
  margin-bottom: 24px;
  &:last-of-type {
    margin-bottom: 12px;
  }
`

export default RecordsSection
