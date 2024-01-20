const {
  deployments, 
  ethers,
} = require("hardhat")
const {assert, expect} = require("chai")
const {insufficentETH} = require('../../constants')

describe("FundMe", async () => {
  let fundMe
  let mockV3Aggregator
  let signer // note: Patrick's code uses deployer
  const valueToSend = ethers.parseEther("1") // 1 ETH

  beforeEach(async () => {
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
    it("sets the aggregator addresses correclty", async () => {
      const response = await fundMe.priceFeed()
      assert.equal(mockV3Aggregator.target, response)
    })
  })

  describe("fund", async function () {
    it("fails if you don't send enough ETH", async () => {
      await expect(fundMe.fund()).to.be.revertedWith(insufficentETH)
    })

    it("updates the amount funded data structure", async () => {
      await fundMe.fund({value: valueToSend})
      const response = await fundMe.addressToAmountFunded(
        signer
      )
      assert.equal(response.toString(), valueToSend.toString())
    })

    it('adds funder to array of funders', async () => {
      await fundMe.fund({value: valueToSend})
      const funder = await fundMe.funders(0)
      // console.log({funder, signer})
      const signerAddress = signer.address
      assert.equal(funder, signerAddress)
    })
  })

  describe('withdraw', async () => {
    // beforeEach(async () => {
    //   console.log('withdraw, beforeEach')
    //   await fundMe.fund({value: valueToSend})
    // })

    const fund = async (numberOfFunders) => {
      const accounts = await ethers.getSigners()
      for(let i=1; i <= numberOfFunders; i++) {
        const fundMeConnectedContract = await fundMe.connect(accounts[i])
        await fundMeConnectedContract.fund({value: valueToSend})
      }
      return accounts; // callers don't always need this
    }

    const calculateGasCost = (transactionReceipt) => {
      const {gasUsed, gasPrice} = transactionReceipt
      console.log({gasUsed, gasPrice})
      const gasCost = gasUsed * gasPrice
      return gasCost
    }

    it('can withdraw ETH when only a single funder has funded', async () => {
      // arrange
      await fund(1)
      const startingFundMeBalance = await ethers.provider.getBalance(fundMe)
      console.log({startingFundMeBalance})
      const startingDeployerBalance = await ethers.provider.getBalance(signer)
      console.log({startingDeployerBalance})

      // act
      const transactionResponse = await fundMe.withdraw()
      const transactionReceipt = await transactionResponse.wait(1)

      const endingFundMeBalance = await ethers.provider.getBalance(fundMe)
      console.log({startingFundMeBalance})
      const endingDeployerBalance = await ethers.provider.getBalance(signer)
      console.log({endingDeployerBalance})

      const gasCost = calculateGasCost(transactionReceipt)

      // assert
      assert.equal(endingFundMeBalance, 0)
      assert.equal(
        startingDeployerBalance + startingFundMeBalance,
        (endingDeployerBalance + gasCost).toString()
      )
    })

    it.only('can withdraw ETH when multiple funders have funded', async () => {
      const numberOfTestFundersToCreate = 5
      const accounts = await fund(numberOfTestFundersToCreate)
      const startingFundMeBalance = await ethers.provider.getBalance(fundMe)
      // console.log({startingFundMeBalance})
      const startingDeployerBalance = await ethers.provider.getBalance(signer)
      // console.log({startingDeployerBalance})

      const transactionResponse = await fundMe.withdraw()
      const transactionReceipt = await transactionResponse.wait(1)

      const gasCost = calculateGasCost(transactionReceipt)

      const endingFundMeBalance = await ethers.provider.getBalance(fundMe)
      console.log({startingFundMeBalance})
      const endingDeployerBalance = await ethers.provider.getBalance(signer)
      console.log({endingDeployerBalance})

      assert.equal(endingFundMeBalance, 0)
      assert.equal(
        startingDeployerBalance + startingFundMeBalance,
        (endingDeployerBalance + gasCost).toString()
      )

      // shouldn't be any funders after the withdrawal
      await expect(fundMe.funders(0)).to.be.reverted 

      for (let i = 1; i <= numberOfTestFundersToCreate; i++) {
        const amountFunded = await fundMe.addressToAmountFunded(accounts[i])
        // console.log({amountFunded})
        assert.equal(
          amountFunded,
          0
        )
      }

    })

  })

})