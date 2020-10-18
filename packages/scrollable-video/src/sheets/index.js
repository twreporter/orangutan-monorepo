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
  videoSources: {
    title: 'video.sources',
    cellsRange: 'A:D',
    majorDimension: 'ROWS',
    keysIndex: 0,
    recordsIndexStart: 2,
  },
  captions: {
    title: 'captions',
    cellsRange: 'A:I',
    majorDimension: 'ROWS',
    keysIndex: 0,
    recordsIndexStart: 2,
  },
  theme: {
    title: 'theme',
    cellsRange: 'A:C',
    majorDimension: 'COLUMNS',
    keysIndex: 0,
    recordsIndexStart: 2,
  },
  appProps: {
    title: 'appProps',
    cellsRange: 'A:C',
    majorDimension: 'COLUMNS',
    keysIndex: 0,
    recordsIndexStart: 2,
  },
}

/**
 * @typedef {Object} JSONData
 * @property {Object} video
 * @property {Object[]} video.sources
 * @property {Object} theme
 * @property {Object} appProps
 */

/**
 * Example: 
    params = {
      keys: ['name', 'age'],
      valuesOfRecords: [ ['Helen', '23']],['Tom', '12'] ],
      addRecordIndex: true,
      parseValues: (key, value) => (key === 'age' ? parseInt(value, 10) : value)
    }
    tableToJSONRecords(params) will be = [
      { name: 'Helen', age: 23 },
      { name: 'Tom', age: 12 }
    ]
 * @param {Object} params
 * @param {string[]} params.keys - path of the property
 * @param {any[][]} params.valuesOfRecords 
 * @param {boolean} [params.addRecordIndex=false]
 * @param {Function} [params.parseValues] - (key, value) => parsedResult
 * @returns {Object[]}
 */
function tableToJSONRecords({
  keys,
  valuesOfRecords,
  addRecordIndex = false,
  parseValues,
}) {
  const data = []
  const shouldParseValues = typeof parseValues === 'function'
  valuesOfRecords.forEach((values, recordIndex) => {
    const record = addRecordIndex
      ? {
          index: recordIndex,
        }
      : {}
    values.forEach((value, valueIndex) => {
      const key = keys[valueIndex]
      if (value) {
        const _value = shouldParseValues ? parseValues(key, value) : value
        _.set(record, key, _value)
      }
    })
    data.push(record)
  })
  return data
}

export default class Sheets extends PSheets {
  // static validate = validate
  // static validateSync = validateSync
  /**
   *
   * @returns {Promise<JSONData>}
   * @memberof Sheets
   */
  async getJSONData() {
    // get and build video
    const videoSourcesData = await this._getValues({
      range: `'${sheetMetadata.videoSources.title}'!${sheetMetadata.videoSources.cellsRange}`,
      majorDimension: sheetMetadata.videoSources.majorDimension,
    })
    const videoSources = tableToJSONRecords({
      keys: videoSourcesData[sheetMetadata.videoSources.keysIndex],
      valuesOfRecords: videoSourcesData.slice(
        sheetMetadata.videoSources.recordsIndexStart
      ),
      parseValues: (key, value) => {
        if (key === 'width' || key === 'height') {
          return parseInt(value, 10)
        }
        return value
      },
    })
    // get captions
    const captionsData = await this._getValues({
      range: `'${sheetMetadata.captions.title}'!${sheetMetadata.captions.cellsRange}`,
      majorDimension: sheetMetadata.captions.majorDimension,
    })
    const captions = tableToJSONRecords({
      keys: captionsData[sheetMetadata.captions.keysIndex],
      valuesOfRecords: captionsData.slice(
        sheetMetadata.captions.recordsIndexStart
      ),
      parseValues: (key, value) => {
        if (key === 'time') {
          return parseFloat(value, 10)
        }
        return value
      },
    })
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
            parseValues: (key, value) => {
              if (key === 'secondsPer100vh') {
                return parseFloat(value, 10)
              }
              if (key === 'pollingTimeout') {
                return parseInt(value, 10)
              }
              if (key === 'forcedPreloadVideo') {
                return value === 'true'
              }
              return value
            },
          })[0]
        : {}
    return {
      video: {
        sources: videoSources,
      },
      captions,
      theme,
      appProps,
    }
  }
}
