import { buildEmbeddedCode } from './build-code'
import buildContent from './build-app-content'
import Component from './components/timeline'
import Sheets from './sheets'
import testData from '../dev/data.json'

export default {
  buildContent,
  buildEmbeddedCode,
  Component,
  getTestData: () => testData,
  Sheets,
}
