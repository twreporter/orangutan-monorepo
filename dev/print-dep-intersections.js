import * as utils from './utils'
// lodash
import forEach from 'lodash/forEach'

const _ = {
  forEach,
}

const versionRangesByDependency = utils.getSemverRangesForAllDependencies()
console.log(
  'Print the senmantic version ranges for dependencies of all packages:'
)
console.log('========================================================')
console.log('dependency name / [ assigned ranges ] / intersection')
console.log('========================================================')
_.forEach(versionRangesByDependency, (ranges, dependencyName) => {
  const validatedVersion = utils.validateVersions(ranges)
  console.log(dependencyName, ranges, validatedVersion)
})
console.log('========================================================')
