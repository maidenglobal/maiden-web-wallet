const Web3 = require('web3')
const Tx = require('ethereumjs-tx')
const config = require('./secure-config.json')

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/tBZ5seblTdsWRfzyNu9j'))

const addressFrom = '0x1889EF49cDBaad420EB4D6f04066CA4093088Bbd'
const addressTo = '0x1463500476a3ADDa33ef1dF530063fE126203186'
const amount = web3.utils.toWei(123, 'wei')

function sendSigned(txData, cb) {
  const privateKey = new Buffer(config.privKey, 'hex')
  const transaction = new Tx(txData)
  transaction.sign(privateKey)
  const serializedTx = transaction.serialize().toString('hex')
  web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
}

web3.eth.getTransactionCount(addressFrom).then(txCount => {

  const txData = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(25000),
    gasPrice: web3.utils.toHex(10e9), // 10 Gwei
    to: addressTo,
    from: addressFrom,
    value: web3.utils.toHex(amount)
  }

  sendSigned(txData, function(err, result) {
    if (err) return console.log('error', err)
    console.log('sent', result)
  })

})

