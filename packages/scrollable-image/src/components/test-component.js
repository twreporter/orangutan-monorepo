import React from 'react'
import ScrollHorizontal from './scroll-horizontal'
import styled from 'styled-components'

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

const imgSrc = [
  'https://static01.nyt.com/newsgraphics/2016/08/14/men-100-meters-bolt-horizontal/09c0dfe010da583c01f23709a11f6153e10cbb7b/bolt-100m-race-a3698x450.jpg',
]

const imgSrcs = Array.apply(null, Array(5)).map(() => {
  const min = 50
  const max = 500
  const height = Math.floor(Math.random() * (max - min + 1)) + min
  const width = Math.floor(Math.random() * (max - height + 1)) + height
  return `https://picsum.photos/${width}/${height}`
})

export default class TestComponent extends React.PureComponent {
  render() {
    const EmbeddedInArticle = (
      <>
        <FullPage1 />
        <FullPage1 />
        <ScrollHorizontal imgSrc={imgSrc} />
        <FullPage2 />
        <FullPage1 />
        <ScrollHorizontal imgSrc={imgSrcs} lazyload />
        <FullPage2 />
      </>
    )
    // const alone = <ScrollHorizontal imgSrc={imgSrcs} />

    return <>{EmbeddedInArticle}</>
  }
}
