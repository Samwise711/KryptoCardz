import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react'; //Message is to handle errors
//import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';
import factory from '../ethereum/factory';

class BuyForm extends Component {
  state = {
    value: '',
    errorMessage: '',
    loading: false
  };


  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      const managerAddress = await factory.methods.getManager(this.props.address).call(); // address actually is Id of Struct, based on routes setup
      const cardValue = await factory.methods.getCardPrice(this.props.address).call(); // address actually is Id of Struct, based on routes setup
      await factory.methods.transfer( managerAddress, accounts[0], this.props.address).send({
        from: accounts[0],
        value: cardValue
      });
      /*
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });
      */

      Router.replaceRoute(`/campaigns/${this.props.address}`) //refresh page, cool, reruns script to update ethereum info!!
    } catch (err) {
      this.setState({ errorMessage: err.message.split("\n")[0] });
    }

    this.setState({ loading: false, value: '' });

  };


  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>

        <Form.Field>
          <Button fluid positive loading={this.state.loading}>
            Purchase this card!
          </Button>
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />
      </Form>
    );
  }
}

export default BuyForm;
