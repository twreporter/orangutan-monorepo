import { google } from 'googleapis'

/**
 *
 * https://developers.google.com/sheets/api/reference/rest
 * @export
 * @param {import('google-auth-library').GoogleAuth} auth
 * @returns
 */
export function sheets(auth) {
  return google.sheets({
    version: 'v4',
    auth,
  })
}

/**
 *
 * https://developers.google.com/drive/api/v3/reference
 * @export
 * @param {import('google-auth-library').GoogleAuth} auth
 * @returns
 */
export function drive(auth) {
  return google.drive({
    version: 'v3',
    auth,
  })
}

/**
 *
 *
 * @export
 * @param {import('google-auth-library').GoogleAuthOptions} authOptions
 * @returns
 */
export function auth(authOptions) {
  return new google.auth.GoogleAuth(authOptions)
}
