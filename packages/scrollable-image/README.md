# scrollable-image

## What is this

A React component built by [The Reporter Taiwan](https://www.twreporter.org).

Published as an [npm package](https://www.npmjs.com/package/@twreporter/scrollable-image).

## How to use this package

### Install

```sh
yarn add @twreporter/scrollable-image
```

or you can use **npm**:

```sh
npm install --save @twreporter/scrollable-image
```

### Usage

#### Scrollable Image Component

import `scrollableImage` under the component you want to have a horizontally scrollable image.

```jsx
import scrollableImage from '@twreporter/scrollable-image'

export default class YourComponent extends React.Component {

  // Provide image links
  const testingImageSrcs = ['https://test-image-1.jpg', 'https://test-image-2.jpg']

  // Use it with other components
  const someWhereInYourComponent = (
    <div>
      <OtherComponent />
      <scrollableImage.Component imgSrc={testingImageSrcs} />
      <OtherComponent />
    </div>
  )

  // Or just use it standalone
  const standalone = (
    <scrollableImage.Component imgSrc={testingImageSrcs} />
  )

  render() {
    return (
      <div>{someWhereInPage}</div>
    )
  }
}
```

##### Props

| props    | type    | default | description                                                                                                                     |
| -------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| data     | Array   |         | Array of string which is image link and will be the `src` of `<img>`.                                                           |
| lazyload | Boolean | false   | Whether to enable lazyload to load `scrollableImage` component only when its top edge is within 300 viewport height to viewport |

#### Build Embedded Code

In rare cases, you want to build embedded code and make it embed in `<body>` element of a HTML document.

```jsx
import scrollableImage from '@twreporter/scrollable-image'
import scrollableImageAssets from '@twreporter/scrollable-image/dist/webpack-assets.json'

// Provide image links
const testingImageSrcs = [
  'https://test-image-1.jpg',
  'https://test-image-2.jpg',
]

const embeddedCode = scrollableImage.buildEmbeddedCode(
  {
    data: testingImageSrcs,
  },
  scrollableImageAssets
)
```

## How to develop this package

1. We use `webpack-dev-server` to render a mock data for development.

   ```sh
   # Start the webpack-dev-server
   make dev-server
   ```

2. Or use `babel --watch` to complie the source file if there's any change happened

   ```sh
   make dev
   ```

3. If you need to update the embedded code, there is an embedded code testing server serves a html document with injected embedded code

```sh
# Build testing embedded code and start express server to test it
make test-embedded-code
```

## How to publish this package

```sh
# Babel transpile es6 and above to es5 at lib/
# Build webpack bundles, chunks and webpack-assets.json to dist/
# Files in lib/ and dist/ folders will be published to npm

make build
```

```sh
yarn publish
# OR
npm publish
```
