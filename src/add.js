const dotenv = require('dotenv')
dotenv.config()

const Web3 = require('web3')

const HDWalletProvider = require('@truffle/hdwallet-provider')
const mnemonic = process.env.MNEMONIC
const web3 = new Web3(new HDWalletProvider(mnemonic, process.env.RPC_URL))

const weiValue = '1000'

const TRADER_ABI = require('./abis/Trader')
const TRADER_ADDRESS = process.env.CONTRACT_ADDRESS
const traderContract = new web3.eth.Contract(TRADER_ABI, TRADER_ADDRESS)


const approveWETH = async (value) => {
	try {
		const accounts = await web3.eth.getAccounts()

		const sendOptions = {
			from: accounts[0],
			gas: process.env.GAS_LIMIT,
			gasPrice: web3.utils.toWei(process.env.GAS_PRICE, 'Gwei'),
		}
		const getWethReceipt = await traderContract.methods.getWeth()
			.send({
				...sendOptions,
				value
			})
		console.log('#####: getWethReceipt: ', getWethReceipt)

		const approveWethReceipt = await traderContract.methods.approveWeth(value)
			.send({
				...sendOptions
			})
		console.log('#####: approveWethReceipt: ', approveWethReceipt)
	} catch (err) {
		console.log('Error', err)
	}
}

approveWETH(weiValue)
