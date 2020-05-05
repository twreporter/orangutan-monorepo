import * as google from '../src/migrations/utils/google-services'
import migrate from '../src/migrations/v0-to-v2'
import path from 'path'

const fromTo = process.env.FROM_TO
const sourceSpreadsheetId = process.env.SOURCE
const keyFile =
  process.env.KEY_FILE || path.resolve(__dirname, './sheets-api.json')

switch (fromTo) {
  case 'v0-to-v2': {
    const driveService = google.drive(
      google.auth({
        keyFile,
        scopes: ['https://www.googleapis.com/auth/drive'],
      })
    )
    const sheetsService = google.sheets(
      google.auth({
        keyFile,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      })
    )
    migrate({ sheetsService, driveService }, sourceSpreadsheetId)
    break
  }
  default:
    console.error(
      `No correspondent migration with "${fromTo}". You can find available options in ${path.resolve(
        __dirname,
        'migrate.js'
      )}`
    )
    break
}
