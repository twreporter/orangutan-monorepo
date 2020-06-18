import { google } from 'googleapis'
import errors from '@twreporter/errors'
// lodash
import forEach from 'lodash/forEach'
import get from 'lodash/get'
import map from 'lodash/map'

const _ = {
  forEach,
  get,
  map,
}

/**
 * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get
 * @typedef {Object} GetValuesRequest
 * @property {string} spreadsheetId - The ID of the spreadsheet to retrieve data from
 * @property {string} range - The A1 notation of the values to retrieve.
 *                            A1 notation: https://developers.google.com/sheets/api/guides/concepts#a1_notation
 * @property {string} majorDimension - The major dimension that results should use.
 *                                     For example, if the spreadsheet data is: A1=1,B1=2,A2=3,B2=4,
 *                                     then requesting range=A1:B2,majorDimension=ROWS returns [[1,2],[3,4]],
 *                                     whereas requesting range=A1:B2,majorDimension=COLUMNS returns [[1,3],[2,4]].
 *                                     Ref: https://developers.google.com/sheets/api/reference/rest/v4/Dimension
 */

export default class Sheets {
  /**
   * Creates an instance of Sheets.
   * @param {object} params
   * @param {*} params.auth a google OAuth2Clientm, or an object with keyfile path and scope
   * @param {string} params.spreadsheetId target spreadsheet id
   * @memberof Sheets
   */
  constructor({ auth, spreadsheetId }) {
    this.sheetsAPI = auth
      ? google.sheets({
          version: 'v4',
          auth,
        })
      : google.sheets({
          version: 'v4',
        })
    this.spreadsheetId = spreadsheetId
  }

  /**
   *
   *
   * @returns {Promise<Array>}
   * @memberof Sheets
   */
  _getSheets() {
    const params = {
      spreadsheetId: this.spreadsheetId,
    }
    return this.sheetsAPI.spreadsheets
      .get(params)
      .then(res => {
        const sheets = _.get(res, 'data.sheets') || []
        if (!sheets || !sheets.length) {
          throw new Error('no sheets data in the response')
        }
        return sheets
      })
      .catch(error => {
        return Promise.reject(
          errors.helpers.wrap(
            error,
            'GoogleAPIsError',
            'failed to get sheets',
            {
              method: 'spreadsheets.get',
              params,
            }
          )
        )
      })
  }

  /**
   *
   *
   * @param {GetValuesRequest} [customRequest={}]
   * @returns {Promise<Array>}
   * @memberof Sheets
   */
  _getValues(customParams = {}) {
    const params = {
      spreadsheetId: this.spreadsheetId,
      ...customParams,
    }
    return this.sheetsAPI.spreadsheets.values
      .get(params)
      .then(res => {
        const values = _.get(res, 'data.values') || []
        return values
      })
      .catch(error => {
        return Promise.reject(
          errors.helpers.wrap(
            error,
            'GoogleAPIsError',
            'failed to get data from a spreadsheet',
            {
              method: 'spreadsheets.values.get',
              params,
            }
          )
        )
      })
  }
}
