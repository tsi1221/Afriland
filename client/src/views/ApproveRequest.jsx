import React, { useEffect, useState } from "react";
import { Drizzle, generateStore } from "@drizzle/store";
import { DrizzleProvider, LoadingContainer, ContractData } from "@drizzle/react-plugin";
import Land from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import { Spinner, Button, Table, Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Drizzle configuration
const drizzleOptions = {
  contracts: [Land],
  web3: { fallback: { type: "ws", url: "ws://127.0.0.1:8545" } },
};
const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

const ApproveRequestInner = () => {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [requests, setRequests] = useState([]);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize Web3 + check seller
  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = await getWeb3();
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccount(accounts[0]);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = Land.networks[networkId];
        if (!deployedNetwork) {
          alert("Contract not deployed on this network.");
          setLoading(false);
          return;
        }

        const instance = new web3Instance.eth.Contract(Land.abi, deployedNetwork.address);

        const isSeller = await instance.methods.isSeller(accounts[0]).call();
        setRegistered(isSeller);

        if (isSeller) {
          const requestsCount = await instance.methods.getRequestsCount().call();
          const data = [];
          for (let i = 1; i <= requestsCount; i++) {
            const request = await instance.methods.getRequestDetails(i).call();
            const approved = await instance.methods.isApproved(i).call();

            if (accounts[0].toLowerCase() === request[0].toLowerCase()) {
              data.push({
                id: i,
                buyerId: request[1],
                landId: request[2],
                status: request[3].toString(),
                approved,
              });
            }
          }
          setRequests(data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading Web3 or contract:", err);
        alert("Failed to connect to Web3 or contract.");
        setLoading(false);
      }
    };
    init();
  }, []);

  // Approve request
  const approveRequest = async (reqId) => {
    if (!web3 || !account) return;
    try {
      const instance = drizzle.contracts.Land;
      await instance.methods.approveRequest(reqId).send({ from: account, gas: 2100000 });

      // Refresh requests
      const requestsCount = await instance.methods.getRequestsCount().call();
      const data = [];
      for (let i = 1; i <= requestsCount; i++) {
        const request = await instance.methods.getRequestDetails(i).call();
        const approved = await instance.methods.isApproved(i).call();
        if (account.toLowerCase() === request[0].toLowerCase()) {
          data.push({
            id: i,
            buyerId: request[1],
            landId: request[2],
            status: request[3].toString(),
            approved,
          });
        }
      }
      setRequests(data);
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to approve request.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner color="primary" />
      </div>
    );
  }

  if (!registered) {
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

  return (
    <div className="content">
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Requests Info</CardTitle>
        </CardHeader>
        <CardBody>
          {requests.length === 0 ? (
            <p>No requests found for your account.</p>
          ) : (
            <Table responsive hover bordered>
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Buyer ID</th>
                  <th>Land ID</th>
                  <th>Status</th>
                  <th>Approve</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>{req.buyerId}</td>
                    <td>{req.landId}</td>
                    <td>{req.status}</td>
                    <td>
                      <Button
                        color="success"
                        onClick={() => approveRequest(req.id)}
                        disabled={req.approved}
                      >
                        {req.approved ? "Approved" : "Approve Request"}
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

const ApproveRequest = () => (
  <DrizzleProvider drizzle={drizzle}>
    <LoadingContainer>
      <ApproveRequestInner />
    </LoadingContainer>
  </DrizzleProvider>
);

export default ApproveRequest;
