import path from 'path'

const packagesDirname = 'packages'

export const packagesAbsolutePath = path.resolve(
  __dirname,
  '..',
  packagesDirname
)

export const dependencyTypeShorthands = {
  prod: 'dependencies',
  dev: 'devDependencies',
  optional: 'optionalDependencies',
  peer: 'peerDependencies',
}
