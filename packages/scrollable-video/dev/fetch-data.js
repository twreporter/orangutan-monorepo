const Sheets = require('../src/sheets').default
const path = require('path')
const { google } = require('googleapis')
const fs = require('fs')

const inputString = process.env.in
const outputString = process.env.out

// Check inputs
if (!inputString)
  throw new Error(
    'No valid input spreadsheet id. Use `in="<spreadsheet_id_1>,<spreadsheet_id_2>,..."` to specify targets.'
  )
const spreadsheetIds = inputString.split(',')

// Check outputs
let outputPaths = spreadsheetIds.map((value, i) => `data-${i + 1}.json`)
if (!outputString) {
  console.log(
    'No output paths is given. (You can specify output with `out="<output_path_1>,<output_path_2>,..."`) Use default output paths instead:\n',
    JSON.stringify(outputPaths, undefined, 2)
  )
} else {
  outputPaths = outputString.split(',')
}

if (spreadsheetIds.length !== outputPaths.length)
  throw new Error(
    `Input and output amounts did not match. Input count: ${spreadsheetIds.length}. Output count: ${outputPaths.length}`
  )

const auth = new google.auth.GoogleAuth({
  keyFile: path.resolve(__dirname, './sheets-api.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

spreadsheetIds.forEach((spreadsheetId, i) => {
  new Sheets({
    auth,
    spreadsheetId,
  })
    .getJSONData()
    .then(data => {
      if (data) {
        fs.writeFileSync(
          path.resolve(__dirname, outputPaths[i]),
          JSON.stringify(data, undefined, 2)
        )
      } else {
        console.error(
          `No valid data in response. Target id: '${spreadsheetId}'`
        )
      }
    })
    .catch(err => {
      console.error(
        `Failed to fetch data. Target id: '${spreadsheetId}'\n`,
        err
      )
    })
})
