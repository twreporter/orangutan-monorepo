# timeline

![npm (latest)](https://img.shields.io/npm/v/@twreporter/timeline/latest)
![npm (rc)](https://img.shields.io/npm/v/@twreporter/timeline/rc)

## What is this

This is a tool for building timeline graphs. It is published as an [npm package](https://www.npmjs.com/package/@twreporter/timeline).

The timeline graphs are used in the news articles of [The Reporter Taiwan](https://www.twreporter.org).

Here are some examples:

- [【不斷更新】武漢肺炎大事記：從全球到台灣，疫情如何發展？](https://www.twreporter.org/a/2019-ncov-epidemic)
- [政治風暴成疫情破口：關鍵 4 天，馬來西亞從抗疫模範淪為後段班](https://www.twreporter.org/a/opinion-covid-19-malaysia-coup-and-epidemic)
- [來自歐洲疫情最嚴峻中心的聲音 ── 全國封鎖中、持續抵抗病毒的義大利](https://www.twreporter.org/a/covid-19-interview-italian-doctor-historian-psychologist)

We also provide a servcie to convert your timeline data on Google Spreadsheet into embedded code. See the [User Guide](https://medium.com/twreporter/twreporter-lab-timeline-news-tool-4fe8db1035f2) (zh-tw).

## Data Structure

![timeline example](./timeline.jpg)

### sections

A timeline graph is divided into several sections. There are two levels of section for now:

- `group`: one `unit` section or several ones may constitute a `group` section. Which means `unit` is the subsection of `group`
- `unit`: the lowest level of section

The background blocks are divided according to one of section types.

A section contain one heading element (optional), and may have multiple subsections or sub-elements.

### elements

_Elements_ are the basic items in sections. In principle, one _element_ corresponds to one _row_ of the data sheet.

There are three types of element for now:

- `group-flag`: the heading element of a group section
- `unit-flag`: the heading element of a unit section
- `record`: basic content element which may contain text and image

## How to use this package

### Install

```bash
yarn add @twreporter/timeline
```

### Usage

#### Use NodeJS Code Builder

Example:

```js
const timelineUtils = require('@twreporter/timeline').default
const path = require('path')
const fs = require('fs')

function handleSuccess(result) {
  return [result, undefined]
}

function handleFailure(error) {
  return [undefined, error]
}

// Setup Authentication for fetching data from spreadsheet
const keyFilePath = 'your-key-file-path' // ex: path.resolve(__dirname, './service-account.json')
const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

async function timeline() {
  // Use timelineUtils.Sheets to fetch data from spreadsheet
  const sheets = await new timelineUtils.Sheets({
    spreadsheetId: 'your target spreadsheet id',
    auth,
  })
  const jsonData = await sheets.getJSONData()
  // Use timelineUtils.Sheets to validate fetched data
  const [result, error] = await sheets
    .validate(jsonData)
    .then(handleSuccess, handleFailure)
  if (error) {
    /* handle the validation error here */
    /*
      We use `yup` to validate. Here's its error format:
      https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
    */
  }

  // You can build the embedded code (as HTML string) with fetched data
  const embeddedCode = timelineUtils.buildEmbeddedCode(
    jsonData.elements,
    jsonData.theme,
    jsonData.appProps
  )

  // Or render the Timeline component with fetched data
  const Timeline = timelineUtils.Component
  const ReactDOMServer = require('react-dom/server')
  const React = require('react')
  const html = ReactDOMServer.renderToStaticMarkup(
    <Timeline
      content={timelineUtils.buildContent(jsonData.elements)}
      theme={jsonData.theme}
      {...jsonData.appProps}
    />
  )
}
```

#### Use Timeline React Component

##### Props

- `content`: See the content format below
- `theme`: Custom theme. See the theme schema and default values in [`src/constants/default-theme.js`](https://github.com/twreporter/orangutan-monorepo/blob/master/packages/timeline/src/constants/default-theme.js)
- `maxHeadingTagLevel`: If it's set to `3`, the heading element will start with html tag `h3`. The default value is `3`.
- `emphasizedLevel`: `unit` or `group`. It will apply blocks with white background to the content of that section level (Not include the heading element). The default value is `unit`.
- `showRecordBullet`: Show the bullet of record or not. The default value is `true`.

See details of the component in [`src/components/timeline.js`](https://github.com/twreporter/orangutan-monorepo/blob/master/packages/timeline/src/components/timeline.js)

##### Content Format

The `content` is data with **tree** structure. The tree is composed with `nodes`.

We can use `buildContent` to transform flat spreadsheet `elements` to tree `content`. Each element will be a leaf node in the content tree.

For example, given `elements`:

```js
const elements = [
  { type: 'group-flag' /* ... */ },
  { type: 'unit-flag' /* ... */ },
  { type: 'record' /* ... */ },
  { type: 'record' /* ... */ },
  { type: 'group-flag' /* ... */ },
  { type: 'unit-flag' /* ... */ },
  { type: 'record' /* ... */ },
]
```

The tree structure of `buildContent(elements)` will be:

```
# each line represents a node
root
└── group-section
    ├── group-flag
    ├── unit-section
    |   ├── unit-flag
    |   ├── record
    |   └── record
    └── unit-section
        ├── unit-flag
        └── record
```

There are some principles applied in `buildContent`:

1. Every element node is a leaf node (without child), and every leaf node is an element node.
2. Every section node is a branch node (with at least one child), and every branch node is a section node or the root node.
3. Every heading element node(`group-flag`, `unit-flag`) will have a section parent, and the heading element will be the first child of that section node.
4. Nodes with the same depth should have the same type.
5. When appending element to the tree, `buildContent` will try to append the new branch node into the ancestors of previous element. If there's no accurate position in the ancestors of previous element, it will create a new one. For example, given `elements`:

   ```js
   const elements[
     { type: 'record' /* ... */ }, // there's no previous branch when appending this first record, so we will create a new branch for it
     { type: 'record' /* ... */ },
     { type: 'group-flag' /* ... */ },
     { type: 'unit-flag' /* ... */ },
     { type: 'record' /* ... */ },
   ]
   ```

   The tree structure of `buildContent(elements)` will be:

   ```
   # each line represents a node
   root
   ├── group-section
   │   └── unit-section
   │       ├── record
   │       └── record
   └── group-section
       ├── group-flag
       └── unit-section
           ├── unit-flag
           └── record
   ```

## How to develop this package

### Fetch data for dev

Use built-in scripts (save your google key file in `dev/sheets-api.json`):

```sh
make dev-fetch-data SHEET=[target spreadsheet id]
```

The data will be saved at `dev/data.json`

### Build code for dev

Should prepare `dev/data.json` first.

```sh
make dev-build-code
```

The code will be saved at `dev/output.txt`

### Test dev code

We use `webpack-dev-server` to render a mock article with all elements for development.

You should prepare `dev/data.json` first.

```sh
make dev-server
```

If you need to change the hostname (usually due to the CORS reasons), add `DEV_HOST=[your-custom-hostname]` for giving `webpack-dev-server` the hostname. Example:

```sh
# Start the webpack-dev-server with custom hostname
DEV_HOST=testtest.twreporter.org make dev-server
```
