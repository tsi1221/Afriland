import React, { Component } from "react";
import Land from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";

import "../index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { DrizzleProvider } from "drizzle-react";
import { Spinner } from "react-bootstrap";
import {
  LoadingContainer,
  ContractData,
} from "drizzle-react-components";

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

const drizzleOptions = { contracts: [Land] };

class TransactionInfo extends Component {
  state = {
    LandInstance: null,
    web3: null,
    account: null,
    verified: false,
    landsCount: 0,
  };

  landTransfer = (landId, newOwner) => async () => {
    const { LandInstance, account } = this.state;
    await LandInstance.methods.LandOwnershipTransfer(landId, newOwner).send({
      from: account,
      gas: 2100000,
    });
    window.location.reload(false);
  };

  componentDidMount = async () => {
    try {
      // Refresh page once
      if (!window.location.hash) {
        window.location.hash = "#loaded";
        window.location.reload();
      }

      // Initialize web3 and contract
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const currentAddress = await web3.currentProvider.selectedAddress;

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Land.networks[networkId];
      const LandInstance = new web3.eth.Contract(
        Land.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({ web3, account: accounts[0], LandInstance });

      // Check if current account is a verified land inspector
      const verified = await LandInstance.methods
        .isLandInspector(currentAddress)
        .call();
      this.setState({ verified });

      // Get total number of lands
      const landsCount = parseInt(await LandInstance.methods.getLandsCount().call());
      this.setState({ landsCount });
    } catch (error) {
      alert("Failed to load web3, accounts, or contract. Check console for details.");
      console.error(error);
    }
  };

  renderLandRows = () => {
    const { LandInstance, landsCount } = this.state;
    const landRows = [];

    for (let i = 1; i <= landsCount; i++) {
      const owner = <ContractData contract="Land" method="getLandOwner" methodArgs={[i]} />;
      const area = <ContractData contract="Land" method="getArea" methodArgs={[i]} />;
      const city = <ContractData contract="Land" method="getCity" methodArgs={[i]} />;
      const state = <ContractData contract="Land" method="getState" methodArgs={[i]} />;
      const price = <ContractData contract="Land" method="getPrice" methodArgs={[i]} />;
      const pid = <ContractData contract="Land" method="getPID" methodArgs={[i]} />;
      const survey = <ContractData contract="Land" method="getSurveyNumber" methodArgs={[i]} />;

      landRows.push(
        <tr key={i}>
          <td>{i}</td>
          <td>{owner}</td>
          <td>{area}</td>
          <td>{city}</td>
          <td>{state}</td>
          <td>{price}</td>
          <td>{pid}</td>
          <td>{survey}</td>
          <td>
            <Button
              onClick={this.landTransfer(i, "0xRecipientAddress")} // Replace with actual recipient logic
              className="button-vote"
            >
              Verify Transfer
            </Button>
          </td>
        </tr>
      );
    }

    return landRows;
  };

  render() {
    const { web3, verified } = this.state;

    if (!web3)
      return (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      );

    if (!verified)
      return (
        <div className="content">
          <Row>
            <Col xs="12" className="text-center">
              <Card>
                <CardBody>
                  <h3>You are not verified to view this page</h3>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      );

    return (
      <DrizzleProvider options={drizzleOptions}>
        <LoadingContainer>
          <div className="content">
            <Row>
              <Col xs="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h5">Lands Information</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Table className="tablesorter" responsive>
                      <thead className="text-primary">
                        <tr>
                          <th>#</th>
                          <th>Owner</th>
                          <th>Area</th>
                          <th>City</th>
                          <th>State</th>
                          <th>Price</th>
                          <th>Property PID</th>
                          <th>Survey Number</th>
                          <th>Verify Land Transfer</th>
                        </tr>
                      </thead>
                      <tbody>{this.renderLandRows()}</tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </LoadingContainer>
      </DrizzleProvider>
    );
  }
}

export default TransactionInfo;
