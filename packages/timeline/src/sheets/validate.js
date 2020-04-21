import schema from '../constants/validation-schema'
import { object } from 'yup'

/**
 * @typedef {Object} JSONData
 * @property {Array} elements
 * @property {Object} theme
 * @property {Object} appProps
 */

/**
 * @export
 * @param {JSONData} data
 * @returns {Promise<Array>}
 */
export function validate(data) {
  return object()
    .shape(schema)
    .validate(data, { strict: true })
}

/**
 * @export
 * @param {JSONData} data
 * @returns {Array}
 */
export function validateSync(data) {
  return object()
    .shape(schema)
    .validateSync(data, { strict: true })
}
