import React from 'react'
import ScrollHorizontal from './scroll-horizontal'
import styled from 'styled-components'
import { mockImgSrc, mockImgSrcs } from '../test-data/data'

const FullPage1 = styled.div`
  position: relative;
  width: 100%;
  height: 200vh;
  background: brown;
`

const FullPage2 = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background: green;
`

export default class TestComponent extends React.PureComponent {
  render() {
    const EmbeddedInArticle = (
      <>
        <FullPage1 />
        <FullPage1 />
        <ScrollHorizontal imgSrc={mockImgSrc} />
        <FullPage2 />
        <FullPage1 />
        <ScrollHorizontal imgSrc={mockImgSrcs} lazyload />
        <FullPage2 />
      </>
    )
    // const alone = <ScrollHorizontal imgSrc={imgSrcs} />

    return <>{EmbeddedInArticle}</>
  }
}
