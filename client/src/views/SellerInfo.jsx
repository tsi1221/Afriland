import React, { Component } from 'react';
import Land from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import '../index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DrizzleProvider } from 'drizzle-react';
import { Spinner } from 'react-bootstrap';
import { LoadingContainer } from 'drizzle-react-components';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Table,
    Row,
    Col
} from "reactstrap";

const drizzleOptions = {
    contracts: [Land]
};

class SellerInfo extends Component {
    state = {
        LandInstance: null,
        account: null,
        web3: null,
        verified: false,
    };

    sellerTable = [];

    componentDidMount = async () => {
        // Refresh page once
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

            // Fetch sellers
            const sellersCount = await instance.methods.getSellersCount().call();
            const sellersMap = await instance.methods.getSeller().call();

            const isInspector = await instance.methods.isLandInspector(currentAddress).call();
            this.setState({ verified: isInspector });

            const sellerRows = [];

            for (let i = 0; i < sellersCount; i++) {
                const seller = await instance.methods.getSellerDetails(sellersMap[i]).call();
                const sellerVerified = await instance.methods.isVerified(sellersMap[i]).call();
                const sellerRejected = await instance.methods.isRejected(sellersMap[i]).call();

                sellerRows.push(
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{sellersMap[i]}</td>
                        <td>{seller[0]}</td>
                        <td>{seller[1]}</td>
                        <td>{seller[2]}</td>
                        <td>{seller[3]}</td>
                        <td>{seller[4]}</td>
                        <td>
                            <a href={`https://ipfs.io/ipfs/${seller[5]}`} target="_blank" rel="noopener noreferrer">
                                Click Here
                            </a>
                        </td>
                        <td>{sellerVerified.toString()}</td>
                        <td>
                            <Button
                                onClick={this.verifySeller(sellersMap[i])}
                                disabled={sellerVerified || sellerRejected}
                                color="success"
                                size="sm"
                            >
                                Verify
                            </Button>
                        </td>
                        <td>
                            <Button
                                onClick={this.rejectSeller(sellersMap[i])}
                                disabled={sellerVerified || sellerRejected}
                                color="danger"
                                size="sm"
                            >
                                Reject
                            </Button>
                        </td>
                    </tr>
                );
            }

            this.sellerTable = sellerRows;

        } catch (error) {
            alert("Failed to load web3, accounts, or contract. Check console for details.");
            console.error(error);
        }
    };

    verifySeller = (address) => async () => {
        await this.state.LandInstance.methods.verifySeller(address).send({
            from: this.state.account,
            gas: 2100000
        });
        window.location.reload(false);
    };

    rejectSeller = (address) => async () => {
        await this.state.LandInstance.methods.rejectSeller(address).send({
            from: this.state.account,
            gas: 2100000
        });
        window.location.reload(false);
    };

    render() {
        const { web3, verified } = this.state;

        if (!web3) {
            return (
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            );
        }

        if (!verified) {
            return (
                <div className="content">
                    <Row className="justify-content-center mt-5">
                        <Col xs="12" md="6">
                            <Card>
                                <CardBody className="text-center">
                                    <h3>You are not verified to view this page</h3>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            );
        }

        return (
            <DrizzleProvider options={drizzleOptions}>
                <LoadingContainer>
                    <div className="content">
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardHeader>
                                        <CardTitle tag="h4">Sellers Info</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <Table className="tablesorter" responsive>
                                            <thead className="text-primary">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Account Address</th>
                                                    <th>Name</th>
                                                    <th>Age</th>
                                                    <th>Aadhar Number</th>
                                                    <th>Pan Number</th>
                                                    <th>Owned Lands</th>
                                                    <th>Aadhar Card Document</th>
                                                    <th>Verification Status</th>
                                                    <th>Verify Seller</th>
                                                    <th>Reject Seller</th>
                                                </tr>
                                            </thead>
                                            <tbody>{this.sellerTable}</tbody>
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

export default SellerInfo;
