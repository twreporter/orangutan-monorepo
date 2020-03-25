# sheet2code-ui

## What is this

A Web interface used for building components for [The Reporter Taiwan](https://www.twreporter.org).

Published as an [npm package](https://www.npmjs.com/package/@twreporter/scrollable-image).

## How to use this

### Install

```bash
yarn add @twreporter/sheet2code-ui
```

### 1. Use the React component

#### Example

```js
import React from 'react'
import ReactDOM from 'react-dom'
import BuildCodeUI from '../src'

ReactDOM.render(<BuildCodeUI.Component />, document.getElementById('root'))
```

#### Props

```js
App.propTypes = {
  codeLabel: PropTypes.string, // The label of form text field for result code
  codePathInAxiosResponse: PropTypes.string, // The path to the returned code string in axios response
  description: PropTypes.string, // The description of the form
  errorToClientMessage: PropTypes.func.isRequired, // The function that take axios response error and give client error message
  formValuesToRequestConfig: PropTypes.func.isRequired, // The function that takes form values and returns axios request config
  nOfSheetFields: PropTypes.oneOfType([
    PropTypes.oneOf(['dynamic']),
    PropTypes.number,
  ]), // Set how many sheet fields showed. 'dynamic' will showed at least one field for sheet.
  title: PropTypes.string.isRequired, // The title of the form
}

App.defaultProps = {
  codeLabel: 'Embedded Code',
  codePathInAxiosResponse: 'data.data.records.0.code',
  description: 'Compile your Google Spreadsheet into magical HTML Code',
  errorToClientMessage: error => error.message,
  formValuesToRequestConfig: () => ({ timeout: 500, method: 'get', url: '' }),
  nOfSheetFields: 'dynamic',
  title: 'Sheet2Code',
}
```

### 2. Use the `renderPage` helper

#### Example

Pseudo code:

```js
const sheet2CodeUI = require('@twreporter/sheet2code-ui')

export server = function (req, res) {
   if (/* route condition to client js bundle */) {
      // Serve the js bundle, and pass the public path to `scriptSrc` of `sheet2CodeUI.serverRender`.
      // Or you can pass an existed CDN to `scriptSrc`.
      res.status(200).send(/* js bundle in ./node_modules/@twreporter/sheet2code-ui/dist */)
   } else if (/* route condition to html */) {
      const appProps = { /* ... */ }
      const html = sheet2CodeUI.renderPage(appProps, rootId, scriptSrc)
      res.status(200).send(html)
   } else if (/* route condition to api */) {
      res.status(200).send(/* built embedded code  */)
   }
}
```

`appProps` are the React props pass to `sheet2CodeUI.Component`

## How to develop this

There are two dev modes:

1. We use `webpack-dev-server` to render a mock article with all elements for development.

   ```bash
   # Start the webpack-dev-server
   npm run dev-server
   ```

2. Or use `babel --watch` to compile the source file if there's any change happened

   ```bash
   make dev
   ```

## How to build this

```bash
# Build the distribution files
make build
```
