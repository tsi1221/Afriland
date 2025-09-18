import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandContract from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import ipfs from "../ipfs";

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
import { Spinner, FormFile } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function AddLand() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [landInstance, setLandInstance] = useState(null);

  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [stateLoc, setStateLoc] = useState("");
  const [price, setPrice] = useState("");
  const [propertyPID, setPropertyPID] = useState("");
  const [surveyNum, setSurveyNum] = useState("");

  const [ipfsHash, setIpfsHash] = useState("");
  const [documentHash, setDocumentHash] = useState("");
  const [buffer, setBuffer] = useState(null);
  const [buffer2, setBuffer2] = useState(null);

  const [verified, setVerified] = useState(false);
  const [registered, setRegistered] = useState(false);

  const navigate = useNavigate();

  // Initialize Web3 + Contract
  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = LandContract.networks[networkId];

        if (!deployedNetwork) {
          alert("Contract not deployed on current network!");
          return;
        }

        const instance = new web3.eth.Contract(
          LandContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        setWeb3(web3);
        setAccount(accounts[0]);
        setLandInstance(instance);

        const currentAddress = accounts[0];
        const verified = await instance.methods.isVerified(currentAddress).call();
        const registered = await instance.methods.isSeller(currentAddress).call();

        setVerified(verified);
        setRegistered(registered);
      } catch (err) {
        console.error("Error loading web3 or contract:", err);
        alert("Failed to load web3 or contract. Check console for details.");
      }
    };

    init();
  }, []);

  // File Handlers
  const captureFile = (e) => {
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => setBuffer(Buffer(reader.result));
  };

  const captureDoc = (e) => {
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => setBuffer2(Buffer(reader.result));
  };

  // Upload to IPFS
  const uploadToIpfs = async (fileBuffer) => {
    try {
      const result = await ipfs.add(fileBuffer);
      return result.path; // modern ipfs-http-client returns { path }
    } catch (err) {
      console.error("IPFS upload error:", err);
      alert("IPFS upload failed.");
      return null;
    }
  };

  // Add Land
  const addLand = async () => {
    if (!landInstance) return;

    if (!area || !city || !stateLoc || !price || !propertyPID || !surveyNum) {
      alert("All fields are required!");
      return;
    }
    if (isNaN(area) || isNaN(price)) {
      alert("Area and Price must be numbers!");
      return;
    }

    const imgHash = buffer ? await uploadToIpfs(buffer) : "";
    const docHash = buffer2 ? await uploadToIpfs(buffer2) : "";

    setIpfsHash(imgHash);
    setDocumentHash(docHash);

    try {
      await landInstance.methods
        .addLand(
          area,
          city,
          stateLoc,
          price,
          propertyPID,
          surveyNum,
          imgHash,
          docHash
        )
        .send({ from: account, gas: 2100000 });

      navigate("/Seller/SellerDashboard");
    } catch (err) {
      console.error("Error adding land:", err);
      alert("Transaction failed.");
    }
  };

  // Loading Spinner
  if (!web3) {
    return (
      <div>
        <h1>
          <Spinner animation="border" variant="primary" />
        </h1>
      </div>
    );
  }

  // Unauthorized
  if (!registered || !verified) {
    return (
      <div className="content">
        <Row>
          <Col xs="6">
            <Card className="card-chart">
              <CardBody>
                <h1>You are not verified to view this page</h1>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  // Main Form
  return (
    <div className="content">
      <Row>
        <Col md="8">
          <Card>
            <CardHeader>
              <h5 className="title">Add Land</h5>
            </CardHeader>
            <CardBody>
              <Form>
                <FormGroup>
                  <label>Area (sqm)</label>
                  <Input value={area} onChange={(e) => setArea(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <label>City</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <label>State</label>
                  <Input value={stateLoc} onChange={(e) => setStateLoc(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <label>Price</label>
                  <Input value={price} onChange={(e) => setPrice(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <label>Property PID</label>
                  <Input value={propertyPID} onChange={(e) => setPropertyPID(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <label>Survey Number</label>
                  <Input value={surveyNum} onChange={(e) => setSurveyNum(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <label>Insert Land Image</label>
                  <FormFile onChange={captureFile} />
                </FormGroup>
                <FormGroup>
                  <label>Insert Aadhar/Document</label>
                  <FormFile onChange={captureDoc} />
                </FormGroup>
              </Form>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={addLand}>
                Add Land
              </Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AddLand;
