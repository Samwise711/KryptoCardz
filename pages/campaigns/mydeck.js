import React, { Component } from 'react';
import factory from '../../ethereum/factory';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Link } from '../../routes';
//import Campaign from '../../ethereum/campaign';
//import axios from 'axios';
import web3 from '../../ethereum/web3';

// class based component

class CampaignIndex extends Component {

  static async getInitialProps() {  // static allows one to run class function without creating an instance!!

    //const campaigns = await factory.methods.getDeployedCampaigns().call();
    const accounts = await web3.eth.getAccounts();
    const ownerCards = await factory.methods.getCardsByOwner(accounts[0]).call();
    const createdCount = await factory.methods.getCreatedCount(accounts[0]).call();
    const soldCount = await factory.methods.getSoldCount(accounts[0]).call();
    const structCount = await factory.methods.getStructCount().call();
    const allStructs = await Promise.all(  // get array of solidity Structs, trick
      Array(parseInt(structCount)).fill().map((element, index) => {
        return factory.methods.campaignStructs(index).call()
      })
    );

    //const test = [1,3,5];
    const newArray = await [];
    const doIt = await ownerCards.forEach(function(element) {
      newArray.push(allStructs[element]);
    });

    var title = 'Cards Total';
    if (newArray.length == 1) {
      title = 'Card Total';
    }

    return { allStructs, newArray, title, createdCount, soldCount };
  }

//dynamically compute route for description tag below
  renderCampaigns() {

    //const accounts = await web3.eth.getAccounts();
    //const ownerCards = await factory.methods.getCardsByOwner(accounts[0]).call();

    const items = this.props.newArray.map((request, index) => {
          return {
            image: <img src={'https://storage.googleapis.com/cryptocardz-c5066.appspot.com/'+(parseInt(request.Id)+1)+'.png'} width="150" style={{ marginLeft: '50px', marginTop: '15px', marginBottom: '15px' }}/>,
            header: request.Name,
            meta: web3.utils.fromWei(request.Price, 'ether')+" ETH",
            href: `/campaigns/${request.Id}`
            //fluid: true  // causes cards to go full width of frame
          };
    });

    return <Card.Group items={items} itemsPerRow={3} />;

  }



  render() {
    return (
    <Layout>
      <h3 style={{ marginTop: '25px' }}>My Deck</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            {this.renderCampaigns()}
          </Grid.Column>
          <Grid.Column width={4}>
          <div class="right floated left aligned six wide column">
          <div class="ui segment">
            <h3 align="center">Statistics</h3>
            <div class="ui horizontal statistics">
              <div class="statistic">
                <div class="value">
                  {this.props.newArray.length}
                </div>
                <div class="label">
                  {this.props.title}
                </div>
              </div>
              <div class="statistic">
                <div class="value">
                  {this.props.createdCount}
                </div>
                <div class="label">
                  Created
                </div>
              </div>
              <div class="statistic">
                <div class="value">
                  {this.props.soldCount}
                </div>
                <div class="label">
                  Sold
                </div>
              </div>

          </div>
        </div>

          </div>
          </Grid.Column>
        </Grid.Row>

      </Grid>

    </Layout>
    );
  }
}

export default CampaignIndex;

// Next also requires react component to be exported for each wep page file,
// as seen on line 17

//npm run dev => starts web app
