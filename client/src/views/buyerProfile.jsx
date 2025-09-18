import React, { Component } from 'react';
import Land from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import "../index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { DrizzleProvider } from 'drizzle-react';
import { Spinner } from 'react-bootstrap';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import { LoadingContainer } from 'drizzle-react-components';

const drizzleOptions = { contracts: [Land] };

class BuyerProfile extends Component {
  state = {
    LandInstance: null,
    account: null,
    web3: null,
    verified: false,
    rejected: false,
    buyer: null,
  };

  async componentDidMount() {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const currentAddress = accounts[0];

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Land.networks[networkId];
      const instance = new web3.eth.Contract(
        Land.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const verified = await instance.methods.isVerified(currentAddress).call();
      const rejected = await instance.methods.isRejected(currentAddress).call();
      const buyer = await instance.methods.getBuyerDetails(currentAddress).call();

      this.setState({
        LandInstance: instance,
        web3,
        account: currentAddress,
        verified,
        rejected,
        buyer,
      });
    } catch (error) {
      alert("Failed to load web3, accounts, or contract.");
      console.error(error);
    }
  }

  renderStatus() {
    if (this.state.verified) {
      return <p id="verified">Verified <i className="fas fa-user-check"></i></p>;
    }
    if (this.state.rejected) {
      return <p id="rejected">Rejected <i className="fas fa-user-times"></i></p>;
    }
    return <p id="unknown">Not Yet Verified <i className="fas fa-user-cog"></i></p>;
  }

  render() {
    const { web3, buyer, account, verified } = this.state;

    if (!web3) {
      return <Spinner animation="border" variant="primary" />;
    }

    if (!buyer) {
      return <p>Loading profile...</p>;
    }

    return (
      <div className="content">
        <DrizzleProvider options={drizzleOptions}>
          <LoadingContainer>
            <Row>
              <Col md="8">
                <Card>
                  <CardHeader>
                    <h5 className="title">Buyer Profile</h5>
                    <h5 className="title">{this.renderStatus()}</h5>
                  </CardHeader>
                  <CardBody>
                    <Form>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Your Wallet Address</label>
                            <Input disabled value={account} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Name</label>
                            <Input disabled value={buyer[0]} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Age</label>
                            <Input disabled value={buyer[5]} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Email</label>
                            <Input disabled value={buyer[4]} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>City</label>
                            <Input disabled value={buyer[1]} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Aadhar Number</label>
                            <Input disabled value={buyer[6]} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Pan Number</label>
                            <Input disabled value={buyer[2]} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Aadhar Document</label>
                            <div className="post-meta">
                              <span className="timestamp">
                                <a href={`https://ipfs.io/ipfs/${buyer[3]}`} target="_blank" rel="noreferrer">Here</a>
                              </span>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                    <Button
                      href="/admin/updateBuyer"
                      className="btn-fill"
                      disabled={!verified}
                      color="primary"
                    >
                      Edit Profile
                    </Button>
                  </CardBody>
                  <CardFooter />
                </Card>
              </Col>
            </Row>
          </LoadingContainer>
        </DrizzleProvider>
      </div>
    );
  }
}

export default BuyerProfile;
