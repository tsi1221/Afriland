import React, { useEffect, useRef } from "react";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";

const MapWrapper = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps JavaScript API not loaded.");
      return;
    }

    const google = window.google;
    const mapElement = mapRef.current;
    const lat = 40.748817;
    const lng = -73.985428;
    const myLatlng = new google.maps.LatLng(lat, lng);

    const mapOptions = {
      center: myLatlng,
      zoom: 14,
      scrollwheel: false, // disable scroll zoom
      styles: [
        { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
        // ... add other styles as needed
      ],
    };

    const map = new google.maps.Map(mapElement, mapOptions);

    const marker = new google.maps.Marker({
      position: myLatlng,
      map,
      animation: google.maps.Animation.DROP,
      title: "BLK Design System PRO React!",
    });

    const contentString =
      '<div class="info-window-content"><h2>BLK Dashboard React</h2>' +
      "<p>A freebie Admin for ReactStrap, Bootstrap, React, and React Hooks.</p></div>";

    const infowindow = new google.maps.InfoWindow({ content: contentString });

    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "400px", borderRadius: "5px" }}
    />
  );
};

const Map = () => {
  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card className="card-plain">
            <CardHeader>Google Maps</CardHeader>
            <CardBody>
              <MapWrapper />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Map;
