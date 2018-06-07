import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Form, Input, Card, Button, Grid, Message } from 'semantic-ui-react';
import Layout from '../components/LayoutSearch';
import { Link } from '../routes';
//import Campaign from '../ethereum/campaign';
//import axios from 'axios';
import web3 from '../ethereum/web3';
import SearchSortPart from '../components/SearchSortPart';



// class based component

class CampaignIndex extends Component {

  state = {
    searchValue: '',
    sortBy1: 'created',
    sortBy2: 'Low to high',
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
    let { sortBy1, sortBy2, searchValue } = this.state;

    //const accounts = await web3.eth.getAccounts();
    //const ownerCards = await factory.methods.getCardsByOwner(accounts[0]).call();

    let items = this.props.allStructs.map((request, index) => {
          return {

            image: <img src={'https://storage.googleapis.com/cryptocardz-c5066.appspot.com/'+(parseInt(request.Id)+1)+'.png'} width="150" style={{ marginLeft: '70px', marginTop: '15px', marginBottom: '15px', pointerEvents: 'none' }}/>,
            header: request.Name,
            meta: web3.utils.fromWei(request.Price, 'ether')+" ETH",
            href: `/campaigns/${request.Id}`,
            created: request.CreatedDate,
            //fluid: true  // causes cards to go full width of frame
          };
    });
    items.sort( (a,b) => {
      if (a[sortBy1] > b[sortBy1]) return 1;
      if (a[sortBy1] < b[sortBy1]) return - 1;
      if (a[sortBy1] === b[sortBy1]) return 0;
    })

    if (sortBy2 === 'High to low') items.reverse()

    if (searchValue !== '') {
      items = items.filter( item =>
        item.header
          .toLowerCase()
          .includes(searchValue.toLowerCase()))
    }

    return <Card.Group items={items} />;
  }



  render() {
    let { searchValue } = this.state;
    let searchHandler = (event) => this.setState({ searchValue: event.target.value});
    let sort1Handler = (event, data) => this.setState({ sortBy1: data.value})
    let sort2Handler = (event, data) => this.setState({sortBy2: data.value})

    return (
    <Layout>
      <div style={{ marginTop: '25px' }}>
        <h3>Marketplace</h3>
        <Message>
          <Message.Header>Site Requirements</Message.Header>
            <p>
              Please be using MetaMask and the Ropsten Test Net to interact with this application. Otherwise errors may be thrown.
            </p>
        </Message>

        <Grid>
          <SearchSortPart
              searchHandler={searchHandler}
              searchValue={searchValue}
              sort1Handler={sort1Handler}
              sort2Handler={sort2Handler}
          />
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
