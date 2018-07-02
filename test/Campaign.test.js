const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '3000000' });

  const etherAmt = web3.utils.toWei('2', 'ether');
  await factory.methods.createCampaign(etherAmt, 'Bulbasaur').send({
    from: accounts[1],
    gas: '3000000'
  });

  //  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
});

describe('Campaigns', () => {
  it('deploys the factory', () => {
    assert.ok(factory.options.address);
  });

  it('marks original sender as contract owner', async () => {
    const owner = await factory.methods.owner().call();
    assert.equal(accounts[0], owner); // (what we hope it is, what it actually is)
  });

  it('creates a new card Struct', async () => {
    const struct = await factory.methods.campaignStructs(0).call();
    //console.log(struct);
    assert.ok(struct);
  });

  it('stores correct Struct Price', async () => {
    const etherAmt = web3.utils.toWei('2', 'ether');
    const struct = await factory.methods.campaignStructs(0).call();
    assert.equal(etherAmt, struct.Price);
  });

  it('stores correct Struct Name', async () => {
    const struct = await factory.methods.campaignStructs(0).call();
    assert.equal('Bulbasaur', struct.Name);
  });

  it('maps id to correct owner address', async () => {
    const struct = await factory.methods.campaignStructs(0).call();
    const ID = struct.Id;
    const cardOwner = await factory.methods.cardToOwner(ID).call();
    assert.equal(accounts[1], cardOwner);
  });

  it('maps id to respective card name', async () => {
    const struct = await factory.methods.campaignStructs(0).call();
    const ID = struct.Id;
    const cardName = await factory.methods.getName(ID).call();
    assert.equal('Bulbasaur', cardName);
  });

  it('maps id to respective card price', async () => {
    const etherAmt = web3.utils.toWei('2', 'ether');
    const struct = await factory.methods.campaignStructs(0).call();
    const ID = struct.Id;
    const cardPrice = await factory.methods.getPrice(ID).call();
    assert.equal(etherAmt, cardPrice);
  });

  it('update owners card count upon new card creation', async () => {
    const cardCount = await factory.methods.ownerCardCount(accounts[1]).call();
    assert.equal('1', cardCount);
  });

  it('update owners created count upon new card creation', async () => {
    const createdCount = await factory.methods
      .createdCardCount(accounts[1])
      .call();
    assert.equal('1', createdCount);
  });

  it('On transfer ownership remapping to new account', async () => {
    const struct = await factory.methods.campaignStructs(0).call();
    const ID = struct.Id;
    const transferred = await factory.methods
      .transfer(accounts[1], accounts[2], ID)
      .send({
        from: accounts[2],
        gas: '3000000',
        value: struct.Price
      });
    const cardOwner = await factory.methods.cardToOwner(ID).call();
    assert.equal(accounts[2], cardOwner);
  });

  it('On transfer money correctly transferred to old owner', async () => {
    const balance = await web3.eth.getBalance(accounts[1]);
    const struct = await factory.methods.campaignStructs(0).call();
    const ID = struct.Id;
    const transferred = await factory.methods
      .transfer(accounts[1], accounts[2], ID)
      .send({
        from: accounts[2],
        gas: '3000000',
        value: struct.Price
      });
    const balance2 = await web3.eth.getBalance(accounts[1]);
    //console.log(balance);
    //console.log(balance2);
    assert(balance2 > balance);
  });

  it('On transfer money correctly reduced from buyers acct', async () => {
    const balance = await web3.eth.getBalance(accounts[2]);
    const struct = await factory.methods.campaignStructs(0).call();
    const ID = struct.Id;
    const transferred = await factory.methods
      .transfer(accounts[1], accounts[2], ID)
      .send({
        from: accounts[2],
        gas: '3000000',
        value: struct.Price
      });
    const balance2 = await web3.eth.getBalance(accounts[2]);
    //console.log(balance);
    //console.log(balance2);
    assert(balance2 < balance);
  });

  it('On transfer buyers Card Count increases by 1', async () => {
    const cardCount = await factory.methods.ownerCardCount(accounts[2]).call();
    const struct = await factory.methods.campaignStructs(0).call();
    const ID = struct.Id;
    const transferred = await factory.methods
      .transfer(accounts[1], accounts[2], ID)
      .send({
        from: accounts[2],
        gas: '3000000',
        value: struct.Price
      });
    const cardCount2 = await factory.methods.ownerCardCount(accounts[2]).call();
    assert(cardCount2 > cardCount);
  });

  it('On transfer old owners Card Count decreases by 1', async () => {
    const cardCount = await factory.methods.ownerCardCount(accounts[1]).call();
    const struct = await factory.methods.campaignStructs(0).call();
    const ID = struct.Id;
    const transferred = await factory.methods
      .transfer(accounts[1], accounts[2], ID)
      .send({
        from: accounts[2],
        gas: '3000000',
        value: struct.Price
      });
    const cardCount2 = await factory.methods.ownerCardCount(accounts[1]).call();
    assert(cardCount2 < cardCount);
  });

  it('Transfer fails if owner tries to buy own card', async () => {
    try {
      const struct = await factory.methods.campaignStructs(0).call();
      const ID = struct.Id;
      const transferred = await factory.methods
        .transfer(accounts[1], accounts[1], ID)
        .send({
          from: accounts[1],
          gas: '3000000',
          value: struct.Price
        });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('Transfer fails if price value sent not enough', async () => {
    try {
      const struct = await factory.methods.campaignStructs(0).call();
      const ID = struct.Id;
      const transferred = await factory.methods
        .transfer(accounts[1], accounts[2], ID)
        .send({
          from: accounts[2],
          gas: '3000000',
          value: struct.Price - 1000000000
        });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  // still need to test ChangePrice module
  // also make sure only card owner can change Price
  // maybe some other small tests too...
});
