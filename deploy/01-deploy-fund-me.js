// function deployFunc(hre) {
const {networkConfig} = require("../helper-hardhat-config")
const {network} = require('hardhat')

// console.log('01-deploy-fund-me', {network})

const chainId = network.config.chainId
console.log('01-deploy-fund-me',{chainId})

// console.log('01-deploy-fund-me', {networkConfig})
const currentChain = networkConfig[chainId]
console.log({currentChain})

const theEthUsdPriceFeedAddress = currentChain.ethUsdPriceFeedAddress

module.exports = async ({
  getNamedAccounts, 
  deployments: {deploy = undefined, log = undefined} = {}
}) => {
  const deployer = await getNamedAccounts()

  // console.log(
  //   '01-deploy-fund-me - anonymous deploy fundMe script running with',
  //   {deployer},
  //   {deploy},
  //   {log},
  // )

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [address],
    log: true
  })
}
