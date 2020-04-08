import fs from 'fs'
import path from 'path'
import { buildEmbeddedCode } from '../src/build-code'

const data = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './data.json'), { encoding: 'utf8' })
)

fs.writeFileSync(
  path.resolve(__dirname, 'output.txt'),
  buildEmbeddedCode(data.content, data.theme, data.appProps),
  { flags: 'w', encoding: 'utf8' }
)
