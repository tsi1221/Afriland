// src/views/UpdateSeller.jsx
import React, { Component } from "react";
import Land from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";

import "../index.css";
import "bootstrap/dist/css/bootstrap.min.css";
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
  Form,
} from "reactstrap";

class UpdateSeller extends Component {
  state = {
    landInstance: null,
    web3: null,
    account: null,
    seller: {
      name: "",
      age: "",
      aadharNumber: "",
      panNumber: "",
      landsOwned: "",
    },
    verificationStatus: "",
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Land.networks[networkId];
      if (!deployedNetwork) throw new Error("Contract not deployed on this network");

      const instance = new web3.eth.Contract(Land.abi, deployedNetwork.address);

      this.setState({ landInstance: instance, web3, account });

      // Check verification status
      const verified = await instance.methods.isVerified(account).call();
      const rejected = await instance.methods.isRejected(account).call();
      const verificationStatus = verified
        ? "Verified"
        : rejected
        ? "Rejected"
        : "Not Yet Verified";
      this.setState({ verificationStatus });

      // Fetch seller details
      const sellerDetails = await instance.methods.getSellerDetails(account).call();
      this.setState({
        seller: {
          name: sellerDetails[0],
          age: sellerDetails[1],
          aadharNumber: sellerDetails[2],
          panNumber: sellerDetails[3],
          landsOwned: sellerDetails[4],
        },
      });
    } catch (error) {
      console.error(error);
      alert("Failed to load web3, accounts, or contract.");
    }
  };

  handleChange = (field) => (e) => {
    this.setState((prevState) => ({
      seller: { ...prevState.seller, [field]: e.target.value },
    }));
  };

  updateSeller = async () => {
    const { name, age, aadharNumber, panNumber, landsOwned } = this.state.seller;
    const { landInstance, account } = this.state;

    if (!name || !age || !aadharNumber || !panNumber || !landsOwned)
      return alert("All fields are required!");
    if (aadharNumber.length !== 12) return alert("Aadhar Number should be 12 digits!");
    if (panNumber.length !== 10) return alert("PAN Number should be 10 characters!");
    if (isNaN(age)) return alert("Age must be a number!");

    try {
      await landInstance.methods
        .updateSeller(name, age, aadharNumber, panNumber, landsOwned)
        .send({ from: account, gas: 2100000 });

      alert("Seller updated successfully!");
      this.props.navigate("/Seller/sellerProfile");
    } catch (error) {
      console.error(error);
      alert("Transaction failed!");
    }
  };

  renderFormField = (label, field, type = "text") => (
    <Row key={field}>
      <Col md="12">
        <FormGroup>
          <label>{label}</label>
          <Input
            type={type}
            value={this.state.seller[field] || ""}
            onChange={this.handleChange(field)}
          />
        </FormGroup>
      </Col>
    </Row>
  );

  render() {
    const { web3, account, verificationStatus } = this.state;

    if (!web3) {
      return (
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      );
    }

    return (
      <div className="content">
        <Row className="justify-content-center">
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Seller Profile</h5>
                <p>Status: {verificationStatus}</p>
                <p>Wallet Address: {account}</p>
              </CardHeader>
              <CardBody>
                <Form>
                  {this.renderFormField("Name", "name")}
                  {this.renderFormField("Age", "age")}
                  {this.renderFormField("Aadhar Number", "aadharNumber")}
                  {this.renderFormField("PAN Number", "panNumber")}
                  {this.renderFormField("Owned Lands", "landsOwned")}
                </Form>
              </CardBody>
              <CardFooter>
                <Button color="primary" onClick={this.updateSeller}>
                  Update
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

// Wrap with navigate for React Router v6
import { useNavigate } from "react-router-dom";
export default function (props) {
  const navigate = useNavigate();
  return <UpdateSeller {...props} navigate={navigate} />;
}
