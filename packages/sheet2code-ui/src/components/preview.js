import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// material-ui
import { makeStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

const useStyles = makeStyles({
  container: {
    marginTop: '22px',
    overflow: props => props.overflow,
  },
  slider: {
    width: '240px',
    margin: '15px auto',
    padding: '10px 14px 0 14px',
    display: props => (props.display ? 'block' : 'none'),
  },
  embedded: {
    background: '#f2f2f2',
    margin: '0 auto',
    width: props => `${props.embeddedWidth}%`,
    display: props => (props.display ? 'block' : 'none'),
  },
})

Preview.propTypes = {
  allowCustomWidth: PropTypes.bool,
  allowToggleDisplay: PropTypes.bool,
  code: PropTypes.string,
  defaultDisplay: PropTypes.bool,
  defaultWidth: PropTypes.number,
  overflow: PropTypes.oneOf(['hidden', 'visible', 'scroll']),
}

Preview.defaultProps = {
  allowCustomWidth: false,
  allowToggleDisplay: true,
  code: '',
  defaultDisplay: false,
  defaultWidth: 100,
  overflow: 'hidden',
}

export default function Preview(props) {
  const {
    code,
    defaultWidth,
    allowCustomWidth,
    overflow,
    allowToggleDisplay,
    defaultDisplay,
  } = props
  const [embeddedWidth, setEmbeddedWidth] = useState(defaultWidth)
  const embeddedEle = useRef(null)
  const [errorMessage, setErrorMessage] = useState('null')
  const [display, setDisplay] = useState(defaultDisplay)
  const styles = useStyles({
    embeddedWidth,
    display: allowToggleDisplay ? display : true,
    overflow,
  })
  useEffect(() => {
    /*
      Append the embedded code to DOM in this way to trigger the evaluating of <script> 
      Ref: https://grrr.tech/posts/create-dom-node-from-html-string/
    */
    try {
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
  }, [code])
  const widthCustomizingElement = allowCustomWidth ? (
    <Paper className={styles.slider} elevation={0} variant="outlined">
      <Typography variant="body2" align="center" color="textSecondary">
        調整元件相對於瀏覽器寬度
      </Typography>
      <Slider
        defaultValue={80}
        onChangeCommitted={(event, value) => {
          setEmbeddedWidth(value)
        }}
        valueLabelFormat={value => `${value}%`}
        valueLabelDisplay="auto"
        min={50}
        max={100}
      />
    </Paper>
  ) : null
  return (
    <div className={styles.container}>
      <div style={{ textAlign: 'center' }}>
        {allowToggleDisplay ? (
          <FormControlLabel
            className={styles.switch}
            control={
              <Switch
                checked={display}
                onChange={(event, value) => {
                  setDisplay(value)
                }}
                name="display"
                color="primary"
              />
            }
            label="預覽"
          />
        ) : (
          <Typography variant="h4" align="center">
            預覽
          </Typography>
        )}
      </div>
      <Typography
        variant="body2"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        若要測試響應式版面，請手動改變瀏覽器視窗大小，或使用電腦瀏覽器的「開發者工具」模擬手機、平板上的顯示情況
      </Typography>
      {widthCustomizingElement}
      <div ref={embeddedEle} className={styles.embedded} />
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
