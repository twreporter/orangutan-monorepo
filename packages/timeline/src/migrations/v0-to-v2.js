const templateSpreadsheetId = '1f76OLdfZe3kyNOKiPthWNJWVGmY3bkm5KtxB4NYp9uU'

/**
 *
 *
 * @export
 * @param {object} services
 * @param {import('googleapis').sheets_v4.Sheets} services.sheetsService
 * @param {import('googleapis').drive_v3.Drive} services.driveService
 * @param {string} sourceSpreadsheetId
 * @param {string} [ownerEmail='developer@twreporter.org'] the owner of new spreadsheet
 * @return {string} newSpreadsheetId
 */
export default async function migrate(
  { sheetsService, driveService },
  sourceSpreadsheetId,
  ownerEmail = 'developer@twreporter.org'
) {
  let newSpreadsheetId
  try {
    // Get properties of source spreadsheet
    console.log('Start getting properties from source spreadsheet...')
    const sourceSpreadsheetProperties = await sheetsService.spreadsheets
      .get({
        spreadsheetId: sourceSpreadsheetId,
        fields: 'properties',
      })
      .then(result => result.data.properties)
    console.log(
      'Got properties of source spreadsheet. `properties.title`: ' +
        sourceSpreadsheetProperties.title
    )

    // Create a new spreadsheet from the template spreadsheet
    console.log('Start copying template spreadsheet to new spreadsheet...')
    console.log(
      `template: https://docs.google.com/spreadsheets/d/${templateSpreadsheetId}`
    )
    newSpreadsheetId = await driveService.files
      .copy({
        fileId: templateSpreadsheetId,
        fields: 'id',
      })
      .then(result => result.data.id)
    console.log('The template has been copied to new spreadsheet.')
    console.log(
      `new spreadsheet: https://docs.google.com/spreadsheets/d/${newSpreadsheetId}`
    )

    // Update new spreadsheet with source properties
    console.log('Start updating properties from source to new spreadsheet')
    await sheetsService.spreadsheets.batchUpdate({
      spreadsheetId: newSpreadsheetId,
      includeSpreadsheetInResponse: false,
      requestBody: {
        requests: [
          {
            updateSpreadsheetProperties: {
              properties: {
                ...sourceSpreadsheetProperties,
                title: sourceSpreadsheetProperties.title + '(v0->v2)',
              },
              fields: '*',
            },
          },
        ],
      },
    })
    console.log('Properties have been updated.')

    // Clear unused data in new spreadsheet
    console.log('Start clearing template values in new spreadsheet...')
    await sheetsService.spreadsheets.values.batchClear({
      spreadsheetId: newSpreadsheetId,
      ranges: [
        'elements!B5:B',
        'elements!C5:C',
        'elements!D5:D',
        'elements!E5:E',
        'elements!F5:F',
        'elements!G5:G',
        'elements!H5:H',
      ],
    })
    console.log('Template values have been cleared.')

    // Copy values from source spreadsheet to new one
    console.log('Start getting values from source spreadsheet...')
    const sourceValues = await sheetsService.spreadsheets.values
      .batchGet({
        spreadsheetId: sourceSpreadsheetId,
        valueRenderOption: 'FORMATTED_VALUE',
        majorDimension: 'COLUMNS',
        ranges: [
          // - 0 type
          '大事記!A4:A',
          // - 1 label
          '大事記!B4:B',
          // - 2 title
          '大事記!C4:C',
          // - 3 description
          '大事記!D4:D',
          // - 4 image.caption
          '大事記!E4:E',
          // - 5 image.src
          '大事記!F4:F',
          // - 6 image.alt
          '大事記!G4:G',
        ],
      })
      .then(result => result.data.valueRanges)
    console.log('Values of source spreadsheet fetched.')
    console.log('Start updating source values to new spreadsheet...')
    await sheetsService.spreadsheets.values.batchUpdate({
      spreadsheetId: newSpreadsheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: [
          // - type
          {
            range: 'elements!B5',
            majorDimension: 'COLUMNS',
            values: sourceValues[0].values,
          },
          // - content.label
          {
            range: 'elements!C5',
            majorDimension: 'COLUMNS',
            values: sourceValues[1].values,
          },
          // - content.title
          {
            range: 'elements!D5',
            majorDimension: 'COLUMNS',
            values: sourceValues[2].values,
          },
          // - content.description
          {
            range: 'elements!E5',
            majorDimension: 'COLUMNS',
            values: sourceValues[3].values,
          },
          // - content.image.src
          {
            range: 'elements!F5',
            majorDimension: 'COLUMNS',
            values: sourceValues[5].values,
          },
          // - content.image.caption
          {
            range: 'elements!G5',
            majorDimension: 'COLUMNS',
            values: sourceValues[4].values,
          },
          // - content.image.alt
          {
            range: 'elements!H5',
            majorDimension: 'COLUMNS',
            values: sourceValues[6].values,
          },
        ],
        includeValuesInResponse: false,
      },
    })
    console.log('Values updated.')

    // Update values copied from source
    console.log('Start replacing values in new spreadsheet...')
    // - Type renaming: `record-flag` -> `unit-flag`
    const elementsSheetId = await sheetsService.spreadsheets
      .get({
        spreadsheetId: newSpreadsheetId,
        fields: 'sheets',
      })
      .then(
        // Get sheets id because `findReplace` request take sheet's id rather than sheet's title in A1 notation string.
        result =>
          result.data.sheets.find(
            sheet => sheet.properties.title === 'elements'
          ).properties.sheetId
      )
    await sheetsService.spreadsheets.batchUpdate({
      spreadsheetId: newSpreadsheetId,
      includeSpreadsheetInResponse: false,
      requestBody: {
        requests: [
          {
            findReplace: {
              find: 'record-flag',
              replacement: 'unit-flag',
              range: {
                sheetId: elementsSheetId,
                startRowIndex: 4,
                startColumnIndex: 1,
                endColumnIndex: 2,
              }, // means `range:'elements!B5:B'` in A1 notation string
            },
          },
        ],
      },
    })
    console.log('Values have been updated.')

    // Update new spreadsheet permission
    console.log('Start creating permissions of new spreadsheet...')
    await driveService.permissions.create({
      fileId: newSpreadsheetId,
      requestBody: {
        role: 'writer',
        type: 'domain',
        domain: 'twreporter.org',
      },
    })
    await driveService.permissions.create({
      fileId: newSpreadsheetId,
      requestBody: {
        role: 'commenter',
        type: 'anyone',
      },
    })
    // Ownership can only be transferred to another user in the same domain as the current owner.
    // So we cannot transfer ownership to other users as followed code if using service account as spreadsheet creator:
    // ```
    // await driveService.permissions.create({
    //   fileId: newSpreadsheetId,
    //   transferOwnership: true,
    //   requestBody: {
    //     role: 'owner',
    //     type: 'user',
    //     emailAddress: ownerEmail,
    //     emailMessage: 'This spreadsheet is produced by @twreporter/timeline migration tools. Version: v0-to-v2. '
    //       + `new template: https://docs.google.com/spreadsheets/d/${templateSpreadsheetId} `
    //       + `source: https://docs.google.com/spreadsheets/d/${sourceSpreadsheetId}`
    //   }
    // })
    // ```
    // TODO: Use OAuth to use user's authentication to create the file instead.
    console.log('Permissions updated.')

    // Finish
    console.log('Migration succeeded.')
  } catch (error) {
    console.log('Migration failed. An error occurred when migrating: ')
    console.error(error)
  }
  console.log('TASK INFO:')
  console.log(
    `- source spreadsheet: https://docs.google.com/spreadsheets/d/${sourceSpreadsheetId}`
  )
  console.log(
    `- new spreadsheet: https://docs.google.com/spreadsheets/d/${newSpreadsheetId}`
  )
  console.log('- You can run the command:')
  console.log(`  ID=${newSpreadsheetId} make delete-spreadsheet`)
  console.log('  to delete the new spreadsheet.')
  return newSpreadsheetId
}
