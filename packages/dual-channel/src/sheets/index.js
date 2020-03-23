import { google } from 'googleapis'
import forEach from 'lodash/forEach'
import get from 'lodash/get'
import map from 'lodash/map'

const _ = {
  forEach,
  get,
  map,
}

const defaultScopes = ['https://www.googleapis.com/auth/spreadsheets.readonly']

class ActionError extends Error {
  constructor(type, payload) {
    super(type)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ActionError)
    }

    this.name = 'ActionError'
    this.payload = payload
  }
}

/**
 *  Spreadsheet URL:
 *  https://docs.google.com/spreadsheets/d/17O52JxAetcPyOKxyp8wONPPfLhDiCFIm53u6LDyAx6U/edit#gid=492967532
 *
 *  Sample code:
 *
 *  const DualChannel = require('../components/root')
 *
 *  const sheets = new Sheets({
 *    spreadsheetId: '17O52JxAetcPyOKxyp8wONPPfLhDiCFIm53u6LDyAx6U',
 *    keyFile: path.resolve(__dirname, './sheets-api.json'), // access_token
 *    targetSheetsId: [492967532] // sheet id/gid
 *  })
 *
 *  sheets.getJSONData()
 *    .then(({chapters, embeddedItems}) => {
 *      ReactDOM.render(
 *        (
 *          <DualChannel
 *            embeddedItems={embeddedItems}
 *            chapters={chapters}
 *          />
 *        ), document.getElementById('root'))
 *    })
 *
 */

export default class Sheets {
  constructor({
    keyFile,
    scopes = defaultScopes,
    spreadsheetId,
    targetSheetsId = [],
  }) {
    const auth = new google.auth.GoogleAuth({
      keyFile,
      scopes,
    })

    this.sheets = google.sheets({
      version: 'v4',
      auth,
    })

    this.spreadsheetId = spreadsheetId
    this.targetSheetsId = Array.isArray(targetSheetsId) ? targetSheetsId : []
  }

  _getGidAndTitleOfSheets() {
    return this.sheets.spreadsheets
      .get({
        spreadsheetId: this.spreadsheetId,
      })
      .then(res => {
        const sheets = _.get(res, 'data.sheets')
        const titleOfSheets = []
        const gidOfSheets = []
        _.forEach(sheets, sheet => {
          const sheetId = _.get(sheet, 'properties.sheetId', '')
          const title = _.get(sheet, 'properties.title', '')
          if (
            this.targetSheetsId.length === 0 ||
            (this.targetSheetsId.length > 0 &&
              this.targetSheetsId.indexOf(sheetId) > -1)
          ) {
            titleOfSheets.push(title)
            gidOfSheets.push(sheetId)
          }
        })
        return {
          titleOfSheets,
          gidOfSheets,
        }
      })
      .catch(err => {
        return Promise.reject(
          new ActionError('Error to get title of sheets', {
            error: err,
          })
        )
      })
  }

  _getSheetData(range) {
    return this.sheets.spreadsheets.values
      .get({
        spreadsheetId: this.spreadsheetId,
        range,
      })
      .then(res => {
        return _.get(res, 'data')
      })
      .catch(err => {
        return Promise.reject(
          new ActionError('Error to get data of a sheet', {
            error: err,
          })
        )
      })
  }

  _getSheetsData(titleOfSheets) {
    return Promise.all(
      _.map(titleOfSheets, title => {
        const range = `${title}!A2:D`
        return this._getSheetData(range)
      })
    ).catch(err => {
      return Promise.reject(
        new ActionError('Error to get data of all sheets', {
          error: err,
        })
      )
    })
  }

  _parseASection(row, id) {
    return {
      id,
      content: [
        {
          type: 'header-two',
          content: [_.get(row, '2', '')],
        },
        {
          type: 'paragraph',
          content: [_.get(row, '3', '')],
        },
      ],
    }
  }

  _parseAChapter(rows, title, id) {
    const chapter = {
      id,
      label: title,
      content: _.map(rows, (row, index) => {
        return this._parseASection(row, `chapter-${id}-section-${index + 1}`)
      }),
    }

    if (Array.isArray(_.get(chapter, 'content.0.content'))) {
      chapter.content[0].content.unshift({
        type: 'header-two',
        content: [title],
      })
    }
    return chapter
  }

  _parseEmbeddedItemsOfAChapter(rows) {
    return _.map(rows, row => {
      // [ 'img html', 'animation type']
      return [_.get(row, 0, ''), _.get(row, 1, 'none')]
    })
  }

  _parseChaptersAndEmbeddedItems(sheetsData, gidOfSheets, titleOfSheets) {
    const chapters = []
    const embeddedItems = []
    _.forEach(sheetsData, (sheetData, index) => {
      const sheetId = _.get(gidOfSheets, [index], '')
      const sheetTitle = _.get(titleOfSheets, [index], '')

      const rows = _.get(sheetData, 'values', [])
      if (Array.isArray(rows) && rows.length > 0) {
        chapters.push(this._parseAChapter(rows, sheetTitle, `${sheetId}`))
        embeddedItems.push(this._parseEmbeddedItemsOfAChapter(rows))
      }
    })
    return {
      chapters,
      embeddedItems,
    }
  }

  getJSONData() {
    return this._getGidAndTitleOfSheets()
      .then(({ gidOfSheets, titleOfSheets }) => {
        return Promise.all([
          this._getSheetsData(titleOfSheets),
          gidOfSheets,
          titleOfSheets,
        ])
      })
      .then(results => {
        const sheetsData = _.get(results, 0, [])
        const gidOfSheets = _.get(results, 1, [])
        const titleOfSheets = _.get(results, 2, [])
        return this._parseChaptersAndEmbeddedItems(
          sheetsData,
          gidOfSheets,
          titleOfSheets
        )
      })
  }
}
