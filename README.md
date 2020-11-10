# orangutan-monorepo

This repository is a monorepo containing several npm packages used by the website of online news media [The Reporter](https://www.twreporter.org).

- [orangutan-monorepo](#orangutan-monorepo)
  - [Packages](#packages)
  - [Developing Environment](#developing-environment)
    - [Yarn Workspaces](#yarn-workspaces)
    - [Eslint and Prettier](#eslint-and-prettier)
  - [Develop](#develop)
    - [Develop all Packages](#develop-all-packages)
    - [Develop Single Package](#develop-single-package)
  - [CI/CD](#cicd)

## Packages

See [`packages`](https://github.com/twreporter/orangutan-monorepo/tree/master/packages)

Note that `orangutan` used to be an all-in-one package which can be utilized to generate embedded code of other packages.
The goal was to prevent dependencies from reloading when multiple components of other packages exist on the same page.
However, it brings other issues. For example, when multiple embedded code built by `orangutan` in different version on the same page, the dependency reloading issue would be even severer since they might change between each version.
Therefore, `orangutan` is removed in this [PR](https://github.com/twreporter/orangutan-monorepo/pull/80).

## Developing Environment

### Yarn Workspaces

We use _Yarn Workspaces_ to:

- Add and remove dependencies of all packages (subfolders) easily.
- Prevent installing duplicate dependencies across packages (subfolders). Yarn can _hoist_ them to the root folder.
- Create symlinks between packages (subfolders) that depend on each other.

The official [document](https://yarnpkg.com/en/docs/workspaces) and [blog post](https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/) give clear examples showing how workspaces can get theses done.

And here are some example commands for common scienarios:

- Add `lodash` to the dependencies of all packages:

  ```bash
  yarn workspaces run add lodash
  ```

  [`yarn workspaces run <command>`](https://yarnpkg.com/en/docs/cli/workspaces#toc-yarn-workspaces-run)

- Add `react` only to the peer dependencies of `@twreporter/react-component` package:

  ```bash
  yarn workspace @twreporter/react-components add react --peer
  ```

  [`yarn workspace <workspace_name> <command>`](https://yarnpkg.com/en/docs/cli/workspace)

  **CAUTION**: The `<workspace_name>` is the `name` in `package.json` of given package, not the path string in the `workspaces` array of root `packages.json` or the dirname.

- Add `a-root-only-module` to the dev dependencies of `twreporter-npm-packages` (not in the dependencies of any package):

  ```bash
  yarn add a-root-only-module --dev --ignore-workspace-root-check
  ```

  [`yarn add <package...> [--ignore-workspace-root-check/-W]`](https://yarnpkg.com/en/docs/cli/add#toc-yarn-add-ignore-workspace-root-check-w)

### Eslint and Prettier

We use [Prettier](https://prettier.io/) to take care of code format and use [ESlint with JavaScript Standard Style](https://github.com/standard/eslint-config-standard) for code-quality rules.

You can also run `prettier` and `eslint` with:

```bash
make prettier

make lint
```

## Develop

We use `babel` with `--watch` flag to re-compile the source code every time that we change it.

### Develop all Packages

```bash
# at root
make dev
```

### Develop Single Package

```bash
# to dev `packages/core` only
cd packages/core;
make dev
```

## CI/CD

We use [CircleCI](https://circleci.com/) with [Lerna](https://github.com/lerna/lerna) for CI and CD.

When new commits are pushed to branch `master` or `release`, the CI/CD server will run `lerna` to check if there is any package needs to bump version, and also use `lerna` to publish the package which has not been published to the NPM registry yet.

Changes in `master` will be versioned/publshed as release candidate (rc). Changes in `release` will be versioned/publshed as production release.

The [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/) is applied here to determine which version to bump (major, minor, or patch) and generate `CHANGELOG.md` files to each package. For further usage, please check [documentation of Lerna](https://github.com/lerna/lerna/tree/master/commands/version#positionals)
