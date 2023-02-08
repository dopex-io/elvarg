# Elvarg

The Dopex frontend monorepo

## Getting started

### Pre-requisites

Please have these installed on your machine:

- [Node.js 16+](https://nodejs.org/)
- [Yarn v1](https://classic.yarnpkg.com/lang/)

### Install dependencies:

```
yarn
```

### Install `turbo` globally:

```
yarn global add turbo
```

### Turbo pipeline commands

`dev` - Runs the dapp in dev mode

Via yarn:

```
yarn dev
```

Via turbo:

```
turbo dev
```

`build` - Builds the dapp and ui

Via yarn:

```
yarn build
```

Via turbo:

```
turbo build
```

`storybook` - Run the storybook in dev mode

Via yarn:

```
yarn storybook
```

Via turbo:

```
turbo storybook
```

`generate` - Runs the graphql codegen in dapp

Via yarn:

```
yarn generate
```

Via turbo:

```
turbo generate
```

`lint` - Runs linting

Via yarn:

```
yarn lint
```

Via turbo:

```
turbo lint
```

### Installing dependencies into a workspace

Since this is a monorepo configured via yarn workspaces adding dependencies to a workspace should be done in the following manner - https://turbo.build/repo/docs/handbook/package-installation#addingremovingupgrading-packages

### Starting individual workspaces

Look into the specific README of the workspace to begin.
