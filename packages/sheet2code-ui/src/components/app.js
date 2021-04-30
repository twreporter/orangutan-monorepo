import axios from 'axios'
import Form from './form'
import Preview from './preview'
import PropTypes from 'prop-types'
import React, { useReducer } from 'react'
import Result from './result'
// lodash
import assign from 'lodash/assign'
import get from 'lodash/get'
import map from 'lodash/map'
// @material-ui
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const _ = {
  assign,
  get,
  map,
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
 *
 *
 * @export
 * @param {Object} props
 * @param {string} props.codeLabel -The label of form text field for result code
 * @param {string} props.codePathInAxiosResponse - The path to the returned code string in axios response
 * @param {string[]} props.description - The description of the form
 * @param {Function} props.errorToClientMessage - The function that take axios response error and give client error message
 * @param {Function} props.formValuesToRequestConfig - The function that takes form values and returns axios request config
 * @param {Function} props.getCodeFromAxiosResponse - The function that retrieves code string from axios response
 * @param {number|'dynamic'} props.nOfSheetFields - Set how many sheet fields showed. 'dynamic' will showed at least one field for sheet.
 * @param {boolean} props.previewAllowCustomWidth - Should UI contain a customizer of preview width
 * @param {boolean} props.previewAllowToggleDisplay - Should UI contain a toggle of preview display
 * @param {boolean} props.previewDefaultDisplay - Default value of displaying preview or not
 * @param {number} props.previewDefaultWidth - The default width of the preview (percentage related to preview container)
 * @param {string} props.previewOverflow - The CSS overflow property of preview. Should be one of 'hidden', 'visible', or 'scroll'
 * @param {string} props.title - The title of the form
 * @returns
 */
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
    getCodeFromAxiosResponse,
    nOfSheetFields,
    title,
    previewAllowCustomWidth,
    previewAllowToggleDisplay,
    previewDefaultDisplay,
    previewDefaultWidth,
    previewOverflow,
  } = props

  const buildCode = formValues => {
    dispatchCodeAction({
      type: actionTypes.request,
    })
    let axiosOptions
    try {
      axiosOptions = formValuesToRequestConfig(formValues)
    } catch (error) {
      dispatchCodeAction({
        type: actionTypes.fail,
        errorMessage: errorToClientMessage(
          new Error(
            'Failed to build request config from form values: ' + error.message
          )
        ),
      })
      return
    }
    return axios(axiosOptions)
      .then(axiosRes => {
        const code =
          typeof getCodeFromAxiosResponse === 'function'
            ? getCodeFromAxiosResponse(axiosRes)
            : _.get(axiosRes, codePathInAxiosResponse)
        if (code) {
          dispatchCodeAction({
            type: actionTypes.success,
            code,
          })
        } else {
          dispatchCodeAction({
            type: actionTypes.fail,
            errorMessage: errorToClientMessage(
              new Error('response with empty content')
            ),
          })
        }
      })
      .catch(error => {
        const errorMessage = errorToClientMessage(error)
        dispatchCodeAction({
          type: actionTypes.fail,
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
          <Typography variant="body1" component="div" gutterBottom>
            {_.map(description, (p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
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
      {codeState.code ? (
        <Preview
          allowCustomWidth={previewAllowCustomWidth}
          code={codeState.code}
          defaultWidth={previewDefaultWidth}
          overflow={previewOverflow}
          allowToggleDisplay={previewAllowToggleDisplay}
          defaultDisplay={previewDefaultDisplay}
        />
      ) : null}
    </React.Fragment>
  )
}

App.propTypes = {
  codeLabel: PropTypes.string,
  codePathInAxiosResponse: PropTypes.string,
  description: PropTypes.arrayOf(PropTypes.string),
  errorToClientMessage: PropTypes.func.isRequired,
  formValuesToRequestConfig: PropTypes.func.isRequired,
  getCodeFromAxiosResponse: PropTypes.func,
  nOfSheetFields: PropTypes.oneOfType([
    PropTypes.oneOf(['dynamic']),
    PropTypes.number,
  ]),
  previewAllowCustomWidth: PropTypes.bool,
  previewAllowToggleDisplay: PropTypes.bool,
  previewDefaultDisplay: PropTypes.bool,
  previewDefaultWidth: PropTypes.number,
  previewOverflow: PropTypes.oneOf(['hidden', 'visible', 'scroll']),
  title: PropTypes.string.isRequired,
}

App.defaultProps = {
  codeLabel: 'Embedded Code',
  codePathInAxiosResponse: 'data.data.records.0.code',
  description: ['Compile your Google Spreadsheet into magical HTML Code'],
  errorToClientMessage: error => error.message,
  formValuesToRequestConfig: () => {
    throw Error(
      'The prop `formValuesToRequestConfig` passed to @twreporter/sheet2code-ui should be a function. But is undefined.'
    )
  },
  nOfSheetFields: 'dynamic',
  previewAllowCustomWidth: false,
  previewAllowToggleDisplay: true,
  previewDefaultDisplay: false,
  previewDefaultWidth: 100,
  previewOverflow: 'hidden',
  title: 'Sheet2Code',
}
