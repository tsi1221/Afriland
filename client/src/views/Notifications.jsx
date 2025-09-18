import React, { useRef } from "react";
import NotificationAlert from "react-notification-alert";
import {
  Alert,
  UncontrolledAlert,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

const Notifications = () => {
  const notificationAlertRef = useRef(null);

  const notify = (place) => {
    const types = ["primary", "success", "danger", "warning", "info"];
    const type = types[Math.floor(Math.random() * types.length)];

    const options = {
      place,
      message: (
        <div>
          Welcome to <b>Black Dashboard React</b> - a beautiful freebie for
          every web developer.
        </div>
      ),
      type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: 7,
    };

    notificationAlertRef.current.notificationAlert(options);
  };

  return (
    <div className="content">
      <div className="react-notification-alert-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>

      <Row>
        {/* Notification Styles */}
        <Col md="6">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Notifications Style</CardTitle>
            </CardHeader>
            <CardBody>
              <Alert color="info">This is a plain notification</Alert>

              <UncontrolledAlert color="info">
                This is a notification with close button.
              </UncontrolledAlert>

              <UncontrolledAlert className="alert-with-icon" color="info">
                <span className="tim-icons icon-bell-55" data-notify="icon" />
                <span data-notify="message">
                  Notification with close button and icon.
                </span>
              </UncontrolledAlert>

              <UncontrolledAlert className="alert-with-icon" color="info">
                <span className="tim-icons icon-bell-55" data-notify="icon" />
                <span data-notify="message">
                  Notification with multiple lines. Icon and close button are
                  always vertically aligned.
                </span>
              </UncontrolledAlert>
            </CardBody>
          </Card>
        </Col>

        {/* Notification States */}
        <Col md="6">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Notification States</CardTitle>
            </CardHeader>
            <CardBody>
              {["primary", "info", "success", "warning", "danger"].map(
                (color) => (
                  <UncontrolledAlert key={color} color={color}>
                    <b>{color.charAt(0).toUpperCase() + color.slice(1)} - </b>
                    This is a regular notification made with
                    <code>.alert-{color}</code>
                  </UncontrolledAlert>
                )
              )}
            </CardBody>
          </Card>
        </Col>

        {/* Notification Places */}
        <Col md="12">
          <Card>
            <CardBody>
              <Row>
                <Col md="6" className="ml-auto mr-auto text-center">
                  <CardTitle tag="h4">
                    Notifications Places
                    <p className="category">Click to view notifications</p>
                  </CardTitle>
                </Col>
              </Row>

              {[
                ["tl", "tc", "tr"],
                ["bl", "bc", "br"],
              ].map((row, idx) => (
                <Row key={idx}>
                  <Col lg="8" className="ml-auto mr-auto">
                    <Row>
                      {row.map((place) => (
                        <Col md="4" key={place}>
                          <Button
                            block
                            color="primary"
                            onClick={() => notify(place)}
                          >
                            {place.toUpperCase().replace("t", "Top ").replace("b", "Bottom ")}
                          </Button>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Notifications;
