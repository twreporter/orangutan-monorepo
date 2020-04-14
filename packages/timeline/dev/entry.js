import buildContent from '../src/build-app-content'
import data from './data.json'
import mq from '@twreporter/core/lib/utils/media-query'
import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Timeline from '../src/components/timeline'

const Container = styled.div`
  min-width: 300px;
  width: 95%;
  ${mq.tabletOnly`
    width: 513px;
  `}
  ${mq.desktopOnly`
    width:550px
  `}
  ${mq.hdOnly`
    width: 730px;
  `}
`

class App extends React.PureComponent {
  render() {
    return (
      <Container>
        <Timeline
          content={buildContent(data.elements)}
          theme={data.theme}
          {...data.appProps}
        />
      </Container>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
