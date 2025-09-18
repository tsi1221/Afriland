import React from "react";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";

// List of icons you want to display
const icons = [
  { name: "icon-alert-circle-exc" },
  { name: "icon-align-center" },
  { name: "icon-align-left-2" },
  { name: "icon-bank" },
  { name: "icon-bold" },
  { name: "icon-bulb-63" },
  { name: "icon-camera-18" },
  { name: "icon-chart-bar-32" },
  { name: "icon-check-2" },
  { name: "icon-cloud-upload-94" },
  // 👉 keep adding until you reach all the ones you want
];

function Icons() {
  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <h5 className="title">100 Awesome Nucleo Icons</h5>
              <p className="category">
                Handcrafted by our friends from{" "}
                <a
                  href="https://nucleoapp.com/?ref=1712"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NucleoApp
                </a>
              </p>
            </CardHeader>
            <CardBody className="all-icons">
              <Row>
                {icons.map((icon, index) => (
                  <Col
                    key={index}
                    className="font-icon-list"
                    lg="2"
                    md="3"
                    sm="4"
                    xs="6"
                  >
                    <div className="font-icon-detail text-center">
                      <i className={`tim-icons ${icon.name}`} />
                      <p>{icon.name}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Icons;
