require("@nomicfoundation/hardhat-toolbox")
// included in the above - require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
// require('./tasks/block-number')
require('hardhat-gas-reporter')

require("hardhat-deploy")

const {
  SEPOLIA_CHAIN_ID,
  HARDHAT_CHAIN_ID,
} = require('./constants')
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const SEPOLIA_KEY = process.env.SEPOLIA_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.8",
  "solidity.enabled": true,
  "solidity.validationDelay": 1500,
  defaultNetwork: "hardhat", // not needed but more explicit
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_KEY],
      chainId: SEPOLIA_CHAIN_ID,
    },
    localhost: {
      url: 'http://127.0.0.1:8545/',
      // accounts: thanks hardhat,
      chainId: HARDHAT_CHAIN_ID,
    },
  },
  solidity: "0.8.19",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    outputFile: 'gas-report.txt',
    noColors: true,
    currency: 'AUD',
    token: 'ETH', // 'MATIC',
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
        1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
},
}
