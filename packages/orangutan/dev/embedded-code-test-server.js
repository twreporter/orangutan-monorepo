/* eslint no-console: 0 */
import Express from 'express'
import dualChannel from '@twreporter/dual-channel'
import path from 'path'
// import scrollableImage from '@twreporter/scrollable-image'
import timeline from '@twreporter/timeline'
import webpackAssets from '../dist/webpack-assets.json'

const orangutan = {
  dualChannel,
  // scrollableImage,
  timeline,
}

const distFolder = path.resolve(__dirname, '../dist')
const app = new Express()

// serve webpack bundles and chunks
app.use('/dist', Express.static(distFolder))

app.get('/', (req, res) => {
  res.send(`
  <html>
    <body>
      <div>
        <a href="/dual-channel">dual-channel test link</a>
      </div>
      <div>
        <a href="/scrollable-image">scrollable-image test link</a>
      </div>
      <div>
        <a href="/timeline">timeline test link</a>
      </div>
    </body>
  </html>
  `)
})

app.get('/dual-channel', (req, res) => {
  try {
    const testData = orangutan.dualChannel.getTestData()
    const dualChannelWebpackAssets = webpackAssets['dual-channel']
    const code = orangutan.dualChannel.buildEmbeddedCode(
      testData,
      dualChannelWebpackAssets
    )
    res.send(`
      <html>
        <body>
          ${code}
        </body>
      </html>
    `)
  } catch (err) {
    res.send(err.toString())
  }
})

app.get('/timeline', (req, res) => {
  try {
    const testData = orangutan.timeline.getTestData()
    const code = orangutan.timeline.buildEmbeddedCode(testData)
    res.send(`
      <html>
        <body>
          ${code}
        </body>
      </html>
    `)
  } catch (err) {
    res.send(err.toString())
  }
})

app.listen(8080, () => {
  console.log('You can test generated embedded code on localhost:8080')
})
