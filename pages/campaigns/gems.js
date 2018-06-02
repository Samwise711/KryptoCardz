import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout'; // go up two directories!!
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import axios from 'axios';

import { Router } from '../../routes';
const CLOUD_BUCKET = 'cryptocardz';

import firebase from 'firebase';
var config = {
  apiKey: "AIzaSyAGJM1Uh-9Lg62b-6U6DmiRgKm7ck9gh_g",
  authDomain: "cryptocardz-c5066.firebaseapp.com",
  databaseURL: "https://cryptocardz-c5066.firebaseio.com",
  projectId: "cryptocardz-c5066",
  storageBucket: "cryptocardz-c5066.appspot.com",
  messagingSenderId: "908971455038"
};
//firebase.initializeApp(config);
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

class CampaignNew extends Component {
  static async getInitialProps() {  // static allows one to run class function without creating an instance!!
    const structCount = await factory.methods.getStructCount().call();
    return { structCount };
  }

  state = {
    minimumContribution: '',
    cardName: '',
    errorMessage: '',
    loading: false,
    selectedFile: null
  }; // setting state seamlessly to forms baby!!, event object contains new value

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const number = parseInt(this.props.structCount)+1;
      const formData = new FormData();
      formData.append('image', this.state.selectedFile, number+'.png');
      axios.post('https://us-central1-cryptocardz-c5066.cloudfunctions.net/uploadFile', formData)
        .then(res => {
          console.log(res);
        });

      const accounts = await web3.eth.getAccounts();
      const etherAmt = this.state.minimumContribution;
      await factory.methods
      .createGem(etherAmt, this.state.cardName)
      .send({
        from: accounts[0]
      });



      Router.pushRoute('/'); // automatic routing through app, send to another page
    } catch (err) {
    this.setState({ errorMessage: err.message.split("\n")[0] });
  } // only time we don't have to specify Gas is when process by browser, metamask trick

    this.setState({ loading: false });

  };

  fileChangedHandler = (event) => {
    this.setState({selectedFile: event.target.files[0]})
  };

  render() {
    return (
      <Layout>
        <h3 style={{ marginTop: '25px' }}>Create a Gem Card</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
          <label>Name</label>
          <Input
            value={this.state.cardName}
            onChange={event =>
              this.setState({ cardName: event.target.value })}
            />

              <label></label>
              <br></br>
              <label>Gem Id</label>
              <Input
                value={this.state.minimumContribution}
                onChange={event =>
                  this.setState({ minimumContribution: event.target.value })}
                />
                <label></label>
                <br></br>
                <label>Upload Image</label>
                <div>
                    <input type="file" onChange={this.fileChangedHandler} />

                </div>


          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>Create!</Button>
        </Form>

      </Layout>
    );
  } // double !! turns string into equivalent boolean value!!
}

export default CampaignNew;
