# sheet2code-ui

## What is this

A Web interface used for building components for [The Reporter Taiwan](https://www.twreporter.org).

Published as an [npm package](https://www.npmjs.com/package/@twreporter/scrollable-image).

## How to use this

```bash
yarn add @twreporter/sheet2code-ui
```

### Example

```jsx
import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import sheet2CodeUI from '@twreporter/sheet2code-ui'

function axiosErrorsToClientErrorMessage(axiosError) {
   let message = '' /* handle axios error */
   if (axiosError.response) {
      /* handle response error */
   } else if (axiosError.request) {
      /* handle request but no response error */
   }
   return message
}

ReactDOM.render((
   <sheet2CodeUI.Component
      codeLabel="Embedded "Code"
      errorToClientMessage={axiosErrorsToClientErrorMessage},
      inputLabel="Spreadsheet ID"
      sheetIdToRequestConfig={(sheetId) => ({ timeout: 15000, method: 'get', url: `http://xxx?sheet=${sheetId}` })}
      title="Example Inforgraph Code Builder"
   />
))
```

### Props of `sheet2CodeUI.Component`

```js
App.propTypes = {
  // The label of form text field for result code
  codeLabel: PropTypes.string,
  // The function that take axios response error and give client error message
  errorToClientMessage: PropTypes.func.isRequired,
  // The label of form text field for input sheet
  inputLabel: PropTypes.string,
  // The path to the returned code string in axios response
  responseCodePath: PropTypes.string,
  // The function that take sheet id and give axios request config
  sheetIdToRequestConfig: PropTypes.func.isRequired,
  // The title of the form
  title: PropTypes.string.isRequired,
}

App.defaultProps = {
  codeLabel: 'Embedded Code',
  errorToClientMessage: error => error.message,
  inputLabel: 'Spreadsheet ID',
  responseCodePath: 'data.data.records.0.code',
  sheetIdToRequestConfig: () => ({ timeout: 500, method: 'get', url: '' }),
  title: 'Sheet To Code',
}
```

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
