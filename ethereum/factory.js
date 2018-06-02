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
  //'0x627461bA197209796C1a9013126183CeF1C46ad3'
  //'0x91bc48d73C91Ac9db284c0D9CeEF6cd516Dc04be' // on Ropsten
  //'0x14dca51cd08997685030503FE6bE0a319c4935c0'
  //'0xBE3e64651d262713f6E01Be7b8E2e4787E5B5D93'
  //'0x7FF6DAD40e4D53ac615EDBbf41aD1fA88edc3933'
  //'0x363cA150D0ae108F046E60c632210dcf62A95776'
  '0xee5BE9def4CBC5DCA5F8dbD8a7d180DE78fdD264'
);

export default instance;
