import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react'; //Message is to handle errors
//import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';
import factory from '../ethereum/factory';

class ContributeForm extends Component {
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
      const newPrice = web3.utils.toWei(this.state.value, 'ether');
      await factory.methods.changePrice(newPrice, this.props.address).send({
        from: accounts[0]
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
          <label>Change Price (MANAGER ONLY): </label>
            <Input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value})}
              label="ether"
              labelPosition="right"
            />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button primary loading={this.state.loading}>
          Update
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
