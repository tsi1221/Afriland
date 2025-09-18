import React, { useEffect, useState } from "react";
import Land from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import "../index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Spinner,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";
import emailjs from "emailjs-com";

const BuyerInfo = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [landInstance, setLandInstance] = useState(null);
  const [verified, setVerified] = useState(false);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Send rejection email
  const sendMail = async (email, name) => {
    const params = {
      from_name: email,
      to_name: name,
      function: "request and buy any land/property",
    };

    try {
      await emailjs.send(
        "service_vrxa1ak",
        "template_zhc8m9h",
        params,
        "YOUR_PUBLIC_KEY" // replace with your EmailJS public key
      );
    } catch (err) {
      console.error("EmailJS error:", err);
    }
  };

  // Verify buyer
  const verifyBuyer = async (address) => {
    if (!landInstance || !account) return;
    try {
      await landInstance.methods.verifyBuyer(address).send({
        from: account,
        gas: 2100000,
      });
      loadBuyers();
    } catch (err) {
      console.error("Verify buyer error:", err);
      alert("Failed to verify buyer.");
    }
  };

  // Reject buyer
  const rejectBuyer = async (address, email, name) => {
    try {
      await sendMail(email, name);
      await landInstance.methods.rejectBuyer(address).send({
        from: account,
        gas: 2100000,
      });
      loadBuyers();
    } catch (err) {
      console.error("Reject buyer error:", err);
      alert("Failed to reject buyer.");
    }
  };

  // Load all buyers
  const loadBuyers = async () => {
    if (!landInstance) return;

    try {
      const buyersCount = await landInstance.methods.getBuyersCount().call();
      const buyersMap = await landInstance.methods.getBuyer().call();

      const buyersData = [];
      for (let i = 0; i < buyersCount; i++) {
        const addr = buyersMap[i];
        const details = await landInstance.methods.getBuyerDetails(addr).call();
        const isVerified = await landInstance.methods.isVerified(addr).call();
        const isRejected = await landInstance.methods.isRejected(addr).call();

        buyersData.push({
          address: addr,
          name: details[0],
          city: details[1],
          pan: details[2],
          doc: details[3],
          email: details[4],
          age: details[5],
          aadhar: details[6],
          verified: isVerified,
          rejected: isRejected,
        });
      }

      setBuyers(buyersData);
    } catch (err) {
      console.error("Error loading buyers:", err);
    }
  };

  // Initialize web3 + contract
  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = await getWeb3();
        const accounts = await web3Instance.eth.getAccounts();
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = Land.networks[networkId];

        if (!deployedNetwork) {
          alert("Smart contract not deployed on this network.");
          setLoading(false);
          return;
        }

        const instance = new web3Instance.eth.Contract(
          Land.abi,
          deployedNetwork.address
        );

        const inspector = await instance.methods
          .isLandInspector(accounts[0])
          .call();

        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setLandInstance(instance);
        setVerified(inspector);

        if (inspector) await loadBuyers();

        setLoading(false);
      } catch (err) {
        console.error("Initialization error:", err);
        alert("Failed to load web3, accounts, or contract.");
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading || !web3) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="content">
        <Row>
          <Col xs="12">
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

  return (
    <div className="content">
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Buyers Info</CardTitle>
            </CardHeader>
            <CardBody>
              <Table responsive>
                <thead className="text-primary">
                  <tr>
                    <th>#</th>
                    <th>Account Address</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Email</th>
                    <th>City</th>
                    <th>Aadhar Number</th>
                    <th>Pan Number</th>
                    <th>Aadhar Card Document</th>
                    <th>Verification Status</th>
                    <th>Verify Buyer</th>
                    <th>Reject Buyer</th>
                  </tr>
                </thead>
                <tbody>
                  {buyers.map((b, i) => (
                    <tr key={b.address}>
                      <td>{i + 1}</td>
                      <td>{b.address}</td>
                      <td>{b.name}</td>
                      <td>{b.age}</td>
                      <td>{b.email}</td>
                      <td>{b.city}</td>
                      <td>{b.aadhar}</td>
                      <td>{b.pan}</td>
                      <td>
                        <a
                          href={`https://ipfs.io/ipfs/${b.doc}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Click Here
                        </a>
                      </td>
                      <td>
                        {b.verified
                          ? "Verified"
                          : b.rejected
                          ? "Rejected"
                          : "Pending"}
                      </td>
                      <td>
                        <Button
                          onClick={() => verifyBuyer(b.address)}
                          disabled={b.verified || b.rejected}
                        >
                          Verify
                        </Button>
                      </td>
                      <td>
                        <Button
                          color="danger"
                          onClick={() => rejectBuyer(b.address, b.email, b.name)}
                          disabled={b.verified || b.rejected}
                        >
                          Reject
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
};

export default BuyerInfo;
