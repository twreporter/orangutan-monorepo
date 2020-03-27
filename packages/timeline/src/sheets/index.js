import { ActionError } from '../error'
import { buildNestedData } from './build-nested-data'
import PSheets from './sheets-prototype'
// lodash
import forEach from 'lodash/forEach'
import get from 'lodash/get'
import set from 'lodash/set'

const _ = {
  forEach,
  get,
  set,
}

const defaultDataCells = 'A3:G'

export default class Sheets extends PSheets {
  /**
   *
   * @param {string} [titleOfSheet=''] - The title of the sheet you want to fetch (not the title of spreadsheets). A spreadsheet may contains multiple sheets)
   * @param {string} [cellsRange=defaultDataCells] - The cells range that contains the data
   *                                                 (Including the keys and records. The first row is the keys
   *                                                 and the second row and below are the records).
   *                                                 The range is written in A1 notation
   *                                                 (Ref: https://developers.google.com/sheets/api/guides/concepts#a1_notation).
   * @returns {Promise<[]>}
   * @memberof Sheets
   */
  async getJSONData(titleOfSheet, cellsRange = defaultDataCells) {
    let _titleOfSheet = titleOfSheet
    if (!_titleOfSheet) {
      const { titleOfSheets } = await this._getPropertiesOfSheets()
      _titleOfSheet = titleOfSheets[0]
    }
    const request = {
      range: `'${_titleOfSheet}'!${cellsRange}`,
      majorDimension: 'ROWS',
    }
    const { values } = await this._getSpreadsheetData(request)
    if (!Array.isArray(values) || !values) {
      throw new ActionError(
        'failed to get JSON data: values from spreadsheet must be an array',
        {
          request,
          values,
        }
      )
    }
    const headerRow = values[0] // first row are the keys
    const dataRows = values.slice(1) // second row and below are the records. a row represents a data record
    const data = []
    _.forEach(dataRows, (values, rowIndex) => {
      const record = {
        index: rowIndex,
      }
      _.forEach(values, (value, i) => {
        const key = headerRow[i]
        if (value) {
          _.set(record, key, value)
        }
      })
      data.push(record)
    })
    return buildNestedData(data)
  }
}
