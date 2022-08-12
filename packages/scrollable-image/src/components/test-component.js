import React from 'react'
import ScrollHorizontal from './scroll-horizontal'
import styled from 'styled-components'
import { mockImgSrc, mockImgSrcs } from '../test-data/data'

const FullPage1 = styled.div`
  position: relative;
  width: 100%;
  height: ${props => (props.pixel100vh ? props.pixel100vh + 'px' : '100vh')};
  background: brown;
`

const FullPage2 = styled.div`
  position: relative;
  width: 100%;
  height: ${props => (props.pixel100vh ? props.pixel100vh + 'px' : '100vh')};
  background: green;
`

export default class TestComponent extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      pixel100vh: 0,
    }
  }

  componentDidMount() {
    this.setState({
      pixel100vh: document.documentElement.clientHeight,
    })
  }

  render() {
    const { pixel100vh } = this.state
    const EmbeddedInArticle = (
      <>
        <FullPage1 pixel100vh={pixel100vh} />
        <FullPage1 pixel100vh={pixel100vh} />
        <ScrollHorizontal imgSrc={mockImgSrc} />
        <FullPage2 pixel100vh={pixel100vh} />
        <FullPage1 pixel100vh={pixel100vh} />
        <ScrollHorizontal imgSrc={mockImgSrcs} lazyload />
        <FullPage2 pixel100vh={pixel100vh} />
      </>
    )
    // const alone = <ScrollHorizontal imgSrc={imgSrcs} />

    return <>{EmbeddedInArticle}</>
  }
}
