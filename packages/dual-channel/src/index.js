import ReactComponent from './app'
import path from 'path'
import { buildEmbeddedCode } from './build-code'

export default {
  ReactComponent,
  buildEmbeddedCode,
  getWebpackEntry: () => {
    return path.resolve(__dirname, './build-code/client.js')
  },
  getTestData: () => {
    return require('./test-data/data.json')
  },
}
