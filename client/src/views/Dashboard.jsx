import React, { Component } from "react";
import Land from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import { Button, Card, CardHeader, CardBody, Table, Row, Col } from "reactstrap";

class Dashboard extends Component {
  state = { web3: null, account: null, landInstance: null, registered: false, verified: false, lands: [], stats: {} };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Land.networks[networkId];

      if (!deployedNetwork) throw new Error("Contract not deployed on this network");

      const landInstance = new web3.eth.Contract(Land.abi, deployedNetwork.address);

      const verified = await landInstance.methods.isVerified(account).call();
      const registered = await landInstance.methods.isBuyer(account).call();

      const stats = {
        sellers: await landInstance.methods.getSellersCount().call(),
        lands: await landInstance.methods.getLandsCount().call(),
        requests: await landInstance.methods.getRequestsCount().call(),
      };

      this.setState({ web3, account, landInstance, verified, registered, stats }, this.loadLands);
    } catch (err) {
      console.error(err);
      alert("Failed to load Web3 or contract. Check console.");
    }
  };

  loadLands = async () => {
    const { landInstance } = this.state;
    const count = await landInstance.methods.getLandsCount().call();
    const lands = [];

    for (let i = 1; i <= count; i++) {
      const owner = await landInstance.methods.getLandOwner(i).call();
      const requested = await landInstance.methods.isRequested(i).call();
      lands.push({ id: i, owner, requested });
    }
    this.setState({ lands });
  };

  requestLand = (owner, landId) => async () => {
    const { landInstance, account } = this.state;
    try {
      await landInstance.methods.requestLand(owner, landId).send({ from: account });
      this.loadLands();
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  render() {
    const { registered, verified, lands, stats } = this.state;

    if (!registered) return <h3 className="mt-5 text-center">You are not registered to view this page</h3>;

    return (
      <div className="content">
        <Row>
          <Col lg="4"><Card className="p-3 text-center">Total Sellers: {stats.sellers}</Card></Col>
          <Col lg="4"><Card className="p-3 text-center">Registered Lands: {stats.lands}</Card></Col>
          <Col lg="4"><Card className="p-3 text-center">Total Requests: {stats.requests}</Card></Col>
        </Row>

        <Row className="mt-4">
          <Col lg="12">
            <Card>
              <CardHeader>Available Lands</CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr><th>#</th><th>Owner</th><th>Request</th></tr>
                  </thead>
                  <tbody>
                    {lands.map(land => (
                      <tr key={land.id}>
                        <td>{land.id}</td>
                        <td>{land.owner}</td>
                        <td>
                          <Button
                            color="success"
                            onClick={this.requestLand(land.owner, land.id)}
                            disabled={!verified || land.requested}
                          >
                            Request Land
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
      </div>
    );
  }
}

export default Dashboard;
