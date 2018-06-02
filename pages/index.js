import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Form, Input, Card, Button, Grid } from 'semantic-ui-react';
import Layout from '../components/LayoutSearch';
import { Link } from '../routes';
//import Campaign from '../ethereum/campaign';
//import axios from 'axios';
import web3 from '../ethereum/web3';

// class based component

class CampaignIndex extends Component {

  state = {
    value: ''
  };

  static async getInitialProps() {  // static allows one to run class function without creating an instance!!

    //const campaigns = await factory.methods.getDeployedCampaigns().call();
    const structCount = await factory.methods.getStructCount().call();
    const allStructs = await Promise.all(  // get array of solidity Structs, trick
      Array(parseInt(structCount)).fill().map((element, index) => {
        return factory.methods.campaignStructs(index).call()

      })
    );

    /*
    const sortedArray = allStructs.sort(function(a, b) {
      return a.Price - b.Price;
    });

    const searchTerm = "saur"

    const searchArray = allStructs.filter(function(v) {
    return Object.keys(v).some(function(k) {
      return v[k].toLowerCase().indexOf(searchTerm) > -1;
    })
  });

  */

    return { allStructs };
  }

//dynamically compute route for description tag below
  renderCampaigns() {

    //const accounts = await web3.eth.getAccounts();
    //const ownerCards = await factory.methods.getCardsByOwner(accounts[0]).call();

    const items = this.props.allStructs.map((request, index) => {
          return {

            image: <img src={'https://storage.googleapis.com/cryptocardz-c5066.appspot.com/'+(parseInt(request.Id)+1)+'.png'} width="150" style={{ marginLeft: '70px', marginTop: '15px', marginBottom: '15px', pointerEvents: 'none' }}/>,
            header: request.Name,
            meta: web3.utils.fromWei(request.Price, 'ether')+" ETH",
            href: `/campaigns/${request.Id}`
            //fluid: true  // causes cards to go full width of frame
          };
    });

    return <Card.Group items={items} />;


  }



  render() {
    return (
    <Layout>

      <div style={{ marginTop: '25px' }}>



        <h3>Marketplace</h3>

        <Grid>
          <Grid.Row>
            <Grid.Column width={5}>
        <Form>
          <Form.Field>
            <Input
            className='icon'
            placeholder='Search by name...'
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value})}
              />
          </Form.Field>
        </Form>
        </Grid.Column>

        <Grid.Column width={8}>
        <div style={{ float: 'left', marginLeft: '-25px' }}>
        <Link route={`/search/${this.state.value}`} >
          <a>
            <Button floated="right" content="Search" />
          </a>
        </Link>
        </div>

        </Grid.Column>

        <Grid.Column width={3}>

        <div style={{ float: 'right' }}>
        <Link route="/campaigns/new">
          <a>
            <Button floated="right" content="Create Card" icon="add" primary/>
          </a>
        </Link>
        </div>

        </Grid.Column>
        </Grid.Row>

        <Grid.Row>
        <div style={{ marginLeft: '15px', marginTop: '10px', marginRight: '15px' }}>
            {this.renderCampaigns()}
          </div>
        </Grid.Row>
        </Grid>
      </div>
    </Layout>
    );
  }
}

export default CampaignIndex;

// Next also requires react component to be exported for each wep page file,
// as seen on line 17

//npm run dev => starts web app
