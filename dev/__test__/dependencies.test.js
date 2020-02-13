/* global test describe expect */
import * as utils from '../utils'
// lodash
import forEach from 'lodash/forEach'

const _ = {
  forEach,
}

describe('All dependencies should have valid intersection of its version ranges across different packages.', () => {
  const versionRangesByDependency = utils.getSemverRangesForAllDependencies()
  _.forEach(versionRangesByDependency, (ranges, dependencyName) => {
    test(`\`${dependencyName}\` should have valid intersection`, () => {
      const validatedVersion = utils.validateVersions(ranges)
      if (validatedVersion === null) {
        console.warn(
          'Use `npm run dep-intersect` at root folder to check the dependencies of all packages.'
        )
      }
      expect(validatedVersion).not.toBeNull()
    })
  })
})
