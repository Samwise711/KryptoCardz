import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react'; //Message is to handle errors
//import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';
import factory from '../ethereum/factory';

class SearchForm extends Component {
  state = {
    value: ''
    //errorMessage: '',
  //  loading: false
  };

  onSubmit = async (event) => {
    event.preventDefault();

    //this.setState({ loading: true, errorMessage: '' });

    //try {
      Router.replaceRoute(`/search/${this.state.value}`);
      /*
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });
      */

       //refresh page, cool, reruns script to update ethereum info!!
    /*
    } catch (err) {
      this.setState({ errorMessage: err.message.split("\n")[0] });
    }

    this.setState({ loading: false, value: '' });
    */
  };



  render() {
    return (
      <Form onSubmit={this.onSubmit}>

        <Form.Field>
          <label>Search Cards by Name: </label>
            <Input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value})}
            />
        </Form.Field>
        <Button primary>
          Search
        </Button>
      </Form>
    );
  }
}

export default SearchForm;
