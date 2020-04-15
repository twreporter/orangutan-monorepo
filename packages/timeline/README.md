# timeline

## What is this

A React component used in articles at [The Reporter Taiwan](https://www.twreporter.org).

Published as an [npm package](https://www.npmjs.com/package/@twreporter/timeline).

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

### Fetch data

Example:

```js
const timelineUtils = require('@twreporter/timeline')
const path = require('path')
const fs = require('fs')

sheetsAuth
  .getClient()
  .then(auth => {
    return new timelineUtils.Sheets({
      spreadsheetId: 'your target spreadsheet id',
      auth,
    }).getJSONData()
  })
  .then(data => {
    const { content, theme, appProps } = data
    /* handle the data here */
  })
```

### Build embedded code

```js
const timelineUtils = require('@twreporter/timeline')

/* get data and emphasizedLevel*/
const embedded = timelineUtils.buildEmbeddedCode(content, theme, appProps)
```

### Timeline Component

#### Props

- `data`
- `maxHeadingTagLevel`: If it's set to `3`, the heading element will start with html tag `h3`
- `emphasizedLevel`: `unit` or `group`. It will apply blocks with white background to the content of that section level (Not include the heading element).

```js
const Timeline = require('@twreporter/timeline').Component
const ReactDOMServer = require('react-dom/server')
const React = require('react')

const html = ReactDOMServer.renderToStaticMarkup(
  <Timeline
    data={data}
    emphasizedLevel={emphasizedLevel}
    maxHeadingTagLevel={maxHeadingTagLevel}
  />
)
```

#### Data Format

An section is a tuple as `[headingElement, [...subsectionsOrElements]]`. The data is an array of sections.

See the [example spreadsheet](https://docs.google.com/spreadsheets/d/1f76OLdfZe3kyNOKiPthWNJWVGmY3bkm5KtxB4NYp9uU/edit#gid=0)

```js
// an array of sections
;[
  // a group section
  [
    groupFlagElement1,
    [
      // a unit section
      [unitFlagElement2, [recordElement3, recordElement4]][
        // a unit section
        (unitFlagElement5, [recordElement6, recordElement7, recordElement8])
      ],
    ],
  ],
  // a group section
  [
    groupFlagElement9,
    [
      // a unit section
      [unitFlagElement10, [recordElement11, recordElement12]][
        // a unit section
        (unitFlagElement13, [recordElement14, recordElement15, recordElement16])
      ],
    ],
  ],
]
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
