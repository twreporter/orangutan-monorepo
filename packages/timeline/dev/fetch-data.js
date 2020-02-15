const Sheets = require('../src/sheets').default
const path = require('path')
const { google } = require('googleapis')
const fs = require('fs')

const spreadsheetId = process.env.SHEET
if (!spreadsheetId) {
  throw new Error(
    'You should pass the spreadsheetId with environment variable `SHEET`'
  )
}

const auth = new google.auth.GoogleAuth({
  keyFile: path.resolve(__dirname, './sheets-api.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

const sheet = new Sheets({
  auth,
  spreadsheetId,
})

const output = path.resolve(__dirname, 'data.json')

sheet
  .getJSONData()
  .then(data => {
    if (data) {
      fs.writeFileSync(output, JSON.stringify(data, undefined, 2))
    }
  })
  .catch(err => {
    console.error(err)
  })
