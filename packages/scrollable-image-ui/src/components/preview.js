import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// material-ui
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

const useStyles = makeStyles({
  container: {
    marginTop: '22px',
  },
  slider: {
    width: '240px',
    margin: '15px auto',
    padding: '10px 14px 0 14px',
  },
  mockPage: {
    textAlign: 'center',
  },
  pDown: {
    marginTop: '20vh',
    marginBottom: '100vh',
  },
  pUp: {
    marginTop: '100vh',
    marginBottom: '20vh',
  },
  embedded: {
    background: '#f2f2f2',
    margin: '0 auto',
    width: props => `${props.embeddedWidth}%`,
  },
})

Preview.propTypes = {
  code: PropTypes.string,
}

Preview.defaultProps = {
  code: '',
}

export default function Preview(props) {
  const { code } = props
  if (!code) return null
  const embeddedEle = useRef(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [toShow, setToShow] = useState(false)
  const styles = useStyles({ embeddedWidth: 100 })
  /* 
    Rather than using `display: none` to just hide the embedded element,
    it will unmount and remount the embedded element each time the user toggle the preview.
    This is because @twreporter/scrollable-image will detect scroll position and element size when elements is mounting,
    If we just use `display: none`, it will cause sizing or positioning error without remounting.
   */
  useEffect(() => {
    if (embeddedEle.current && toShow) {
      try {
        /*
          Append the embedded code to DOM in this way to trigger the evaluating of <script> 
          Ref: https://grrr.tech/posts/create-dom-node-from-html-string/
        */
        const embedded = document.createRange().createContextualFragment(code)
        embeddedEle.current.innerHTML = ''
        embeddedEle.current.appendChild(embedded)
        setErrorMessage(null)
      } catch (error) {
        console.error(error)
        setErrorMessage(
          '載入預覽結果時發生錯誤，預覽結果僅支援 Firefox, Chrome, Edge 12+, IE 11+, Safari 9+ 瀏覽器'
        )
      }
    }
  }, [code, toShow])
  return (
    <div className={styles.container}>
      <div style={{ textAlign: 'center' }}>
        <FormControlLabel
          className={styles.switch}
          control={
            <Switch
              checked={toShow}
              onChange={(event, value) => {
                setToShow(value)
              }}
              name="toShow"
              color="primary"
            />
          }
          label="預覽"
        />
      </div>
      <Typography
        variant="body2"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        若要測試響應式版面，請手動改變瀏覽器視窗大小，或使用電腦瀏覽器的「開發者工具」模擬手機、平板上的顯示情況
      </Typography>
      {toShow ? (
        <div className={styles.mockPage}>
          <p className={styles.pDown}> ↓↓↓ scroll down to see the image ↓↓↓ </p>
          <div ref={embeddedEle} className={styles.embedded} />
          <p className={styles.pUp}> ↑↑↑ scroll up to see the image ↑↑↑ </p>
        </div>
      ) : null}
      {errorMessage ? (
        <div className={styles.embedded}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {errorMessage}
          </Alert>
        </div>
      ) : null}
    </div>
  )
}
