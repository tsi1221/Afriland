import React, { Component } from 'react';
import Land from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";

import '../index.css';
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
    Input,
    Row,
    Col,
    Form
} from "reactstrap";
import { LoadingContainer } from 'drizzle-react-components';

const drizzleOptions = {
    contracts: [Land]
};

class SellerProfile extends Component {
    state = {
        LandInstance: null,
        account: null,
        web3: null,
        verified: false,
        sellerDetails: null,
        verificationStatus: null
    };

    componentDidMount = async () => {
        // Refresh page only once
        if (!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }

        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const currentAddress = accounts[0];

            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Land.networks[networkId];
            const instance = new web3.eth.Contract(
                Land.abi,
                deployedNetwork && deployedNetwork.address
            );

            this.setState({ LandInstance: instance, web3, account: currentAddress });

            const isVerified = await instance.methods.isVerified(currentAddress).call();
            const isRejected = await instance.methods.isRejected(currentAddress).call();
            const sellerDetails = await instance.methods.getSellerDetails(currentAddress).call();

            let verificationStatus;
            if (isVerified) {
                verificationStatus = <p id="verified">Verified <i className="fas fa-user-check"></i></p>;
            } else if (isRejected) {
                verificationStatus = <p id="rejected">Rejected <i className="fas fa-user-times"></i></p>;
            } else {
                verificationStatus = <p id="unknown">Not Yet Verified <i className="fas fa-user-cog"></i></p>;
            }

            this.setState({
                verified: isVerified,
                sellerDetails,
                verificationStatus
            });

        } catch (error) {
            alert("Failed to load web3, accounts, or contract. Check console for details.");
            console.error(error);
        }
    };

    renderSellerForm = () => {
        const { sellerDetails, account } = this.state;
        if (!sellerDetails) return null;

        return (
            <>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Wallet Address</label>
                            <Input type="text" disabled value={account} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Name</label>
                            <Input type="text" disabled value={sellerDetails[0]} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Age</label>
                            <Input type="text" disabled value={sellerDetails[1]} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Aadhar Number</label>
                            <Input type="text" disabled value={sellerDetails[2]} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Pan Number</label>
                            <Input type="text" disabled value={sellerDetails[3]} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Owned Lands</label>
                            <Input type="text" disabled value={sellerDetails[4]} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Aadhar Document</label>
                            <div className="post-meta">
                                <span className="timestamp">
                                    <a href={`https://ipfs.io/ipfs/${sellerDetails[5]}`} target="_blank" rel="noopener noreferrer">
                                        View Document
                                    </a>
                                </span>
                            </div>
                        </FormGroup>
                    </Col>
                </Row>
            </>
        );
    };

    render() {
        const { web3, verificationStatus, verified } = this.state;

        if (!web3) {
            return (
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            );
        }

        return (
            <div className="content">
                <DrizzleProvider options={drizzleOptions}>
                    <LoadingContainer>
                        <Row className="justify-content-center">
                            <Col md="8">
                                <Card>
                                    <CardHeader>
                                        <h5 className="title">Seller Profile</h5>
                                        {verificationStatus}
                                    </CardHeader>
                                    <CardBody>
                                        <Form>
                                            {this.renderSellerForm()}
                                            <Button
                                                href="/Seller/updateSeller"
                                                className="btn-fill"
                                                disabled={!verified}
                                                color="primary"
                                            >
                                                Edit Profile
                                            </Button>
                                        </Form>
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

export default SellerProfile;
