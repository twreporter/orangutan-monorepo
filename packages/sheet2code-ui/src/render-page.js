import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles'
import * as buildConsts from './constants/build'
import App from './components/app.js'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import serialize from 'serialize-javascript'
import theme from './constants/theme'
import map from 'lodash/map'

const _ = {
  map,
}

const buildInlineScript = (appProps, rootId) => `
(function () {
  var rootId = '${rootId}';
  var appProps = ${serialize(appProps)};
  var target = document.getElementById(rootId);
  try {
    var renderAppTo = window['${buildConsts.namespace}']['${
  buildConsts.pkgName
}'].renderAppTo;
    renderAppTo(target, appProps);
  } catch (error) {
    console.error(error)
  }
})()`

/**
 *
 *
 * @export
 * @param {*} [appProps={}] - props which will be passed to the app component
 * @param {string} [rootId='root'] - root HTML element ID
 * @param {string[]} [bundles=[]] - the urls of bundles
 * @param {ReactElement|ReactElement[]|null} [headReactElements=null] - React elements that will be appended to the bottom inside the <head>
 * @param {ReactElement|ReactElement[]|null} [bodyReactElements=null] - React elements that will be appended to the bottom inside the <body>
 * @returns
 */
export default function renderPage(
  appProps = {},
  rootId = 'root',
  bundles = [],
  headReactElements = null,
  bodyReactElements = null
) {
  const sheets = new ServerStyleSheets() // must placed before rendering components
  const appHtml = ReactDOMServer.renderToString(
    sheets.collect(
      <ThemeProvider theme={theme}>
        <App {...appProps} />
      </ThemeProvider>
    )
  )
  const appCss = sheets.toString()
  return (
    '<!DOCTYPE html>' +
    ReactDOMServer.renderToStaticMarkup(
      <html lang="zh-Hant">
        <head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
          <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
          <style id="jss-server-side">${appCss}</style>
          {headReactElements}
        </head>
        <body
          style={{
            fontFamily: [
              'source-han-sans-traditional',
              'Noto Sans TC',
              'PingFang TC',
              'Apple LiGothic Medium',
              'Roboto',
              'Microsoft JhengHei',
              'Lucida Grande',
              'Lucida Sans Unicode',
              'sans-serif',
            ].join(','),
          }}
        >
          <div id={rootId} dangerouslySetInnerHTML={{ __html: appHtml }} />
          {_.map(bundles, (bundle, i) => (
            <script key={`${i}-bundle`} type="text/javascript" src={bundle} />
          ))}
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: buildInlineScript(appProps, rootId),
            }}
          />
          {bodyReactElements}
        </body>
      </html>
    )
  )
}
