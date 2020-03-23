# sheet2code-ui

## What is this

A Web interface used for building components for [The Reporter Taiwan](https://www.twreporter.org).

Published as an [npm package](https://www.npmjs.com/package/@twreporter/scrollable-image).

## How to use this

```bash
yarn add @twreporter/sheet2code-ui
```

### Example

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

### Properties of `appProps`

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
  sheetIdToRequestConfig: sheetId => ({
    timeout: 500,
    method: 'get',
    url: `http://xxxxx/api?sheet=${sheetId}`,
  }),
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
