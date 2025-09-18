// src/views/SDash.jsx
import React, { Component } from "react";
import Land from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import "bootstrap/dist/css/bootstrap.min.css";
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
import "../card.css";
import "../index.css";

class SDash extends Component {
  state = {
    web3: null,
    account: null,
    landInstance: null,
    verified: false,
    registered: false,
    rowData: [],
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Land.networks[networkId];
      if (!deployedNetwork) throw new Error("Contract not deployed on this network");

      const landInstance = new web3.eth.Contract(Land.abi, deployedNetwork.address);

      // Check verification and registration
      const verified = await landInstance.methods.isVerified(account).call();
      const registered = await landInstance.methods.isSeller(account).call();

      // Fetch all lands
      const landsCount = parseInt(await landInstance.methods.getLandsCount().call());
      const rowData = [];
      for (let i = 1; i <= landsCount; i++) {
        const [area, city, state, price, pid, survey] = await Promise.all([
          landInstance.methods.getArea(i).call(),
          landInstance.methods.getCity(i).call(),
          landInstance.methods.getState(i).call(),
          landInstance.methods.getPrice(i).call(),
          landInstance.methods.getPID(i).call(),
          landInstance.methods.getSurveyNumber(i).call(),
        ]);
        rowData.push({ id: i, area, city, state, price, pid, survey });
      }

      this.setState({ web3, account, landInstance, verified, registered, rowData });
    } catch (error) {
      console.error("Error loading web3 or contract:", error);
      alert("Failed to load web3, accounts, or contract.");
    }
  };

  render() {
    const { web3, registered, verified, rowData } = this.state;

    if (!web3) {
      return (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      );
    }

    if (!registered) {
      return (
        <div className="content mt-5">
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <h3>You are not registered to view this page</h3>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      );
    }

    return (
      <div className="content">
        {/* Stats */}
        <Row className="mb-4">
          <Col lg="4">
            <div className="dashbord dashbord-skyblue text-center p-3">
              <i className="fa fa-users fa-2x" />
              <p>Total Buyers</p>
              <span>{this.state.landInstance?.methods.getBuyersCount ? 'Loading...' : '0'}</span>
            </div>
          </Col>
          <Col lg="4">
            <div className="dashbord dashbord-orange text-center p-3">
              <i className="fa fa-landmark fa-2x" />
              <p>Registered Lands</p>
              <span>{this.state.rowData.length}</span>
            </div>
          </Col>
          <Col lg="4">
            <div className="dashbord dashbord-blue text-center p-3">
              <i className="fa fa-bell fa-2x" />
              <p>Total Requests</p>
              <span>{this.state.landInstance?.methods.getRequestsCount ? 'Loading...' : '0'}</span>
            </div>
          </Col>
        </Row>

        {/* Actions */}
        <Row className="mb-4">
          <Col lg="4">
            <Card>
              <CardHeader>Add Land</CardHeader>
              <CardBody>
                <Button
                  href="/Seller/AddLand"
                  color="primary"
                  disabled={!verified}
                >
                  Add Land
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card>
              <CardHeader>Profile</CardHeader>
              <CardBody>
                <Button href="/seller/sellerProfile" color="primary">
                  View Profile
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card>
              <CardHeader>Requests</CardHeader>
              <CardBody>
                <Button
                  href="/Seller/ApproveRequest"
                  color="primary"
                  disabled={!verified}
                >
                  View Land Requests
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Lands Table */}
        <Row>
          <Col lg="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Lands Info</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Area</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Price</th>
                      <th>PID</th>
                      <th>Survey Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData.map((land) => (
                      <tr key={land.id}>
                        <td>{land.id}</td>
                        <td>{land.area}</td>
                        <td>{land.city}</td>
                        <td>{land.state}</td>
                        <td>{land.price}</td>
                        <td>{land.pid}</td>
                        <td>{land.survey}</td>
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

export default SDash;
