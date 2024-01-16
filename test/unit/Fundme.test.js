const {
  deployments, 
  ethers,
} = require("hardhat")
const {assert, expect} = require("chai")
const {insufficentETH} = require('../../constants')

describe("FundMe", async function () {
  let fundMe
  let mockV3Aggregator
  let signer // note: Patrick's code uses deployer
  const valueToSend = ethers.parseEther("1") // 1 ETH

  beforeEach(async function () {
    signer = await ethers.provider.getSigner()
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
    //     signer,
    //     mockV3Aggregator,
    //   }
    // )
  })
  
  describe("constructor", async function () {
    it("sets the aggregator addresses correclty", async function () {
      const response = await fundMe.priceFeed()
      assert.equal(mockV3Aggregator.target, response)
    })
  })

  describe("fund", async function () {
    it("fails if you don't send enough ETH", async function () {
      await expect(fundMe.fund()).to.be.revertedWith(insufficentETH)
    })

    it("updates the amount funded data structure", async function () {
      await fundMe.fund({value: valueToSend})
      const response = await fundMe.addressToAmountFunded(
        signer
      )
      assert.equal(response.toString(), valueToSend.toString())
    })

    it.only('adds funder to array of funders', async function () {
      await fundMe.fund({value: valueToSend})
      const funder = await fundMe.funders(0)
      // console.log({funder, signer})
      const signerAddress = signer.address
      assert.equal(funder, signerAddress)
    })
  })

})