import * as constants from './constants'
import fs from 'fs'
import path from 'path'
import { intersect } from 'semver-intersect'
// lodash
import get from 'lodash/get'
import forEach from 'lodash/forEach'
import set from 'lodash/set'
import reduce from 'lodash/reduce'

const _ = {
  get,
  forEach,
  set,
  reduce,
}

/**
 * Return all dirnames under the packages folder in an array
 *
 * @export
 * @returns {string[]}
 */
export function getPackageDirnames() {
  // Cache the dirnames on runtime to reduce disk read
  if (!getPackageDirnames._cache) {
    const packagesPath = constants.packagesAbsolutePath
    getPackageDirnames._cache = fs
      .readdirSync(packagesPath, {})
      .filter(filename =>
        fs.statSync(path.resolve(packagesPath, filename)).isDirectory()
      )
  }
  return getPackageDirnames._cache
}

/**
 * Read and parse the `package.json` into javascript object
 *
 * @param {string} packageDirname
 * @return {Object} parsed content of `package.json`
 */
function parsePackageJson(packageDirname) {
  // Cache the parsed value on runtime to reduce disk read
  if (!_.get(parsePackageJson, packageDirname)) {
    const packageJsonPath = path.resolve(
      constants.packagesAbsolutePath,
      packageDirname,
      'package.json'
    )
    const packageJsonObj = JSON.parse(fs.readFileSync(packageJsonPath))
    _.set(parsePackageJson, packageDirname, packageJsonObj)
  }
  return _.get(parsePackageJson, packageDirname)
}

/**
 *
 *
 * @param {string} dependencyTypeShorthand - 'prod', 'dev', 'peer', or 'optional'.
 * @param {Object} `dependencyVersionsOfPackages` will be an object like:
                      {
                        core: {
                          lodash: '^4.0.0',
                          'styled-components': '^4.0.0'
                        },
                        'index-page': {
                          '@twreporter/core': '^1.0.1',
                          '@twreporter/velocity-react': '^1.4.1',
                          ...
                        }, ...
                      }
 */
export function listDependencyVersionsByPackage(dependencyTypeShorthand) {
  return _.reduce(
    getPackageDirnames(),
    (_deps, packageDirname) => {
      return {
        ..._deps,
        [packageDirname]: _.get(
          parsePackageJson(packageDirname),
          dependencyTypeShorthand
        ),
      }
    },
    {}
  )
}

/**
 * Build `dependencyVersionsAcrossPackages`. The returned object will be like:
 * {
 *   lodash: [ '^4.0.0', '^4.0.0', '^4.17.11', '^3.0.0' ],
 *   'styled-components': [ '^4.0.0', '^4.0.0', '^4.0.0', '^4.0.0' ],
 *   '@twreporter/core': [ '^1.0.1', '^1.0.3', '^1.0.3' ],
 *   '@twreporter/velocity-react': [ '^1.4.1' ],
 * }
 *
 * @export
 * @param {string} [dependencyTypeShorthand] - 'prod', 'dev', 'peer', or 'optional'.
 * @returns {Object}
 */
export function listDependencyVersionsByDependency(dependencyTypeShorthand) {
  const dependencyVersionsByPackage = listDependencyVersionsByPackage(
    dependencyTypeShorthand
  )
  const dependencyVersionsAcrossPackages = {}
  _.forEach(dependencyVersionsByPackage, packageDeps => {
    _.forEach(packageDeps, (verRange, dependencyName) => {
      const _verRanges = dependencyVersionsAcrossPackages[dependencyName] || []
      dependencyVersionsAcrossPackages[dependencyName] = [
        ..._verRanges,
        verRange,
      ]
    })
  })
  return dependencyVersionsAcrossPackages
}

/**
 * Return the intersection of multiple semver ranges. If there's no intersection, it will return `null`.
 *
 * @param {string[]} versions
 * @returns {null|string}
 */
export function getIntersection(versions) {
  try {
    return intersect(...versions)
  } catch (err) {
    return null
  }
}
