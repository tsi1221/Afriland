/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

*/

import React from "react";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";

function Typography() {
  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="mb-5">
              <h5 className="card-category">Black Dashboard Typography</h5>
              <CardTitle tag="h3">Created using Poppins Font Family</CardTitle>
            </CardHeader>
            <CardBody>

              {/* Headers */}
              {[1, 2, 3, 4, 5, 6].map((h) => {
                const Tag = `h${h}`;
                return (
                  <div className="typography-line" key={h}>
                    <Tag>
                      Header {h} – The Life of Black Dashboard React
                    </Tag>
                  </div>
                );
              })}

              {/* Paragraph */}
              <div className="typography-line">
                <p>
                  I will be the leader of a company that ends up being worth billions of dollars because I got the answers. I understand culture. I am the nucleus. I think that’s a responsibility that I have, to push possibilities, to show people the level that things could be at.
                </p>
              </div>

              {/* Quote */}
              <div className="typography-line">
                <blockquote className="blockquote blockquote-primary">
                  "I will be the leader of a company that ends up being worth billions of dollars, because I got the answers. I understand culture. I am the nucleus. I think that’s a responsibility that I have, to push possibilities, to show people the level that things could be at."
                  <br /><br />
                  <small>- Noaa</small>
                </blockquote>
              </div>

              {/* Text Colors */}
              {["muted", "primary", "info", "success", "warning", "danger"].map((type) => (
                <div className="typography-line" key={type}>
                  <p className={`text-${type}`}>
                    This is {type} text. I will be the leader of a company that ends up being worth billions of dollars.
                  </p>
                </div>
              ))}

              {/* Small Tag */}
              <div className="typography-line">
                <h2>
                  Header with small subtitle
                  <br />
                  <small>Use "small" tag for the headers</small>
                </h2>
              </div>

              {/* Lists */}
              <div className="typography-line">
                <Row>
                  <Col md="3">
                    <h5>Unordered List</h5>
                    <ul>
                      <li>List Item</li>
                      <li>List Item</li>
                      <li className="list-unstyled">
                        <ul>
                          <li>Nested Item 1</li>
                          <li>Nested Item 2</li>
                          <li>Nested Item 3</li>
                        </ul>
                      </li>
                      <li>List Item</li>
                    </ul>
                  </Col>
                  <Col md="3">
                    <h5>Ordered List</h5>
                    <ol>
                      <li>List Item</li>
                      <li>List Item</li>
                      <li>List Item</li>
                      <li>List Item</li>
                    </ol>
                  </Col>
                  <Col md="3">
                    <h5>Unstyled List</h5>
                    <ul className="list-unstyled">
                      <li>List Item</li>
                      <li>List Item</li>
                      <li>List Item</li>
                      <li>List Item</li>
                    </ul>
                  </Col>
                  <Col md="3">
                    <h5>Inline List</h5>
                    <ul className="list-inline">
                      <li className="list-inline-item">List1</li>
                      <li className="list-inline-item">List2</li>
                      <li className="list-inline-item">List3</li>
                    </ul>
                  </Col>
                </Row>
              </div>

              {/* Code */}
              <div className="typography-line">
                <p>
                  This is <code>.css-class-as-code</code>, an example of inline code. Wrap inline code within a <code>{`<code>...</code>`}</code> tag.
                </p>
                <pre>
                  1. # This is an example of preformatted text.
                  <br />
                  2. # Here is another line of code.
                </pre>
              </div>

            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Typography;
