import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';
import Campaign from '../ethereum/campaign';
//import testImage from '../images/6.png';

// class based component

class Images extends Component {


  render() {
    return (
    <Layout>
      <div>
        <h3>Images Storage</h3>
      </div>
    </Layout>
    );
  }
}

export default Images;

// Next also requires react component to be exported for each wep page file,
// as seen on line 17

//npm run dev => starts web app
