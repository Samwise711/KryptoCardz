const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
  .deploy({ data: compiledFactory.bytecode })
  .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1000000'
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );

});

describe('Campaigns', () => {
  it('deploys a factory and campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager); // (what we hope it is, what it actually is)
  });

  it('allows people to contribute money and marks them approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1]   // ganache creates an array of 10 test accts for us to use
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it('ensures minimum contribution value is met', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '5',
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('allows manager ability to make payment request', async () => {
    await campaign.methods
      .createRequest('Buy batteries', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    const request = await campaign.methods.requests(0).call(); //requests(index)
    assert.equal('Buy batteries', request.description); //.description is property of request struct
  });

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      value: web3.utils.toWei('10', 'ether'),
      from: accounts[0]
    });

    await campaign.methods
    .createRequest('Buy TRACTORS', web3.utils.toWei('5', 'ether'), accounts[1])
    .send({from: accounts[0], gas: '1000000' });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.methods.finalizeRequest(0).send({ //finalizeRequest(index_of_Request)
      from: accounts[0], //only manager can finalize request
      gas: '1000000'
    });

    let balance = await web3.eth.getBalance(accounts[1]); //get balance of any address on ethereum, returns string
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance); //steps to convert to number
    console.log(balance);
    assert(balance > 104); //one limitation of Ganache, does not reset account balances between tests
  });

});
