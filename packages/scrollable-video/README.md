# scrollable-video

![npm (latest)](https://img.shields.io/npm/v/@twreporter/scrollable-video/latest)
![npm (rc)](https://img.shields.io/npm/v/@twreporter/scrollable-video/rc)

## Usage

### Use buildEmbeddedCode

```js
import { google } from 'googleapis'
import scrollableVideo from '@twreporter/scrollable-video'
import webpackAssets from '@twreporter/scrollable-video/dist/webpack-assets.json'

/* FETCH DATA */

const sheets = await new scrollableVideo.Sheets({
  spreadsheetId: 'your target spreadsheet id',
  auth: new google.auth.GoogleAuth({
    keyFile: 'your-key-file-path', // ex: path.resolve(__dirname, './service-account.json')
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  }),
})

const data = await sheets.getJSONData()
// data schema:
// https://github.com/twreporter/orangutan-monorepo/tree/master/packages/scrollable-video/src/types.js

/* BUILD CODE */

const codeString = scrollableVideo.buildEmbeddedCode(data, webpackAssets)
```

### Use the Component

Example:

```js
import ScrollableVideo from '@twreporter/scrollable-video'

const { appProps, ...elseProps } = data
// data schema:
// https://github.com/twreporter/orangutan-monorepo/tree/master/packages/scrollable-video/src/types.js

<ScrollableVideo.Component
  {...appProps}
  {...elseProps}
/>
```

## How to develop this package

### Test dev code

The default dev data is the data of our news article: [從租用到迫遷 ── 南鐵東移，25 年政策與地貌的轉變](https://www.twreporter.org/a/tainan-underground-railway-project-controversy)

You can run makefile command to fetch the latest data:

```sh
make dev-fetch-data

# Or specify your spreadsheet ids with `in` variable (separate with commas)
make dev-fetch-data in=1qMXdqZXtANzpOVlKRJJfVhr6YBOuzHV65VJBoylvxk0,1JwQ95yOsr7NEaAv4eX2L0b_hgKFVNqB6L2LE_rW_UXc,1P-RjNv-dFpEH0TadDHr8bEg-L-58or4IxeOgTWPO6Mo
```

If you change the paths of default data (`dev/data-1.json`, `dev/data-2.json`, and `dev/data-3.json`), you need to update the `dev/entry.js` to to merge your data into the dev sire.

We use `webpack-dev-server` to render a mock article with all elements for development. You can start the server with:

```sh
make dev-server
```

If you need to change the hostname (usually due to the CORS reasons), add `DEV_HOST=[your-custom-hostname]` for giving `webpack-dev-server` the hostname. Example:

```sh
# Start the webpack-dev-server with custom hostname
DEV_HOST=testtest.twreporter.org make dev-server
```

If you need to test your own video files in your machine, you can place them to `dev/static/[filename]`. The files will be served with url `http://localhost:8080/static/[filename]` when the `webpack-dev-server` runs. Remember to update the `src` of `video` in your json files:

```json
{
  "video": {
    "sources": [
      {
        "type": "video/mp4",
        "src": "http://localhost:8080/static/googleearth.mp4"
        /* ... */
      }
    ]
  }
  /* ... */
}
```
