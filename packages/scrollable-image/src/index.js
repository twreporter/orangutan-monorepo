import Component from './components/scroll-horizontal'
import path from 'path'
import { buildEmbeddedCode } from './build-code'
import { mockImgSrcs } from './test-data/data'

export default {
  Component,
  buildEmbeddedCode,
  getWebpackEntry: () => {
    return path.resolve(__dirname, './build-code/client.js')
  },
  getTestData: () => {
    return {
      data: mockImgSrcs,
      lazyload: true,
    }
  },
}
