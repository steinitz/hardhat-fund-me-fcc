const {network} = require('hardhat')
const {
  developmentChains, 
  DECIMALS, 
  INITIAL_PRICE
} = require('../helper-hardhat-config.js')

// console.log('00-deploy-mocks.js', {developmentChains}, {DECIMALS}, {INITIAL_PRICE})

module.exports = async ({
  getNamedAccounts, 
  deployments: {deploy = undefined, log = undefined} = {}
}) => {
  const {deployer} = await getNamedAccounts()
  // console.log('00-deploy-mocks.js', {deployer})
  // console.log('00-deploy-mocks.js', {network})
  
  // const chainId = network.config.chainId

  if (developmentChains.includes(network.name)) {
    log('Local network detected.  Deploying mocks...')
    await deploy(
      'MockV3Aggregator', {
        contract: 'MockV3Aggregator',
        from: deployer,
        log: true,
        args: [
          DECIMALS,
          INITIAL_PRICE,
        ]
      }
    )
    log('Mocks deployed')
    log('-------------------------------------------')
  }
  
  // console.log(
  //   '00-deploy-mocks.js - anonymous deploy mock script running with',
  //   {deployer},
  //   {deploy},
  //   {log},
  //   {chainId}
  // )
}

module.exports.tags = ['all', 'mocks']
