/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');

const Registry = artifacts.require('Registry.sol');
const Token = artifacts.require('ERC20Plus.sol');
const PLCRVoting = artifacts.require('PLCRVoting.sol');
const GOV = artifacts.require('GOV.sol');

const config = JSON.parse(fs.readFileSync('./DeployedAddresses.json'));

module.exports = done => {
	async function GOVdelegate() {
		let GOVTokenAddress = config.GOVTokenAddress;
		const govToken = await GOV.at(GOVTokenAddress);

		to = process.argv.slice(-2)[0];
		amount = process.argv.slice(-2)[1];

		oldBalanceOfTo = await govToken.balanceOf(to);
		console.log('Old balance of reciever: ', new BN(oldBalanceOfTo).toString());

		delegationResp = await govToken.delegate(to, amount);

		newBalanceOfTo = await govToken.balanceOf(to);
		console.log('New balance of reciever: ', new BN(newBalanceOfTo).toString());

		console.log('bla');
		done();
	}

	GOVdelegate().then(() => done());
};