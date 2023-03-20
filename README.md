# Elvarg

The Dopex frontend monorepo

## Getting started

### Pre-requisites

Please have these installed on your machine:

- [node.js 16+](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Install dependencies:

```
pnpm i
```

### Install `turbo` globally:

```
pnpm add -g turbo
```

### Turbo pipeline commands

`dev` - Runs the dapp in dev mode

```
turbo dev
```

`build` - Builds the dapp

```
turbo build
```

`storybook` - Run the storybook in dev mode

```
turbo storybook
```

`lint` - Runs linting

```
turbo lint
```

`generate` - Runs the graphql codegen in dapp

```
turbo generate
```

`build-ui` - Builds the UI package

```
turbo build-ui
```

`build-storybook` - Builds the storybook

```
turbo build-storybook
```

### Installing dependencies into a workspace

Since this is a monorepo configured via pnpm workspaces adding dependencies to a workspace should be done in the following manner - https://turbo.build/repo/docs/handbook/package-installation#addingremovingupgrading-packages

### Starting individual workspaces

Look into the specific README of the workspace to begin.
