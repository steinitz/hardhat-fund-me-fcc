const {
  deployments, 
  ethers,
} = require("hardhat")
const {assert, expect} = require("chai")
const {insufficentETH} = require('../../constants')

describe("FundMe", async function () {
  let fundMe
  let deployer
  let mockV3Aggregator

  beforeEach(async function () {
    // const namedAccounts = await getNamedAccounts()
    // deployer = namedAccounts.deployer
    const signer = await ethers.provider.getSigner()
    await deployments.fixture(["all"])
    fundMe = await ethers.getContractAt(
      "FundMe", 
      (await deployments.get("FundMe")).address, 
      signer
    )
    mockV3Aggregator = await ethers.getContractAt(
      "MockV3Aggregator", 
      (await deployments.get("MockV3Aggregator")).address, 
      signer
    )
    // console.log(
    //   'FundMe.test beforeEach', {
    //     namedAccounts,
    //     deployer, 
    //     signer,
    //     // fundMe, 
    //     mockV3Aggregator,
    //   }
    // )
  })
  
  describe("constructor", async function () {
    it("sets the aggregator addresses correclty", async function () {
      const response = await fundMe.priceFeed()
      // console.log('FundMe.test aggregator test', {response})
      assert.equal(mockV3Aggregator.target, response)
    })
  })

  describe("fund", async function () {
    it("fails if you don't send enough ETH", async function () {
      await expect(fundMe.fund()).to.be.revertedWith(insufficentETH)
    })
  })

})