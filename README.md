# DApp

The Dopex DApp, currently hosted on https://app.dopex.io and https://testnet.dopex.io

## Getting started

### Pre-requisites

Please have these installed on your machine:

- [Node.js 12+](https://nodejs.org/)
- [Yarn v1](https://classic.yarnpkg.com/lang/)

### Install dependencies:

```
yarn
```

To start the DApp you also need to setup an additional .env.local file:

It should look like the following

```
NEXT_PUBLIC_INFURA_PROJECT_ID=#INSERT ID
NEXT_PUBLIC_DEFAULT_CHAIN_ID=1
NEXT_PUBLIC_ASSETS_LIST=USDT,DPX,RDPX
NEXT_PUBLIC_BUILD=#testnet or main
```

Then you can proceed to start the app:

```
yarn start
```

To build the App:

```
yarn build
```

For the App, you will need the development addresses generated during deployment if you are planning to connect to a locally running EVM. To do so first run:

```
yarn evm
```

followed by;

```
yarn contracts
```
