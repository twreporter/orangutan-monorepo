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

const sheetMetadata = {
  content: {
    title: 'content',
    cellsRange: 'B:H',
    majorDimension: 'ROWS',
    keysIndex: 0,
    recordsIndexStart: 4,
  },
  theme: {
    title: 'theme',
    cellsRange: 'A2:C',
    majorDimension: 'COLUMNS',
    keysIndex: 0,
    recordsIndexStart: 2,
  },
  appProps: {
    title: 'app-props',
    cellsRange: 'A2:C',
    majorDimension: 'COLUMNS',
    keysIndex: 0,
    recordsIndexStart: 2,
  },
}

/**
 * @typedef {Object} JSONData
 * @property {Array} content
 * @property {Object} theme
 * @property {Object} appProps
 */

/**
 *
 * @param {Object} params
 * @param {string[]} params.keys
 * @param {any[][]} params.valuesOfRecords
 * @param {boolean} [params.addRecordIndex=false]
 * @param {Function} [params.parseValue]
 * @returns {Object[]}
 */
function tableToJSONRecords({
  keys,
  valuesOfRecords,
  addRecordIndex = false,
  parseValue,
}) {
  const data = []
  const shouldParseValue = typeof parseValue === 'function'
  valuesOfRecords.forEach((values, recordIndex) => {
    const record = addRecordIndex
      ? {
          index: recordIndex,
        }
      : {}
    values.forEach((value, valueIndex) => {
      const key = keys[valueIndex]
      if (value) {
        const _value = shouldParseValue ? parseValue(key, value) : value
        _.set(record, key, _value)
      }
    })
    data.push(record)
  })
  return data
}

export default class Sheets extends PSheets {
  /**
   *
   * @returns {Promise<JSONData>}
   * @memberof Sheets
   */
  async getJSONData() {
    // get and build content
    const contentData = await this._getValues({
      range: `'${sheetMetadata.content.title}'!${sheetMetadata.content.cellsRange}`,
      majorDimension: sheetMetadata.content.majorDimension,
    })
    const content = buildNestedData(
      tableToJSONRecords({
        keys: contentData[sheetMetadata.content.keysIndex],
        valuesOfRecords: contentData.slice(
          sheetMetadata.content.recordsIndexStart
        ),
        addRecordIndex: true,
      })
    )
    // get sheets
    const sheets = await this._getSheets()
    // get and build theme
    const doesCustomThemeExist =
      sheets.findIndex(
        sheet => _.get(sheet, 'properties.title') === sheetMetadata.theme.title
      ) >= 0
    const themeData = doesCustomThemeExist
      ? await this._getValues({
          range: `'${sheetMetadata.theme.title}'!${sheetMetadata.theme.cellsRange}`,
          majorDimension: sheetMetadata.theme.majorDimension,
        })
      : []
    const theme =
      Array.isArray(themeData) && themeData.length > 0
        ? tableToJSONRecords({
            keys: themeData[sheetMetadata.theme.keysIndex],
            valuesOfRecords: themeData.slice(
              sheetMetadata.theme.recordsIndexStart
            ),
          })[0]
        : {}
    // get and build appProps
    const doCustomAppPropsExist =
      sheets.findIndex(
        sheet =>
          _.get(sheet, 'properties.title') === sheetMetadata.appProps.title
      ) >= 0
    const appPropsData = doCustomAppPropsExist
      ? await this._getValues({
          range: `'${sheetMetadata.appProps.title}'!${sheetMetadata.appProps.cellsRange}`,
          majorDimension: sheetMetadata.appProps.majorDimension,
        })
      : []
    const appProps =
      Array.isArray(appPropsData) && appPropsData.length > 0
        ? tableToJSONRecords({
            keys: appPropsData[sheetMetadata.appProps.keysIndex],
            valuesOfRecords: appPropsData.slice(
              sheetMetadata.appProps.recordsIndexStart
            ),
            parseValue: (key, value) => {
              if (key === 'maxHeadingTagLevel') {
                return parseInt(value, 10)
              }
              return value
            },
          })[0]
        : {}
    return {
      content,
      theme,
      appProps,
    }
  }
}
