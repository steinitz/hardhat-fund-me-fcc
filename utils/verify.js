const {
  run, 
  // ethers, 
  // network,
} = require("hardhat")

async function verify(contractAddress, args) {
  console.log("Verifying contract...", {contractAddress}, {args})
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    console.log('catching test, temp:', e)
    const lowerCaseMessage = e.message?.toLowerCase()
    if (
      lowerCaseMessage.includes("already") &&
      lowerCaseMessage.includes("verified") 
    ) {
      console.log("Already verified")
    } 
    else {
      console.log(e)
    }
  }
}

module.exports = {verify}