# sheet2code-ui

![npm (latest)](https://img.shields.io/npm/v/@twreporter/sheet2code-ui/latest)
![npm (rc)](https://img.shields.io/npm/v/@twreporter/sheet2code-ui/rc)

## What is this

A Web interface used for building components for [The Reporter Taiwan](https://www.twreporter.org).

Published as an [npm package](https://www.npmjs.com/package/@twreporter/sheet2code-ui).

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
/**
 *
 *
 * @export
 * @param {Object} props
 * @param {string} props.codeLabel -The label of form text field for result code
 * @param {string} props.codePathInAxiosResponse - The path to the returned code string in axios response
 * @param {string[]} props.description - The description of the form
 * @param {Function} props.errorToClientMessage - The function that take axios response error and give client error message
 * @param {Function} props.formValuesToRequestConfig - The function that takes form values and returns axios request config
 * @param {Function} props.getCodeFromAxiosResponse - The function that retrieves code string from axios response
 * @param {number|'dynamic'} props.nOfSheetFields - Set how many sheet fields showed. 'dynamic' will showed at least one field for sheet.
 * @param {boolean} props.previewAllowCustomWidth - Should UI contain a customizer of preview width
 * @param {boolean} props.previewAllowToggleDisplay - Should UI contain a toggle of preview display
 * @param {boolean} props.previewDefaultDisplay - Default value of displaying preview or not
 * @param {number} props.previewDefaultWidth - The default width of the preview (percentage related to preview container)
 * @param {string} props.previewOverflow - The CSS overflow property of preview. Should be one of 'hidden', 'visible', or 'scroll'
 * @param {string} props.title - The title of the form
 * @returns
 */

App.propTypes = {
  codeLabel: PropTypes.string,
  codePathInAxiosResponse: PropTypes.string,
  description: PropTypes.arrayOf(PropTypes.string),
  errorToClientMessage: PropTypes.func.isRequired,
  formValuesToRequestConfig: PropTypes.func.isRequired,
  getCodeFromAxiosResponse: PropTypes.func,
  nOfSheetFields: PropTypes.oneOfType([
    PropTypes.oneOf(['dynamic']),
    PropTypes.number,
  ]),
  previewAllowCustomWidth: PropTypes.bool,
  previewAllowToggleDisplay: PropTypes.bool,
  previewDefaultDisplay: PropTypes.bool,
  previewDefaultWidth: PropTypes.number,
  previewOverflow: PropTypes.oneOf(['hidden', 'visible', 'scroll']),
  title: PropTypes.string.isRequired,
}

App.defaultProps = {
  codeLabel: 'Embedded Code',
  codePathInAxiosResponse: 'data.data.records.0.code',
  description: ['Compile your Google Spreadsheet into magical HTML Code'],
  errorToClientMessage: error => error.message,
  formValuesToRequestConfig: () => {
    throw Error(
      'The prop `formValuesToRequestConfig` passed to @twreporter/sheet2code-ui should be a function. But is undefined.'
    )
  },
  nOfSheetFields: 'dynamic',
  previewAllowCustomWidth: false,
  previewAllowToggleDisplay: true,
  previewDefaultDisplay: false,
  previewDefaultWidth: 100,
  previewOverflow: 'hidden',
  title: 'Sheet2Code',
}
```

### 2. Use `renderPage` helper to build the HTML string

Example:

```js
const sheet2CodeUI = require('@twreporter/sheet2code-ui')

export server = function (req, res) {
   if (/* route condition to client js bundle */) {
      // Serve the js bundle, and pass the public path to `scriptSrc` of `sheet2CodeUI.serverRender`.
      // Or you can pass an existed CDN to `scriptSrc`.
      res.status(200).send(/* js bundles in ./node_modules/@twreporter/sheet2code-ui/dist */)
   } else if (/* route condition to html */) {
      const appProps = { /* ... */ }
      const bundles = require('@twreporter/sheet2code-ui/dist/webpack-assets.json').bundles
      const rootId = 'root'
      const html = sheet2CodeUI.renderPage(appProps, rootId, bundles)
      res.status(200).send(html)
   } else if (/* route condition to api */) {
      res.status(200).send(/* built embedded code  */)
   }
}
```

parameters of `renderPage()`:

```js
/**
 * @param {*} [appProps={}] - props which will be passed to the app component
 * @param {string} [rootId='root'] - root HTML element ID
 * @param {string[]} [bundles=[]] - the urls of bundles
 * @param {ReactElement|ReactElement[]|null} [headReactElements=null] - React elements that will be appended to the bottom inside the <head>
 * @param {ReactElement|ReactElement[]|null} [bodyReactElements=null] - React elements that will be appended to the bottom inside the <body>
 */
```

## How to develop this

There are two dev modes:

1. We use `webpack-dev-server` to render a mock article with all elements for development.

   ```bash
   # Start the webpack-dev-server
   make dev
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
