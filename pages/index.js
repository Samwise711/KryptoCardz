import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/LayoutSearch';
import { Link } from '../routes';
//import Campaign from '../ethereum/campaign';
//import axios from 'axios';
import web3 from '../ethereum/web3';

// class based component

class CampaignIndex extends Component {

  static async getInitialProps() {  // static allows one to run class function without creating an instance!!

    //const campaigns = await factory.methods.getDeployedCampaigns().call();
    const structCount = await factory.methods.getStructCount().call();
    const allStructs = await Promise.all(  // get array of solidity Structs, trick
      Array(parseInt(structCount)).fill().map((element, index) => {
        return factory.methods.campaignStructs(index).call()

      })
    );

    const sortedArray = allStructs.sort(function(a, b) {
      return a.Price - b.Price;
    });

    const searchTerm = "saur"

    const searchArray = allStructs.filter(function(v) {
    return Object.keys(v).some(function(k) {
      return v[k].toLowerCase().indexOf(searchTerm) > -1;
    })
  });

    return { allStructs, sortedArray, searchArray };
  }

//dynamically compute route for description tag below
  renderCampaigns() {

    //const accounts = await web3.eth.getAccounts();
    //const ownerCards = await factory.methods.getCardsByOwner(accounts[0]).call();

    const items = this.props.searchArray.map((request, index) => {
          return {

            image: <img src={'https://storage.googleapis.com/cryptocardz-c5066.appspot.com/'+(parseInt(request.Id)+1)+'.png'} width="150" style={{ marginLeft: '35px', marginTop: '15px', marginBottom: '15px' }}/>,
            header: request.Name,
            meta: web3.utils.fromWei(request.Price, 'ether')+" ETH",
            href: `/campaigns/${request.Id}`
            //fluid: true  // causes cards to go full width of frame
          };
    });

    return <Card.Group items={items} itemsPerRow={4} />;

  }



  render() {
    return (
    <Layout>
      <div style={{ marginTop: '25px' }}>
        <h3>Marketplace</h3>
        <Link route="/campaigns/new">
          <a>
            <Button floated="right" content="Create Card" icon="add" primary/>
          </a>
        </Link>
        {this.renderCampaigns()}
      </div>
    </Layout>
    );
  }
}

export default CampaignIndex;

// Next also requires react component to be exported for each wep page file,
// as seen on line 17

//npm run dev => starts web app
