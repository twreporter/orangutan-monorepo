/* eslint react/no-array-index-key:0 */
import BaseComponents from '../base'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import theme from '../../constants/theme'

const Container = styled(BaseComponents.ArticleElementContainer)`
  white-space: pre-wrap;
  margin: 30px auto;
  color: ${theme.colors.hex808080};
  border-left: 2px solid ${theme.colors.hex808080};
  font-style: italic;
  line-height: ${theme.typography.lineHeight.large};
`

const Quote = styled.p`
  text-align: justify;
  padding-left: 30px;
  padding-right: 10px;
  font-size: ${theme.typography.font.size.medium};
`

const QuoteBy = styled.p`
  text-align: right;
  font-size: ${theme.typography.font.size.small};
  padding-right: 10px;
`

class BlockQuote extends React.PureComponent {
  static propTypes = {
    content: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  _renderQuotes(quotes) {
    return quotes.map((quote, index) => {
      return <Quote key={`quote_${index}`}>{quote}</Quote>
    })
  }
  render() {
    const { content } = this.props
    return (
      <Container as="blockquote">
        {this._renderQuotes(content.slice(0, content.length - 1))}
        <QuoteBy>—— {content[content.length - 1]}</QuoteBy>
      </Container>
    )
  }
}

export default BlockQuote
