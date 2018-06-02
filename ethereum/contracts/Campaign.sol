pragma solidity ^0.4.17;

contract GemInterface {
  function getGem(uint _id) public view returns (
    uint morphTime,
    uint price,
    uint rarity,
    uint id,
    address owner
  );
}

contract CampaignFactory {

    address ckAddress = 0x6478F69CC8Da40031d7AaEe77BDfD50015e75237;
    GemInterface gemContract = GemInterface(ckAddress);

    address public owner;

    function CampaignFactory() public {
        owner = msg.sender;
      }

    struct CampaignDetails {
        string Name;
        uint Id;
        uint Price;
        uint CreatedDate;
    }

    address[] public deployedCampaigns;
    CampaignDetails[] public campaignStructs;
    mapping (uint => address) public cardToOwner;
    mapping (address => uint) public ownerCardCount;
    mapping (address => uint) public createdCardCount;
    mapping (address => uint) public soldCardCount;
    mapping (uint => string) public getName;
    mapping (uint => uint) public getId;
    mapping (uint => uint) public getPrice;



    modifier onlyOwnerOf(uint _cardId) {
        require(msg.sender == cardToOwner[_cardId]);
        _;
      }

    function createCampaign(uint minimum, string name) public {

        CampaignDetails memory newStruct = CampaignDetails({
            Name: name,
            Id: campaignStructs.length,
            Price: minimum,
            CreatedDate: now

        });

        uint id = campaignStructs.push(newStruct) - 1;
        cardToOwner[id] = msg.sender;
        getName[id] = name;
        getId[id] = campaignStructs.length;
        getPrice[id] = minimum;

        ownerCardCount[msg.sender] = ownerCardCount[msg.sender] + 1;
        createdCardCount[msg.sender] = createdCardCount[msg.sender] + 1;

    }

    function createGem(uint _gemId, string name) public {

        uint gemPrice;
        uint gemRarity;
        address gemOwner;
        (,gemPrice,,,) = gemContract.getGem(_gemId);
        (,,gemRarity,,) = gemContract.getGem(_gemId);
        (,,,,gemOwner) = gemContract.getGem(_gemId);

        CampaignDetails memory newStruct = CampaignDetails({
            Name: name,
            Id: campaignStructs.length,
            Price: gemPrice,
            CreatedDate: gemRarity

        });

        uint id = campaignStructs.push(newStruct) - 1;
        cardToOwner[id] = gemOwner;
        getName[id] = name;
        getId[id] = campaignStructs.length;
        getPrice[id] = gemPrice;

        ownerCardCount[gemOwner] = ownerCardCount[gemOwner] + 1;

    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }

    function getStructCount() public view returns (uint) {
        return campaignStructs.length;
    }

    function getManager(uint _id) public view returns (address) {
        return cardToOwner[_id];
    }

    function getCardName(uint _id) public view returns (string) {
        return getName[_id];
    }

    function getCardId(uint _id) public view returns (uint) {
        return getId[_id];
    }

    function getCardPrice(uint _id) public view returns (uint) {
        return getPrice[_id];
    }

    function getCardsByOwner(address _owner) public view returns(uint[]) {
        uint[] memory result = new uint[](ownerCardCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < campaignStructs.length; i++) {
          if (cardToOwner[i] == _owner) {
            result[counter] = i;
            counter++;
          }
        }
        return result;
      }



    function transfer(address _from, address _to, uint256 _tokenId) public payable {
        // _from = cardToOwner[id], _to = msg.sender, id = _tokenId
        require(msg.value == getPrice[_tokenId]);
        require(msg.sender != cardToOwner[_tokenId]);
        _from.transfer(msg.value);
        ownerCardCount[_to] = ownerCardCount[_to] + 1;
        ownerCardCount[_from] = ownerCardCount[_from] - 1;
        cardToOwner[_tokenId] = _to;
        soldCardCount[_from] = soldCardCount[_from] + 1;
      }

    function changePrice(uint newPrice, uint _id) public onlyOwnerOf(_id) {
        CampaignDetails storage myCard = campaignStructs[_id];
        getPrice[_id] = newPrice;
        myCard.Price = newPrice;
    }

    function getCreatedCount(address _address) public view returns (uint) {
        return createdCardCount[_address];
    }

    function getSoldCount(address _address) public view returns (uint) {
        return soldCardCount[_address];
    }


}
