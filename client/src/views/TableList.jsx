/*!
=========================================================
* Black Dashboard React v1.2.0
=========================================================
* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim
* Licensed under MIT
* Coded by Creative Tim
=========================================================
*/

import React from "react";
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from "reactstrap";

const tableData = [
  { name: "Dakota Rice", country: "Niger", city: "Oud-Turnhout", salary: "$36,738" },
  { name: "Minerva Hooper", country: "Curaçao", city: "Sinaai-Waas", salary: "$23,789" },
  { name: "Sage Rodriguez", country: "Netherlands", city: "Baileux", salary: "$56,142" },
  { name: "Philip Chaney", country: "Korea, South", city: "Overland Park", salary: "$38,735" },
  { name: "Doris Greene", country: "Malawi", city: "Feldkirchen in Kärnten", salary: "$63,542" },
  { name: "Mason Porter", country: "Chile", city: "Gloucester", salary: "$78,615" },
  { name: "Jon Porter", country: "Portugal", city: "Gloucester", salary: "$98,615" },
];

function Tables() {
  const renderTableRows = () =>
    tableData.map((row, index) => (
      <tr key={index}>
        <td>{row.name}</td>
        <td>{row.country}</td>
        <td>{row.city}</td>
        <td className="text-center">{row.salary}</td>
      </tr>
    ));

  return (
    <div className="content">
      <Row>
        {/* Simple Table */}
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Simple Table</CardTitle>
            </CardHeader>
            <CardBody>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Name</th>
                    <th>Country</th>
                    <th>City</th>
                    <th className="text-center">Salary</th>
                  </tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>

        {/* Table on Plain Background */}
        <Col md="12">
          <Card className="card-plain">
            <CardHeader>
              <CardTitle tag="h4">Table on Plain Background</CardTitle>
              <p className="category">Here is a subtitle for this table</p>
            </CardHeader>
            <CardBody>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Name</th>
                    <th>Country</th>
                    <th>City</th>
                    <th className="text-center">Salary</th>
                  </tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Tables;
