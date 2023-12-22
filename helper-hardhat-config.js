const {
  SEPOLIA_CHAIN_ID,
  HARDHAT_CHAIN_ID,
} = require('./constants')

const networkConfig = {
  [SEPOLIA_CHAIN_ID]: {
    name: "sepolia",
    ethUsdPriceFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",

  },
  [HARDHAT_CHAIN_ID]: {
    name: "hardhat",
    ethUsdPriceFeedAddress: "?",
  }
}

const developmentChains = ['hardhat', 'localhost']
const DECIMALS = 8
const INITIAL_PRICE = 200000000000 // 2000 plus the 8 decimals


module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_PRICE
}