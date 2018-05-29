import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react'; //called import tag
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {   //good example of running function on class, must use static async
  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(  // get array of solidity Structs, trick
      Array(parseInt(requestCount)).fill().map((element, index) => {
        return campaign.methods.requests(index).call()
      })
    );

    return { address, requests, requestCount, approversCount }; //ES6 syntax, no colon if same variable twice
  } //adding the above items to Return object, which get passed to props of Component

  renderRows() { //helper method, iterates over list of requests above array
    return this.props.requests.map((request, index) => {  //must communicate return objects to RequestRow below
      return (
        <RequestRow
        key={index} //React needs a key whenever passing in list of components
        id={index}
        request={request}
        address={this.props.address}
        approversCount={this.props.approversCount}
      />
    );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Requests</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
          <Button primary floated="right" style={{ marginBottom: 10 }}>Add Request</Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>

          <Body>
            {this.renderRows()}
          </Body>
        </Table>
        <div>Found {this.props.requestCount} requests.</div>
      </Layout>
    );
  }
}

// two sets of curly braces indicates one for JSX one for the object

export default RequestIndex;
