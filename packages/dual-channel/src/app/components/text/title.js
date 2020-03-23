import styled from 'styled-components'
import theme from '../../constants/theme'

const H1 = styled.h1`
  font-size: ${theme.typography.font.size.title};
  font-weight: ${theme.typography.font.weight.bold};
  line-height: 1.4;
  letter-spacing: 0.4px;
  color: ${theme.colors.hex404040};
`

export default H1
