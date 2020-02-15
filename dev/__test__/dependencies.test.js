/* global test describe expect */
import { dependencyTypeShorthands } from '../constants'
import * as utils from '../utils'
// lodash
import forEach from 'lodash/forEach'
import get from 'lodash/get'

const _ = {
  forEach,
  get,
}

describe('All prod dependencies should have valid intersection of its version ranges across different packages.', () => {
  const targetDepType = dependencyTypeShorthands.prod
  const dependencyVersionsByDependency = utils.listDependencyVersionsByDependency(
    targetDepType
  )
  _.forEach(dependencyVersionsByDependency, (ranges, dependencyName) => {
    test(`\`${dependencyName}\` should have valid intersection`, () => {
      const validatedVersion = utils.getIntersection(ranges)
      if (validatedVersion === null) {
        console.warn(
          `Use \`make dep-intersect\` at root folder to check the intersection versions among all ${targetDepType}.`
        )
      }
      expect(validatedVersion).not.toBeNull()
    })
  })
})

describe('All dev dependencies should have valid intersection of its version ranges across different packages.', () => {
  const targetDepType = dependencyTypeShorthands.dev
  const dependencyVersionsByDependency = utils.listDependencyVersionsByDependency(
    targetDepType
  )
  _.forEach(dependencyVersionsByDependency, (ranges, dependencyName) => {
    test(`\`${dependencyName}\` should have valid intersection`, () => {
      const validatedVersion = utils.getIntersection(ranges)
      if (validatedVersion === null) {
        console.warn(
          `Use \`make dep-intersect\` at root folder to check the intersection versions among all ${targetDepType}.`
        )
      }
      expect(validatedVersion).not.toBeNull()
    })
  })
})

describe(`Check versions of ${dependencyTypeShorthands.dev}`, () => {
  const devDependencyVersionsByPackage = utils.listDependencyVersionsByPackage(
    dependencyTypeShorthands.dev
  )
  describe(`The version of each optional dependency should be the same as it in ${dependencyTypeShorthands.dev}`, () => {
    const optionalDependencyVersionsByPackage = utils.listDependencyVersionsByPackage(
      dependencyTypeShorthands.optional
    )
    _.forEach(
      optionalDependencyVersionsByPackage,
      (optionalDependencies, packageDirname) => {
        _.forEach(optionalDependencies, (rangeOfOptional, dependencyName) => {
          const rangeOfDev = _.get(devDependencyVersionsByPackage, [
            packageDirname,
            dependencyName,
          ])
          if (rangeOfDev) {
            test(`The version of optional dependency \`${dependencyName}\` should be the same as it of ${dependencyTypeShorthands.dev} in package \`${packageDirname}\``, () => {
              expect(rangeOfOptional).toBe(rangeOfDev)
            })
          }
        })
      }
    )
  })

  describe(`The version of each peer dependency should be the same as it in ${dependencyTypeShorthands.dev}`, () => {
    const peerDependencyVersionsByPackage = utils.listDependencyVersionsByPackage(
      dependencyTypeShorthands.peer
    )
    _.forEach(
      peerDependencyVersionsByPackage,
      (peerDependencies, packageDirname) => {
        _.forEach(peerDependencies, (rangeOfPeer, dependencyName) => {
          const rangeOfDev = _.get(devDependencyVersionsByPackage, [
            packageDirname,
            dependencyName,
          ])
          if (rangeOfDev) {
            test(`The version of peer dependency \`${dependencyName}\` should be the same as it of ${dependencyTypeShorthands.dev} in package \`${packageDirname}\``, () => {
              expect(rangeOfPeer).toBe(rangeOfDev)
            })
          }
        })
      }
    )
  })
})
