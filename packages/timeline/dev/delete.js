import * as google from '../src/migrations/utils/google-services'
import path from 'path'

const fileId = process.env.ID
const keyFile =
  process.env.KEY_FILE || path.resolve(__dirname, './sheets-api.json')
const driveService = google.drive(
  google.auth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/drive'],
  })
)

console.log('Start deleting file: ', fileId)
driveService.files
  .delete({
    fileId,
  })
  .then(() => {
    console.log('file deleted')
  })
