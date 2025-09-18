// src/views/ViewImage.jsx
import React, { useState, useEffect } from "react";
import Land from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../index.css";

// reactstrap components
import { Card, CardBody, Row, Col } from "reactstrap";

function ViewImage() {
  const navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [landInstance, setLandInstance] = useState(null);
  const [verified, setVerified] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [lands, setLands] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = await getWeb3();
        const accounts = await web3Instance.eth.getAccounts();
        const account = accounts[0];

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = Land.networks[networkId];

        if (!deployedNetwork) throw new Error("Contract not deployed on this network");

        const instance = new web3Instance.eth.Contract(Land.abi, deployedNetwork.address);

        setWeb3(web3Instance);
        setAccount(account);
        setLandInstance(instance);

        // Check verification
        const isVerified = await instance.methods.isVerified(account).call();
        setVerified(isVerified);
        setRegistered(true); // assume user is registered if verified

        // Load lands
        const count = parseInt(await instance.methods.getLandsCount().call());
        const landData = [];

        for (let i = 1; i <= count; i++) {
          const [area, city, state, price, pid, surveyNumber, image, document] =
            await Promise.all([
              instance.methods.getArea(i).call(),
              instance.methods.getCity(i).call(),
              instance.methods.getState(i).call(),
              instance.methods.getPrice(i).call(),
              instance.methods.getPID(i).call(),
              instance.methods.getSurveyNumber(i).call(),
              instance.methods.getImage(i).call(),
              instance.methods.getDocument(i).call(),
            ]);

          landData.push({ id: i, area, city, state, price, pid, surveyNumber, image, document });
        }

        setLands(landData);
      } catch (error) {
        console.error(error);
        alert("Failed to load web3, accounts, or contract.");
      }
    };

    init();
  }, []);

  const viewLandDocument = (docHash) => {
    window.open(`https://ipfs.io/ipfs/${docHash}`, "_blank", "noopener,noreferrer");
  };

  if (!web3) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!registered || !verified) {
    return (
      <div className="content mt-5">
        <Row className="justify-content-center">
          <Col xs="8">
            <Card>
              <CardBody>
                <h3 className="text-center text-danger">
                  You are not verified to view this page
                </h3>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="content">
      <Row>
        {lands.map((land) => (
          <Col xs="6" key={land.id} className="mb-4">
            <div className="post-module">
              <div className="thumbnail">
                <div className="date">
                  <div className="day">{land.id}</div>
                </div>
                <img src={`https://ipfs.io/ipfs/${land.image}`} alt={`Land ${land.id}`} />
              </div>
              <div className="post-content">
                <div className="category">Photos</div>
                <h1 className="title">{land.area} Sq. m.</h1>
                <h2 className="sub_title">{land.city}, {land.state}</h2>
                <p className="description">
                  PID: {land.pid}<br />
                  Survey No.: {land.surveyNumber}
                </p>
                <div className="post-meta">
                  <span className="timestamp">Price: ₹ {land.price}</span>
                </div>
                <div className="post-meta">
                  <Button color="link" onClick={() => viewLandDocument(land.document)}>
                    View Verified Document
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ViewImage;
