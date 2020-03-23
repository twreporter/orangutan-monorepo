/* eslint react/no-array-index-key:0 */
import PropTypes from 'prop-types'
import React from 'react' // eslint-disable-next-line
import styled from 'styled-components'
import theme from '../../constants/theme'

const Indicator = styled.span`
  cursor: pointer;
  display: inline-block;
  background-color: ${theme.colors.primary};
  border-radius: 9px;
  height: 18px;
  margin-left: 3px;
  position: relative;
  top: -3px;
  width: 18px;
  font-size: 1em;
  &::after {
    display: block;
    height: 0;
    border-color: #fff transparent;
    border-style: solid;
    border-width: ${props => (props.isOpened ? '0 6px 6px' : '6px 6px 0')};
    content: '';
    left: 3px;
    position: absolute;
    top: ${props => (props.isOpened ? '5px' : '7px')};
  }
`

const AnnotatedText = styled.span`
  color: ${theme.colors.primary};
  display: inline-block;
  line-height: ${theme.typography.lineHeight.medium};
`

const AnnotatedContent = styled.span`
  background-color: ${theme.colors.white};
  color: ${theme.colors.hex404040};
  display: ${props => (props.isOpened ? 'block' : 'none')};
  font-size: ${theme.typography.font.size.small};
  line-height: ${theme.typography.lineHeight.medium};
  padding: 16px 24px;
  margin: 16px 0;
  @keyframes fade-in-down {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  animation-name: fade-in-down;
  animation-fill-mode: both;
  animation-duration: 0.5s;
`

const AnnotationContainer = styled.abbr`
  box-sizing: border-box;
  display: inline;
  text-decoration: none;
`

// content prop example:
//  [
//    '刑求',
//    '必須釐清的是，《刑事訴訟法》所定義的不正訊問其實有許多手段。',
//  ],

export default class Annotation extends React.PureComponent {
  static propTypes = {
    content: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      isOpened: false,
    }
    this.handleToggle = this._handleToggle.bind(this)
  }

  _handleToggle() {
    this.setState({
      isOpened: !this.state.isOpened,
    })
  }

  render() {
    const { content } = this.props
    const { isOpened } = this.state

    const annotatedText = content[0]
    const _content = content.slice(1).map((data, index) => {
      return <span key={`p_${index}`}>{data}</span>
    })

    return (
      <AnnotationContainer>
        <AnnotatedText>{annotatedText}</AnnotatedText>
        <Indicator isOpened={isOpened} onClick={this.handleToggle} />
        <AnnotatedContent isOpened={isOpened}>{_content}</AnnotatedContent>
      </AnnotationContainer>
    )
  }
}
