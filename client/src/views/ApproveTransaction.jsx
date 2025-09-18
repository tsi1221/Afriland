import React, { useEffect, useState } from "react";
import Land from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import "../index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Spinner,
  Button,
  Table,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

const ApproveRequest = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [landInstance, setLandInstance] = useState(null);
  const [verified, setVerified] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize Web3 and contract
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

        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setLandInstance(instance);

        // Check if user is a Land Inspector
        const isInspector = await instance.methods
          .isLandInspector(accounts[0])
          .call();
        setVerified(isInspector);

        if (isInspector) {
          await fetchRequests(instance);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading web3 or contract:", error);
        alert("Failed to load web3, accounts, or contract.");
        setLoading(false);
      }
    };

    init();
  }, []);

  // Fetch all land transfer requests
  const fetchRequests = async (instance) => {
    try {
      const requestsCount = await instance.methods.getRequestsCount().call();
      const data = [];

      for (let i = 1; i <= requestsCount; i++) {
        const req = await instance.methods.getRequestDetails(i).call();
        const isPaid = await instance.methods.isPaid(req[2]).call();

        data.push({
          id: i,
          seller: req[0],
          buyer: req[1],
          landId: req[2],
          status: req[3].toString(),
          isPaid,
        });
      }

      setRequests(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setLoading(false);
    }
  };

  // Approve land transfer
  const approveTransfer = async (requestId, newOwner) => {
    if (!landInstance || !account) return;

    try {
      await landInstance.methods
        .LandOwnershipTransfer(requestId, newOwner)
        .send({ from: account, gas: 2100000 });

      // Refresh table
      await fetchRequests(landInstance);
    } catch (err) {
      console.error("Transfer error:", err);
      alert("Failed to approve land transfer.");
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner color="primary" />
      </div>
    );
  }

  // Unauthorized view
  if (!verified) {
    return (
      <div className="content">
        <Row>
          <Col>
            <Card>
              <CardBody>
                <h1>You are not authorized to view this page.</h1>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  // Main table
  return (
    <div className="content">
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Land Transfer Requests</CardTitle>
        </CardHeader>
        <CardBody>
          {requests.length === 0 ? (
            <p>No requests available.</p>
          ) : (
            <Table responsive hover bordered>
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Seller ID</th>
                  <th>Buyer ID</th>
                  <th>Land ID</th>
                  <th>Status</th>
                  <th>Approve Transfer</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>{req.seller}</td>
                    <td>{req.buyer}</td>
                    <td>{req.landId}</td>
                    <td>{req.status}</td>
                    <td>
                      <Button
                        color="success"
                        onClick={() => approveTransfer(req.id, req.buyer)}
                        disabled={!req.isPaid}
                      >
                        {req.isPaid
                          ? "Approve Land Transfer"
                          : "Pending Payment"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ApproveRequest;
