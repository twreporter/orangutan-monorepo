import BaseComponents from '../base'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import theme from '../../constants/theme'

const Container = styled(BaseComponents.ArticleElementContainer)`
  margin-right: auto;
  margin-left: auto;
`

const Description = styled.div`
  width: 100%;
  font-size: ${theme.typography.font.size.medium};
  color: ${theme.colors.gray50};
  text-align: justify;
  margin-top: 15px;
`

class Image extends React.PureComponent {
  static propTypes = {
    content: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  render() {
    const { content } = this.props
    // content[0] <- img src
    // content[1] <- portrait img
    // content[2] <- img alt
    // content[3] <- img description

    return (
      <Container>
        <picture>
          <source media="(orientation: portrait)" srcSet={content[1]} />
          <source media="(max-width: 768px)" srcSet={content[1]} />
          <img width="100%" src={content[0]} alt={content[2]} />
        </picture>
        <Description>{content[3]}</Description>
      </Container>
    )
  }
}

Image.propTypes = {
  content: PropTypes.array.isRequired,
}

export default Image
