import { renderElement } from '@twreporter/react-article-components/lib/components/body'
import data01 from './data-1.json'
import data02 from './data-2.json'
import data03 from './data-3.json'
import mockPostElements from './mock-post-elements.json'
import mq from '@twreporter/core/lib/utils/media-query'
import React from 'react'
import ReactDOM from 'react-dom'
import ScrollableVideo from '../src/components/scrollable-video'
import styled from 'styled-components'
// lodash
import map from 'lodash/map'

const _ = {
  map,
}

const Container = styled.div`
  box-sizing: border-box;
  min-width: 300px;
  width: 95%;
  margin: 0 auto;
  padding: 20px;
  border: 5px solid gray;
  ${mq.tabletOnly`
    width: 513px;
  `}
  ${mq.desktopOnly`
    width:550px;
  `}
  ${mq.hdOnly`
    width: 730px;
  `}
`

class App extends React.PureComponent {
  render() {
    return (
      <Container>
        {_.map(mockPostElements.slice(0, 5), element => renderElement(element))}
        <ScrollableVideo
          {...data01.appProps}
          captions={data01.captions}
          theme={data01.theme}
          video={data01.video}
        />
        {_.map(mockPostElements.slice(0, 5), element => renderElement(element))}
        <ScrollableVideo
          {...data02.appProps}
          captions={data02.captions}
          theme={data02.theme}
          video={data02.video}
        />
        {_.map(mockPostElements.slice(0, 5), element => renderElement(element))}
        <ScrollableVideo
          {...data03.appProps}
          captions={data03.captions}
          theme={data03.theme}
          video={data03.video}
        />
        {_.map(mockPostElements, element => renderElement(element))}
      </Container>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
