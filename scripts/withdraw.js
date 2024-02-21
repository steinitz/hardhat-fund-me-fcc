const {getContract} = require('../utils/getContract')
const {valueToSend} = require('./shared')

// to run this in localhost:
// open a new terminal and run 
//   npx hardhat node
// then in the other terminal run
//   yarn hardhat run scripts/withdraw.js --network localhost
// const valueToSend = ethers.parseEther("0.3") // 0.3 ETH

async function main() {
  let fundMe
  ({contract: fundMe} = await getContract("FundMe"))
  console.log('Withdrawing from FundMe contract')
  const transactionResponse = await fundMe.withdraw(
    {value: valueToSend}
  )
  await transactionResponse.wait(1)
  console.log('Withdrawn')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })