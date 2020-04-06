# scrollable-image-ui

## What is this

An interface used for generating scrollable image embedded code.

## How to use this

### Install

```sh
yarn add @twreporter/scrollable-image-ui
```

or you can use **npm**:

```sh
npm install --save @twreporter/scrollable-image-ui
```

### Example

1. Serve the distribution files by Google Cloud Function

```js
const express = require('express')
const path = require('path')

const app = express()

app.use(
  express.static(
    path.join(__dirname, 'node_modules/@twreporter/scrollable-image-ui/dist')
  )
)

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/index.html'))
})
```

## How to develop this

```bash
# Run development server
make dev
```

## How to build this

```bash
# Babel transpile es6 and above to es5 at lib/
# Build webpack bundle and index.html to dist/
make build
```
