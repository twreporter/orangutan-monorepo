import React from 'react'
import ReactDOM from 'react-dom'
import Test from '../src/components/test-component'

class App extends React.PureComponent {
  render() {
    return <Test />
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
