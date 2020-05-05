import { sourceHanSansTC as fontWeight } from '@twreporter/core/lib/constants/font-weight'
import elementTypes from '../constants/element-types'
import get from 'lodash/get'
import mq from '@twreporter/core/lib/utils/media-query'
import predefinedPropTypes from '../constants/prop-types'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

const _ = {
  get,
}

const Content = styled.section`
  font-family: ${props => props.theme[elementTypes.record].fontFamily};
  position: relative;
  padding: 12px;
  margin-bottom: 12px;
  ${props =>
    props.showBullet
      ? `
        ::before {
          content: '';
          display: block;
          height: 3px;
          width: 16px;
          background: #000;
          position: absolute;
          top: 23px;
          left: -8px;
        }
      `
      : ''}
`

const Flex = styled.div`
  display: flex;
  ${mq.tabletAndBelow`
    flex-wrap: wrap;
    justify-content: center;
  `}
`

const Text = styled.div`
  ${mq.tabletAndBelow`
    flex: 1 0 100%;
    order: 2;
  `}
  ${mq.tabletAndAbove`
    flex: 1 1 100%;
  `}
`

const Title = styled.h3`
  /* h3 reset start */
  margin: 0;
  border: 0;
  outline: 0;
  font-size: 100%;
  vertical-align: baseline;
  /* h3 reset end */
  color: ${props => props.theme[elementTypes.record].titleColor};
  font-size: 20px;
  font-weight: ${fontWeight.medium};
  margin-bottom: 0.2em;
`

const P = styled.p`
  /* css reset start */
  vertical-align: baseline;
  margin: 0;
  /* css reset end */
  color: ${props => props.theme[elementTypes.record].color};
  font-size: 18px;
  line-height: 1.6;
  font-weight: ${fontWeight.normal};
  letter-spacing: 1.2px;
  margin-top: 0.4em;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
  &:first-child {
    margin-top: 0;
  }
  strong,
  em {
    color: ${props => props.theme[elementTypes.record].strongColor};
  }
  a,
  a:link,
  a:visited,
  a:active {
    color: ${props => props.theme[elementTypes.record].linkColor};
    text-decoration: none;
    border-bottom: 1px solid
      ${props => props.theme[elementTypes.record].linkUnderlineColor};
  }
  a:hover {
    border-bottom: 1px solid
      ${props => props.theme[elementTypes.record].linkColor};
  }
`

const Figure = styled.figure`
  margin: 0;
  ${mq.tabletAndBelow`
    flex: 1 1 100%;
    order: 1;
    padding: 0;
    margin-bottom: 12px;
    &>figcaption {
      margin-top: 2px;
      margin-bottom: .5em;
      line-height: 1.4;
    }
  `}
  ${mq.desktopOnly`
    flex: 1 0 280px;
    margin-left: 10px;
  `}
  ${mq.hdOnly`
    flex: 1 0 350px;
    margin-left: 12px;
  `}
  &>img {
    width: 100%;
    height: auto;
    display: block;
  }
  &>figcaption {
    font-size: 14px;
    font-weight: ${fontWeight.light};
    text-align: right;
    color: #808080;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
  }
`

function Image(props) {
  const { src, caption, alt } = props
  if (!src) return null
  return (
    <Figure>
      <img src={src} alt={alt} />
      <figcaption>{caption}</figcaption>
    </Figure>
  )
}

Image.propTypes = {
  src: PropTypes.string,
  caption: PropTypes.string,
  alt: PropTypes.string,
}

Image.defaultProps = {
  src: '',
  caption: '',
  alt: '',
}

export default class Record extends PureComponent {
  static propTypes = {
    showBullet: PropTypes.bool,
    ...predefinedPropTypes.record,
  }

  static defaultProps = {
    showBullet: true,
    content: {},
  }

  render() {
    const { as, content, showBullet } = this.props
    const { description, image, title } = content
    return (
      <Content showBullet={showBullet}>
        <Flex>
          <Text>
            {title ? <Title as={as}>{title}</Title> : null}
            {description ? (
              <div>
                {description.split('\n').map((p, i) => (
                  <P key={`p-${i}`} dangerouslySetInnerHTML={{ __html: p }} />
                ))}
              </div>
            ) : null}
          </Text>
          <Image
            src={_.get(image, 'src')}
            alt={_.get(image, 'alt')}
            caption={_.get(image, 'caption')}
          />
        </Flex>
      </Content>
    )
  }
}
