import * as utils from './utils'
import { dependencyTypeShorthands } from './constants'
// lodash
import forEach from 'lodash/forEach'

const _ = {
  forEach,
}

console.log('========================================================')
console.log('Print the semantic version ranges (by dependency)')
console.log('========================================================')
console.log('dependency name / [ assigned ranges ] / intersection')
console.log('========================================================')
_.forEach(
  utils.listDependencyVersionsByDependency(dependencyTypeShorthands.prod),
  (ranges, dependencyName) => {
    const validatedVersion = utils.getIntersection(ranges)
    console.log(dependencyName, ranges, validatedVersion)
  }
)
console.log('========================================================')
console.log('\n')
console.log('========================================================')
console.log('Print the semantic version ranges (by package)')
console.log('========================================================')
console.log(
  JSON.stringify(
    utils.listDependencyVersionsByPackage(dependencyTypeShorthands.prod),
    undefined,
    2
  )
)
console.log('========================================================')
