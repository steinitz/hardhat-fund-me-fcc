const {
  deployments, 
  ethers,
  network,
  getNamedAccounts,
} = require("hardhat")
const {assert} = require("chai")
const {developmentChains} = require('../../helper-hardhat-config.js')

// NB: this test will fail if the account has less than valueToSend ETH plus gas

const valueToSend = ethers.parseEther("0.3") // 1 ETH

developmentChains.includes(network.name)
  ? describe.skip
  :describe ('FundMe', async () => {
    console.log('Running staging tests')
    let fundMe
    let signer

    beforeEach(async function () {
      // deployer = await getNamedAccounts().deployer
      signer = await ethers.provider.getSigner()

      const deployment = await deployments.get("FundMe")
      // console.log({deployment})

      fundMe = await ethers.getContractAt(
        "FundMe", 
        deployment.address, 
        signer
      )  
      // console.log({fundMe})
    })

    it('funding and withdrawing', async () => {
      // console.log({valueToSend})
      await fundMe.fund({value: valueToSend})
      // console.log('withdrawing')
      await fundMe.withdraw()
      const endingBalance = await ethers.provider.getBalance(fundMe)
      assert.equal(endingBalance.toString(), '0')
    })
  })