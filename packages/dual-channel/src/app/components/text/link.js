import styled from 'styled-components'
import theme from '../../constants/theme'

const StyledLink = styled.a`
  display: inline;
  text-decoration: none;
  border-bottom: 1px solid;
  border-bottom-color: ${theme.colors.primary};
  color: ${theme.colors.hex404040};

  &:hover {
    color: ${theme.colors.primary};
  }
`

export default StyledLink
