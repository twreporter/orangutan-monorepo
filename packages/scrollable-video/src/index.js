import { buildEmbeddedCode } from './build-code'
import Component from './components/scrollable-video'
import Sheets from './sheets'

export default {
  buildEmbeddedCode,
  Component,
  getTestData: () => require('../dev/data.json'),
  Sheets,
}
