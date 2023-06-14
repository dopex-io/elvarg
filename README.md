# Elvarg

The Dopex frontend monorepo

## Getting started

### Pre-requisites

Please have these installed on your machine:

- [node.js 18+](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Install dependencies:

```
pnpm i
```

### Turbo pipeline commands

`dev` - Runs the dapp in dev mode

```
pnpm dev
```

`build` - Builds the dapp

```
pnpm build
```

`storybook` - Run the storybook in dev mode

```
pnpm storybook
```

`lint` - Runs linting

```
pnpm lint
```

`generate` - Runs the graphql codegen in dapp

```
pnpm generate
```

`build-storybook` - Builds the storybook for the ui package

```
pnpm build-storybook
```

### Installing dependencies into a workspace

Since this is a monorepo configured via pnpm workspaces adding dependencies to a workspace should be done in the following manner - https://turbo.build/repo/docs/handbook/package-installation#addingremovingupgrading-packages

### Starting individual workspaces

Look into the specific README of the workspace to begin.
