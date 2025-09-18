import React, { useEffect, useState } from "react";
import { DrizzleProvider, LoadingContainer, ContractData } from "drizzle-react";
import Land from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import { Spinner } from "react-bootstrap";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

const drizzleOptions = {
  contracts: [Land],
};

const OwnedLands = ({ history }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [landInstance, setLandInstance] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [landsCount, setLandsCount] = useState(0);
  const [ownedLands, setOwnedLands] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        // Refresh page once
        if (!window.location.hash) {
          window.location.hash = "#loaded";
          window.location.reload();
        }

        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Land.networks[networkId];

        const instance = new web3.eth.Contract(
          Land.abi,
          deployedNetwork && deployedNetwork.address
        );

        setWeb3(web3);
        setAccount(accounts[0]);
        setLandInstance(instance);

        const isRegistered = await instance.methods
          .isBuyer(accounts[0])
          .call();
        setRegistered(isRegistered);

        const count = parseInt(await instance.methods.getLandsCount().call());
        setLandsCount(count);

        const lands = [];

        for (let i = 1; i <= count; i++) {
          const owner = await instance.methods.getLandOwner(i).call();
          if (owner.toLowerCase() === accounts[0].toLowerCase()) {
            lands.push({
              id: i,
              area: (
                <ContractData
                  contract="Land"
                  method="getArea"
                  methodArgs={[i]}
                />
              ),
              city: (
                <ContractData
                  contract="Land"
                  method="getCity"
                  methodArgs={[i]}
                />
              ),
              state: (
                <ContractData
                  contract="Land"
                  method="getState"
                  methodArgs={[i]}
                />
              ),
              price: (
                <ContractData
                  contract="Land"
                  method="getPrice"
                  methodArgs={[i]}
                />
              ),
              pid: (
                <ContractData
                  contract="Land"
                  method="getPID"
                  methodArgs={[i]}
                />
              ),
              surveyNumber: (
                <ContractData
                  contract="Land"
                  method="getSurveyNumber"
                  methodArgs={[i]}
                />
              ),
            });
          }
        }

        setOwnedLands(lands);
      } catch (error) {
        console.error("Failed to load web3, accounts, or contract:", error);
        alert("Failed to load web3, accounts, or contract. Check console.");
      }
    };

    init();
  }, []);

  if (!web3) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!registered) {
    return (
      <div className="content">
        <Row>
          <Col xs="12">
            <Card>
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
      <DrizzleProvider options={drizzleOptions}>
        <LoadingContainer>
          <Row>
            <Col lg="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Owned Lands</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>#</th>
                        <th>Area</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Price</th>
                        <th>Property PID</th>
                        <th>Survey Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ownedLands.map((land, index) => (
                        <tr key={land.id}>
                          <td>{index + 1}</td>
                          <td>{land.area}</td>
                          <td>{land.city}</td>
                          <td>{land.state}</td>
                          <td>{land.price}</td>
                          <td>{land.pid}</td>
                          <td>{land.surveyNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {ownedLands.length === 0 && <p>No lands owned.</p>}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </LoadingContainer>
      </DrizzleProvider>
    </div>
  );
};

export default OwnedLands;
