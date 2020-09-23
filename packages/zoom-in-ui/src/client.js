import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app'

const title = 'Zoom In'
const description = [
  'Generate your own zoom image',
  '・<a href="" target="_blank">Take the Tutorial</a>', // TODO: add url of user guide
  '・<a href="https://forms.gle/TidE4vNBzsPWECXDA" target="_blank">Please give us your feedback</a>',
]

ReactDOM.render(
  <App title={title} description={description} />,
  document.getElementById('root')
)
