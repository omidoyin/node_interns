const { Alchemy, Network, Wallet, Utils } = require("alchemy-sdk");

// Replace with your Alchemy API key
const alchemy = new Alchemy({
  apiKey: "MkI3METXZ_SaxAfLDPExL9nzVzbLXo9G",
  network: Network.ETH_MAINNET, // Specify the network you're working with
});

// Example: Creating a wallet
function createWallet() {
  const wallet = Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

// Example: Getting balance
async function getBalance(address) {
  const balance = await alchemy.core.getBalance(address);
  return Utils.formatEther(balance);
}

// Example: Transferring tokens
async function transferTokens(privateKey, toAddress, amount) {
  const wallet = new Wallet(privateKey, alchemy);
  const tx = {
    to: toAddress,
    value: Utils.parseEther(amount.toString()),
    gasLimit: 21000,
  };

  const response = await wallet.sendTransaction(tx);
  return response.hash;
}

module.exports = {
  createWallet,
  getBalance,
  transferTokens,
};
