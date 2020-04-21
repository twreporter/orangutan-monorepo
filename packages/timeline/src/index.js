import { buildEmbeddedCode } from './build-code'
import Component from './components/timeline'
import Sheets from './sheets'
import testData from '../dev/data.json'
import buildContent from './tree/elements-to-tree'

export default {
  buildContent,
  buildEmbeddedCode,
  Component,
  getTestData: () => testData,
  Sheets,
}
