import BaseComponents from '../base'
import Paragraph from './paragraph'
import PropTypes from 'prop-types'
import React from 'react'
import mq from '../../utils/media-query'
import styled from 'styled-components'
import theme from '../../constants/theme'

const Container = styled(BaseComponents.ArticleElementContainer)`
  margin-bottom: 80px;
  margin-left: auto;
  margin-right: auto;

  p:last-child {
    margin-bottom: 80px;
  }

  p {
    color: ${theme.colors.hex404040};
    font-size: ${theme.typography.font.size.xlarge};
    font-weight: ${theme.typography.font.weight.medium};
    line-height: ${theme.typography.lineHeight.medium};
  }

  ${mq.tabletOnly`
    width: 556px;
  `};
  ${mq.desktopOnly`
    width: 664px;
  `};
  ${mq.hdAbove`
    width: 700px;
  `};
`

class Introduction extends React.PureComponent {
  static propTypes = {
    content: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  _renderBlocks(blocks) {
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'paragraph': {
          return (
            <Paragraph key={`intro_block_${index}`} content={block.content} />
          )
        }
        default: {
          return <p key={`intro_block_${index}`}>{block}</p>
        }
      }
    })
  }

  render() {
    const { content } = this.props
    return <Container>{this._renderBlocks(content)}</Container>
  }
}

export default Introduction
