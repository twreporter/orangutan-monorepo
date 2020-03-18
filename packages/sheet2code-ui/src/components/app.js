import axios from 'axios'
import PropTypes from 'prop-types'
import React, { useReducer, useState } from 'react'
import Result from './result'
// lodash
import assign from 'lodash/assign'
import get from 'lodash/get'
// @material-ui
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

const _ = {
  assign,
  get,
}

const actionTypes = {
  request: 'request',
  success: 'success',
  fail: 'fail',
}

const initialCodeState = {
  isBuilding: false,
  code: '',
  errorMessage: null,
}

function codeReducer(state, action) {
  switch (action.type) {
    case actionTypes.request: {
      return _.assign({}, initialCodeState, { isBuilding: true })
    }
    case actionTypes.success: {
      return _.assign({}, initialCodeState, { code: action.code })
    }
    case actionTypes.fail: {
      return _.assign({}, initialCodeState, {
        errorMessage: action.errorMessage,
      })
    }
    default: {
      return state
    }
  }
}

/**
 * Parse sheet id from url. Example:
 * 'https://docs.google.com/spreadsheets/d/1J7In4byYKOg9LdwWV7cEcsWmhrP91cbcc6Tx7ur-ozY/edit#gid=0'
 * -> '1J7In4byYKOg9LdwWV7cEcsWmhrP91cbcc6Tx7ur-ozY'
 * If the input string does not match the pattern, it will return the original string.
 *
 * @param {string} [input='']
 * @returns {string}
 */
function getSpreadsheetIdFromInput(input = '') {
  const match = input.match(/^https?:\/\/\S+\/spreadsheets\/d\/([^/]+)/)
  const sheetIdInUrl = _.get(match, '1')
  return sheetIdInUrl || input
}

export default function App(props) {
  const [codeState, dispatchCodeAction] = useReducer(
    codeReducer,
    initialCodeState
  )
  const [input, setInput] = useState('')
  const {
    codeLabel,
    errorToClientMessage,
    inputLabel,
    responseCodePath,
    sheetIdToRequestConfig,
    title,
  } = props

  const buildCode = () => {
    const spreadsheetId = getSpreadsheetIdFromInput(input)
    dispatchCodeAction({
      type: actionTypes.request,
    })
    return axios(sheetIdToRequestConfig(spreadsheetId))
      .then(axiosRes => {
        const code = _.get(axiosRes, responseCodePath)
        if (code) {
          dispatchCodeAction({
            type: actionTypes.success,
            code,
          })
        } else {
          dispatchCodeAction({
            type: actionTypes.fail,
            errorMessage: 'response with empty content',
          })
        }
      })
      .catch(error => {
        const errorMessage = errorToClientMessage(error)
        dispatchCodeAction({
          type: actionTypes.request,
          errorMessage,
        })
      })
  }
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <Paper style={{ padding: '50px', marginTop: '50px' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {title}
          </Typography>
          <TextField
            label={inputLabel}
            variant="outlined"
            fullWidth
            autoFocus
            onChange={e => setInput(e.target.value)}
          />
          {codeState.isBuilding ? <LinearProgress color="secondary" /> : null}
          <div style={{ marginTop: '10px', textAlign: 'right' }}>
            <Button
              variant="contained"
              disabled={codeState.isBuilding}
              color="primary"
              size="large"
              onClick={buildCode}
            >
              Build
            </Button>
          </div>
          <Result
            codeLabel={codeLabel}
            errorMessage={codeState.errorMessage}
            code={codeState.code}
          />
        </Paper>
      </Container>
    </React.Fragment>
  )
}

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
