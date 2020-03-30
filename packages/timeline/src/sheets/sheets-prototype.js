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

export default class Sheets {
  /**
   * Creates an instance of Sheets.
   * @param {object} param
   * @param {*} param.auth a google OAuth2Client or an object with keyfile path
   * @param {string} param.spreadsheetId target spreadsheet id
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

  _getPropertiesOfSheets() {
    const request = {
      spreadsheetId: this.spreadsheetId,
    }
    return this.sheetsAPI.spreadsheets
      .get(request)
      .then(res => {
        const sheets = _.get(res, 'data.sheets') || []
        const titleOfSheets = []
        const gidOfSheets = []
        _.forEach(sheets, sheet => {
          const sheetId = _.get(sheet, 'properties.sheetId') || ''
          const title = _.get(sheet, 'properties.title', '')
          titleOfSheets.push(title)
          gidOfSheets.push(sheetId)
        })
        return {
          titleOfSheets,
          gidOfSheets,
        }
      })
      .catch(error => {
        return Promise.reject(
          errors.helpers.wrap(
            error,
            'GoogleAPIsError',
            'failed to get properties of sheets',
            {
              method: 'sheetsAPI.spreadsheets.get',
              params: request,
            }
          )
        )
      })
  }

  _getSpreadsheetData(customRequest = {}) {
    const request = {
      spreadsheetId: this.spreadsheetId,
      ...customRequest,
    }
    return this.sheetsAPI.spreadsheets.values
      .get(request)
      .then(res => {
        return _.get(res, 'data')
      })
      .catch(error => {
        return Promise.reject(
          errors.helpers.wrap(
            error,
            'GoogleAPIsError',
            'failed to get data from a spreadsheet',
            {
              method: 'sheetsAPI.spreadsheets.values.get',
              params: request,
            }
          )
        )
      })
  }
}
