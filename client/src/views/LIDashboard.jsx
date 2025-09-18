import React, { Component } from 'react';
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
    Row,
    Col,
} from "reactstrap";
import "../card.css";

const drizzleOptions = {
    contracts: [Land]
};

class LIDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            LandInstance: null,
            account: null,
            web3: null,
            verified: false,
        };
    }

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const currentAddress = await web3.currentProvider.selectedAddress;
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Land.networks[networkId];
            const instance = new web3.eth.Contract(
                Land.abi,
                deployedNetwork && deployedNetwork.address,
            );

            // Check if user is a Land Inspector
            const verified = await instance.methods.isLandInspector(currentAddress).call();

            this.setState({
                LandInstance: instance,
                web3,
                account: accounts[0],
                verified,
            });

        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`);
            console.error(error);
        }
    };

    render() {
        const { web3, verified } = this.state;

        if (!web3) {
            return (
                <div className="content text-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            );
        }

        if (!verified) {
            return (
                <div className="content text-center mt-5">
                    <Card className="card-chart mx-auto" style={{ maxWidth: "600px" }}>
                        <CardBody>
                            <h3>You are not verified to view this page</h3>
                        </CardBody>
                    </Card>
                </div>
            );
        }

        return (
            <DrizzleProvider options={drizzleOptions}>
                <LoadingContainer>
                    <div className="content">
                        <Row className="mb-4">
                            <Col lg="4">
                                <div className="dashbord dashbord-skyblue text-center p-3">
                                    <i className="fa fa-users fa-2x" aria-hidden="true"></i>
                                    <h6>Total Buyers</h6>
                                    <p><ContractData contract="Land" method="getBuyersCount" /></p>
                                </div>
                            </Col>
                            <Col lg="4">
                                <div className="dashbord dashbord-blue text-center p-3">
                                    <i className="fa fa-bell fa-2x" aria-hidden="true"></i>
                                    <h6>Total Requests</h6>
                                    <p><ContractData contract="Land" method="getRequestsCount" /></p>
                                </div>
                            </Col>
                            <Col lg="4">
                                <div className="dashbord dashbord-orange text-center p-3">
                                    <i className="fa fa-users fa-2x" aria-hidden="true"></i>
                                    <h6>Total Sellers</h6>
                                    <p><ContractData contract="Land" method="getSellersCount" /></p>
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-4">
                            <Col lg="4">
                                <Card>
                                    <CardHeader>
                                        <h5 className="title">Buyers Information</h5>
                                    </CardHeader>
                                    <CardBody className="text-center">
                                        <Button href="/LI/BuyerInfo" className="btn-fill" color="primary">
                                            Verify Buyers
                                        </Button>
                                    </CardBody>
                                </Card>
                            </Col>

                            <Col lg="4">
                                <Card>
                                    <CardHeader>
                                        <h5 className="title">Land Transfer Requests</h5>
                                    </CardHeader>
                                    <CardBody className="text-center">
                                        <Button href="/LI/TransactionInfo" className="btn-fill" color="primary">
                                            Approve Land Transactions
                                        </Button>
                                    </CardBody>
                                </Card>
                            </Col>

                            <Col lg="4">
                                <Card>
                                    <CardHeader>
                                        <h5 className="title">Sellers Information</h5>
                                    </CardHeader>
                                    <CardBody className="text-center">
                                        <Button href="/LI/SellerInfo" className="btn-fill" color="primary">
                                            Verify Sellers
                                        </Button>
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

export default LIDashboard;
