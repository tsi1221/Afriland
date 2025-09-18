import React, { Component } from "react";
import Land from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { DrizzleProvider } from 'drizzle-react';
import { Spinner } from 'react-bootstrap';
import { LoadingContainer, ContractData } from 'drizzle-react-components';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";
import "../index.css";

const drizzleOptions = {
  contracts: [Land]
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      LandInstance: null,
      account: null,
      web3: null,
      registered: false,
      lands: [], // store land data here
    };
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Land.networks[networkId];
      const instance = new web3.eth.Contract(Land.abi, deployedNetwork && deployedNetwork.address);

      const currentAddress = await web3.currentProvider.selectedAddress;
      const registered = await instance.methods.isBuyer(currentAddress).call();
      const count = parseInt(await instance.methods.getLandsCount().call());

      const lands = [];
      for (let i = 1; i <= count; i++) {
        const owner = await instance.methods.getLandOwner(i).call();
        const price = await instance.methods.getPrice(i).call();
        const paid = await instance.methods.isPaid(i).call();
        lands.push({ id: i, owner, price, paid });
      }

      this.setState({ LandInstance: instance, web3, account: accounts[0], registered, lands });

    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  makePayment = (seller_address, amount, land_id) => async () => {
    const etherAmount = amount * 0.0000057;
    await this.state.LandInstance.methods.payment(seller_address, land_id).send({
      from: this.state.account,
      value: this.state.web3.utils.toWei(etherAmount.toString(), "ether"),
      gas: 2100000
    });
    // Update payment status in state
    this.setState(prevState => ({
      lands: prevState.lands.map(land =>
        land.id === land_id ? { ...land, paid: true } : land
      )
    }));
  }

  render() {
    const { web3, registered, lands } = this.state;

    if (!web3) return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
    if (!registered) return (
      <div className="content text-center mt-5">
        <Card className="card-chart mx-auto" style={{ maxWidth: "600px" }}>
          <CardBody>
            <h3>You are not verified to view this page</h3>
          </CardBody>
        </Card>
      </div>
    );

    return (
      <div className="content">
        <DrizzleProvider options={drizzleOptions}>
          <LoadingContainer>
            <Row>
              <Col lg="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">
                      Payment for Lands <span className="duration">₹ 1 = 0.0000057 Ether</span>
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Table className="tablesorter" responsive color="black">
                      <thead className="text-primary">
                        <tr>
                          <th>#</th>
                          <th>Land Owner</th>
                          <th>Price (₹)</th>
                          <th>Make Payment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lands.map(land => (
                          <tr key={land.id}>
                            <td>{land.id}</td>
                            <td>{land.owner}</td>
                            <td>{land.price}</td>
                            <td>
                              <Button
                                onClick={this.makePayment(land.owner, land.price, land.id)}
                                disabled={land.paid}
                                className="btn btn-success"
                              >
                                {land.paid ? "Paid" : "Make Payment"}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </LoadingContainer>
        </DrizzleProvider>
      </div>
    );
  }
}

export default Dashboard;
