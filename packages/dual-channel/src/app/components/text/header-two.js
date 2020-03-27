import styled from 'styled-components'
import theme from '../../constants/theme'

const StyledHeaderTwo = styled.h2`
  font-size: ${theme.typography.font.size.headerTwo};
  font-weight: ${theme.typography.font.weight.bold};
  line-height: 1.4;
  letter-spacing: 0.3px;
  color: ${theme.colors.hex404040};
`

export default StyledHeaderTwo
