import axios from 'axios'
import Form from './form'
import PropTypes from 'prop-types'
import React, { useReducer } from 'react'
import Result from './result'
// lodash
import assign from 'lodash/assign'
import get from 'lodash/get'
// @material-ui
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
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

export default function App(props) {
  const [codeState, dispatchCodeAction] = useReducer(
    codeReducer,
    initialCodeState
  )
  const {
    codeLabel,
    codePathInAxiosResponse,
    description,
    errorToClientMessage,
    formValuesToRequestConfig,
    nOfSheetFields,
    title,
  } = props

  const buildCode = formValues => {
    dispatchCodeAction({
      type: actionTypes.request,
    })
    return axios(formValuesToRequestConfig(formValues))
      .then(axiosRes => {
        const code = _.get(axiosRes, codePathInAxiosResponse)
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
          <Typography variant="body1" gutterBottom>
            {description}
          </Typography>
          <Divider style={{ margin: '20px 0' }} variant="middle" />
          <Form
            nOfSheetFields={nOfSheetFields}
            isSubmitting={codeState.isBuilding}
            handleSubmit={buildCode}
          />
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
  codeLabel: PropTypes.string, // The label of form text field for result code
  codePathInAxiosResponse: PropTypes.string, // The path to the returned code string in axios response
  description: PropTypes.string, // The description of the form
  errorToClientMessage: PropTypes.func.isRequired, // The function that take axios response error and give client error message
  formValuesToRequestConfig: PropTypes.func.isRequired, // The function that takes form values and returns axios request config
  nOfSheetFields: PropTypes.oneOfType([
    PropTypes.oneOf(['dynamic']),
    PropTypes.number,
  ]), // Set how many sheet fields showed. 'dynamic' will showed at least one field for sheet.
  title: PropTypes.string.isRequired, // The title of the form
}

App.defaultProps = {
  codeLabel: 'Embedded Code',
  codePathInAxiosResponse: 'data.data.records.0.code',
  description: 'Compile your Google Spreadsheet into magical HTML Code',
  errorToClientMessage: error => error.message,
  formValuesToRequestConfig: () => ({ timeout: 500, method: 'get', url: '' }),
  nOfSheetFields: 'dynamic',
  title: 'Sheet2Code',
}
