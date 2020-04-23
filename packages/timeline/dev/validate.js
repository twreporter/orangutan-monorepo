import Sheets from '../src/sheets'
import fs from 'fs'
import path from 'path'

const data = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './data.json'), { encoding: 'utf8' })
)

Sheets.validateSync(data)
