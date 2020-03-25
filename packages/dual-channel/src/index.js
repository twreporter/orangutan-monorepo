import ReactComponent from './app'
import Sheets from './sheets'
import path from 'path'
import { buildEmbeddedCode } from './build-code'

export default {
  ReactComponent,
  Sheets,
  buildEmbeddedCode,
  getWebpackEntry: () => {
    return path.resolve(__dirname, './build-code/client.js')
  },
}
