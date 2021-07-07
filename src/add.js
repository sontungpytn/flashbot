const dotenv = require('dotenv')
dotenv.config()
const Web3 = require('web3')


// WEB3 CONFIG
const web3 = new Web3(process.env.RPC_URL)
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)
console.log(account)
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

const TRADER_ABI = require('./abis/Trader')
const TRADER_ADDRESS = process.env.CONTRACT_ADDRESS
const traderContract = new web3.eth.Contract(TRADER_ABI, TRADER_ADDRESS)




const approve = async (value) => {
	try {
		const options = {
			from: account.address,
			gas: process.env.GAS_LIMIT,
			gasPrice: web3.utils.toWei(process.env.GAS_PRICE, 'Gwei')
		}

		const estimatedGas = await traderContract.methods.getWeth().estimateGas({
			...options,
			value: 1000
		})

		console.log(estimatedGas)
		//
		// const getWethReceipt = await traderContract.methods.getWeth().send({
		// 	...options,
		// 	value
		// })
		// console.log('getWethReceipt', getWethReceipt)

		const approveWethReceipt = await traderContract.methods.approveWeth(1000).send({
			...options
		})
		console.log('approveWethReceipt', approveWethReceipt)

	} catch (err) {
		console.log('Error', err)
	}
}


const value = 200
// approve(value)

const test = async () => {
	const balance = await web3.eth.getBalance(account.address)
	console.log(balance)
	console.log(web3.utils.fromWei(balance, "ether") + " ETH")
	web3.eth.getGasPrice().then((result) => {
		console.log(web3.utils.fromWei(result, 'gwei'))
	})

}

test()
