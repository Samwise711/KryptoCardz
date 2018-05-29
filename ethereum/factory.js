import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  //'0x17bCC048b37794b22fF7392Ac1f0Cf490B4F2F3a'  //must update this address everytime we re-compile and redeploy
  //'0xB396BD51C22447787EbdbF2477ee9E483f09eb1e'
  //'0x2A4c2E390799Db35c8C7366a322a592b87f299bE'
  //'0xD0De04434242dc132eb456c0Bc647e3B82e6edFC'
  //'0xD5511767Ef67dEBA23B7192F669ec614bAbB4D87'
  //'0x7f403E3Ce37BdC3D9A5B48530677f3F28D69c622'
  //'0x02323d7349B35b277aB24eB1473683C4Fba0013d'
  //'0x56fbF3139253ee80A1aa0870d0746eA21cF12972'
  '0x627461bA197209796C1a9013126183CeF1C46ad3'
);

export default instance;
