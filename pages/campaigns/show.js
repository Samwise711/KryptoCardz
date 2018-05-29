import React, { Component } from 'react';
import Layout from '../../components/Layout'; //layout should always be most topmost component
//import Campaign from '../../ethereum/campaign';
import factory from '../../ethereum/factory';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import BuyForm from '../../components/BuyForm';
import { Link } from '../../routes';

class CampaignShow extends Component {
  static async getInitialProps(props) {  // getInitialProps runs before app page loads...helps
    const managerAddress = await factory.methods.getManager(props.query.address).call(); // address actually is Id of Struct, based on routes setup
    const cardTitle = await factory.methods.getCardName(props.query.address).call(); // address actually is Id of Struct, based on routes setup
    const cardIdentity= await factory.methods.getCardId(props.query.address).call(); // address actually is Id of Struct, based on routes setup
    const cardValue = await factory.methods.getCardPrice(props.query.address).call(); // address actually is Id of Struct, based on routes setup
    return {
      address: props.query.address,
      price: web3.utils.fromWei(cardValue, 'ether'),
      manager: managerAddress,
      cardName: cardTitle,
      cardId: cardIdentity
    };  // next requires return object
  }

  renderCards() {
    const {
      address,
      cardName,
      manager,
      price,
      cardId
    } = this.props;

    const items = [
      {
        header: cardName,
        meta: 'Name of Card',
        description: 'This card can be traded, sold, or kept forever to accumulate in value',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: manager,
        meta: 'Address of Manager',
        description: 'The manager is the one who created or now owns this card',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: price,
        meta: 'Price (ether)',
        description: 'The amount a user must pay to take ownership of this card',
        style: { overflowWrap: 'break-word' }
      }

    ];

    return <Card.Group items={items} />;
    }

    renderImage() {

      const items = [
        {
          image: <img src={'https://storage.googleapis.com/cryptocardz-c5066.appspot.com/'+(parseInt(this.props.cardId))+'.png'} width="225" style={{marginLeft: '28px', marginTop: '55px', marginBottom: '55px', marginRight: '15px' }}/>

          //image: <img src={'https://storage.googleapis.com/cryptocardz-c5066.appspot.com/'+(parseInt(this.props.cardId))+'.png'} height="225" width="225" style={{marginLeft: '7px'}} />
}

      ];

      return <Card.Group items={items} />;
      }

  render() {

    return (
      <Layout>
        <h3 style={{ marginTop: '25px' }}>Card Details</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={5}>
              {this.renderImage()}
            </Grid.Column>
            <Grid.Column width={5}>
              {this.renderCards()}
            </Grid.Column>
            <Grid.Column width={6}>
              <BuyForm address={this.props.address} />
              <h1> </h1>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
