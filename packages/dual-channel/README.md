# Dual-channel

![npm (latest)](https://img.shields.io/npm/v/@twreporter/dual-channel/latest)
![npm (rc)](https://img.shields.io/npm/v/@twreporter/dual-channel/rc)

Dual Channel is a React Component to simultaneously present paragraphs and images in the browser viewport.

# Developer Document

## Install

Install dependencies:

```bash
make check-dep
```

## Dev

```bash
make dev-server
```

## Build

```bash
make build
```

### Test Embedded Code with Mock Data

```bash
make test-embedded-code
```

## Import React Component

You can import either

Option 1:

```
import dualChannel from '@twreporter/dual-channel'

const ReactComponent = dualChannel.ReactComponent
```

or

Option 2:

```
import ReactComponent from '@twreporter/dual-channel/lib/app'
```

## Import Sheets Class

```
import Sheets from '@twreporter/dual-channel/lib/sheets'

const sheets = new Sheets({
  spreadsheetId,
  keyFile,
  targetSheetsId,
})
```

The reaseon why `Sheets` is not exported in `src/index.js` is because it imports `googleapis`.
`googleapis` imports nodejs specific modules, which makes webpack build failure.
Thus, we need to import `Sheets` directly from its file.

## Data

### Reproduce Demo Data

The demo data file is `dev/data.json`,
and it is generated from this [demo spreadsheet](https://docs.google.com/spreadsheets/d/1Ppisv4HTZHYMp95umgCoADNuP1PSkL-t9na-5lRIqSY).

You can reproduce `dev/data.json` by the following sample codes.

```javascript
import Sheets from './src/sheets'
import path from 'path'
import fs from 'fs'

const sheets = new Sheets({
  spreadsheetId: '1Ppisv4HTZHYMp95umgCoADNuP1PSkL-t9na-5lRIqSY',
  keyFile: path.resolve(__dirname, './spreadsheet-api-key-file.json'),
  targetSheetsId: [2143095237, 492967532, 2049208510, 489341977, 1453335111],
})

sheets.getJSONData().then(data => {
  fs.writeFileSync(
    path.resolve(__dirname, './dev/data.json'),
    JSON.stringify(data),
    { encoding: 'utf8' }
  )
})
```

In the above sample codes,
you have to download service account and name it as `spreadsheet-api-key-file.json`.
The service account is used to be authenticated by Google Sheet API.

If you don't have service account, you can create one by

1. Go to the [Developer Console](https://console.cloud.google.com/apis/credentials)
2. Click your project or create one if you have none
3. Click `APIs & Services` tab
4. Click `Credentials` tab
5. Click `Manage service accounts` tab
6. Create service account.

Besides createing service account, you also have to enable `Google Sheets API`.

1. Go to the [Developer Console](https://console.cloud.google.com/apis/credentials)
2. Click your project
3. Click `APIs & Services` tab
4. Click `Library` tab
5. search `Google Sheets API`
6. enable `Google Sheets API`

## Build Embedded Code

```javascript
import Sheets from '@twreporter/dual-channel/lib/sheets'

const sheets = new dualChannelUtils.Sheets({
  spreadsheetId: '1Ppisv4HTZHYMp95umgCoADNuP1PSkL-t9na-5lRIqSY',
  keyFile: path.resolve(__dirname, './spreadsheet-api-key-file.json'),
  targetSheetsId: [2143095237, 492967532, 2049208510, 489341977, 1453335111],
})

sheets
  .getJSONData()
  .then(data => {
    return dualChannelUtils.buildEmbeddedCode(data)
  })
  .then(embeddedCode => {
    // You could copy embeddedCode and past it in html file
  })
```

## Troubleshooting

### I got 'Insufficient Permission' or 'The caller does not have permission' error message

1. You should check if service account is provided, make sure you give the right file path.
2. Make sure you already enable your `Google Sheets API` in your project.
3. Find your service account email.

```bash
$ cat spreadsheet-api-key-file.json | grep client_email
```

and share your spreadsheet with your service account email.
