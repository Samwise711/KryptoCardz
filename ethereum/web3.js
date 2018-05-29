import Web3 from 'web3';

let web3; // let means you plan on chaning variable value along the way

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // we are in browser and metamask is running
  web3 = new Web3(window.web3.currentProvider);
} else {
  // we are on the server or user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/JFy6fh9FoWmkxHXGR0JC' // portal to get access to Ethereum network
  ); // url of infura node

  web3 = new Web3(provider);
}

export default web3;
