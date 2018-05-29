import React,{ Component } from 'react';
import { Table, Button, Message } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { Router } from '../routes';

class RequestRow extends Component {
  state = {
    loading: false,
    loading2: false,
  };

  onApprove = async () => { //have to import new instance of Campaign
    const campaign = Campaign(this.props.address);

    this.setState({ loading: true });

    try {
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0]
    });


  } catch (err) {
  }

  this.setState({ loading: false });
  Router.pushRoute(`/campaigns/${this.props.address}/requests`);

};

  onFinalize = async () => { //asynchronous arrow function, NOTICE how I have to import campaign again for new function
    const campaign = Campaign(this.props.address);


    this.setState({ loading2: true});

    try {
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0]
    });


  } catch (err) {

  }

  this.setState({ loading2: false });
  Router.pushRoute(`/campaigns/${this.props.address}/requests`);

};

  render() {

    const { Row, Cell } = Table; //sanction off the props of Table we exactly want, so we can shorthand later on
    const { id, request, approversCount } = this.props; // also called destructuring, pulling off the props object from index.js you need
    const readyToFinalize = request.approvalCount > approversCount / 2;

    return (
      <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{request.approvalCount}/{approversCount}</Cell>
        <Cell>
          {request.complete ? null : (
            <Button color='green' loading={this.state.loading} basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
          <Button color='teal' loading={this.state.loading2} basic onClick={this.onFinalize}>
            Finalize
          </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
