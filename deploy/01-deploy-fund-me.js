// function deployFunc(hre) {
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config")
const {network} = require('hardhat')

// console.log('01-deploy-fund-me', {network})

const chainId = network.config.chainId
// console.log('01-deploy-fund-me',{chainId})

// console.log('01-deploy-fund-me', {networkConfig})
// const currentChain = networkConfig[chainId]
// console.log({currentChain})

// const theEthUsdPriceFeedAddress = currentChain.ethUsdPriceFeedAddress

module.exports = async ({
  getNamedAccounts, 
  deployments: {
    deploy = undefined, 
    log = undefined, 
    get = undefined
  }
}) => {
  const {deployer} = await getNamedAccounts()

  console.log(
    '01-deploy-fund-me - anonymous deploy fundMe script running with',
    {deployer},
    {deploy},
    {log},
  )

  let ethUsdPriceFeedAddress
  
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  }
  else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  }
    
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true
  })

  log('---------------------------------------')

}

module.exports.tags = ['all', 'fundme']

