import { buildEmbeddedCode } from '../src/build-code'
import fs from 'fs'
import path from 'path'

const data = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './data.json'), { encoding: 'utf8' })
)

fs.writeFileSync(
  path.resolve(__dirname, 'output.html'),
  buildEmbeddedCode(data.elements, data.theme, data.appProps),
  { flags: 'w', encoding: 'utf8' }
)
