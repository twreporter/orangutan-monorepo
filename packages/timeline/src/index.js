import { buildEmbeddedCode } from './build-code'
import Component from './components/timeline'
import Sheets from './sheets'
import testData from '../dev/data.json'

export default {
  Component,
  Sheets,
  buildEmbeddedCode,
  getTestData: () => testData,
}
