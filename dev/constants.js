import path from 'path'

const packagesDirname = 'packages'

export const packagesAbsolutePath = path.resolve(
  __dirname,
  '..',
  packagesDirname
)
