import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.PureComponent {
  render() {
    return <p>Test Page</p>
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
