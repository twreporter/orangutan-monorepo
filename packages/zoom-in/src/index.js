import Component from './components/zoomable-image'
import path from 'path'
import { buildEmbeddedCode } from './build-code'
import { mockData } from './test-data/data'

export default {
  Component,
  buildEmbeddedCode,
  getWebpackEntry: () => {
    return path.resolve(__dirname, './build-code/client.js')
  },
  getTestData: () => mockData,
}
