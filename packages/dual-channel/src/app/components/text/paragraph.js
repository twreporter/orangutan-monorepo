/* eslint react/no-array-index-key:0 */
import Annotation from './annotation'
import BaseComponents from '../base'
import Link from './link'
import PropTypes from 'prop-types'
import React from 'react' // eslint-disable-next-line
import styled from 'styled-components'
import theme from '../../constants/theme'

const StyledParagraph = styled(BaseComponents.ArticleElementContainer)`
  font-size: ${theme.typography.font.size.medium};
  font-weight: ${theme.typography.font.weight.medium};
  line-height: ${theme.typography.lineHeight.medium};
  color: ${theme.colors.hex4A4949};
  white-space: pre-wrap;
  text-align: justify;
  margin: 30px auto;
`.withComponent('p')

class Paragraph extends React.PureComponent {
  static propTypes = {
    content: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          type: PropTypes.string,
          content: PropTypes.arrayOf(PropTypes.string),
        }),
      ])
    ).isRequired,
  }

  render() {
    const { content } = this.props
    if (Array.isArray(content) && content.length > 1) {
      const _content = content.map((ele, index) => {
        if (ele.type === 'annotation') {
          return (
            <Annotation key={`p_annotation_${index}`} content={ele.content} />
          )
        } else if (ele.type === 'link') {
          return (
            <Link key={`p_link_${index}`} href={ele.content[1]} target="_blank">
              {ele.content[0]}
            </Link>
          )
        }
        return ele
      })
      return <StyledParagraph>{_content}</StyledParagraph>
    }
    return <StyledParagraph dangerouslySetInnerHTML={{ __html: content[0] }} />
  }
}

export default Paragraph
