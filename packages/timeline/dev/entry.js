import React from 'react'
import ReactDOM from 'react-dom'
import data from './data.json'
import Timeline from '../src/components/timeline'
import styled from 'styled-components'
import mq from '@twreporter/core/lib/utils/media-query'

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
          content={data.content}
          theme={data.theme}
          {...data.appProps}
        />
      </Container>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
