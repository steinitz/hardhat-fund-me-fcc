const {getContract} = require('../utils/getContract')
const {valueToSend} = require('./shared')

// to run this in localhost:
// open a new terminal and run 
//   npx hardhat node
// then in the other terminal run
//   yarn hardhat run scripts/fund.js --network localhost

async function main() {
  let fundMe
  ({contract: fundMe} = await getContract("FundMe"))
  console.log('Funding FundMe contract')
  const transactionResponse = await fundMe.fund({
    value: valueToSend,
  })
  await transactionResponse.wait(1)
  console.log('Funded')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

