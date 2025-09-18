import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

function UserProfile() {
  // State for form fields
  const [profile, setProfile] = useState({
    company: "Creative Code Inc.",
    username: "michael23",
    email: "mike@email.com",
    firstName: "Mike",
    lastName: "Andrew",
    address: "Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09",
    city: "Mike",
    country: "Andrew",
    postalCode: "",
    aboutMe:
      "Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo.",
  });

  // Handle input changes
  const handleChange = (field) => (e) => {
    setProfile({ ...profile, [field]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile saved:", profile);
    alert("Profile saved successfully!");
    // Here you can integrate API call to save profile data
  };

  return (
    <div className="content">
      <Row>
        {/* Edit Profile Form */}
        <Col md="8">
          <Card>
            <CardHeader>
              <h5 className="title">Edit Profile</h5>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md="5" className="pr-md-1">
                    <FormGroup>
                      <label>Company (disabled)</label>
                      <Input
                        type="text"
                        value={profile.company}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="3" className="px-md-1">
                    <FormGroup>
                      <label>Username</label>
                      <Input
                        type="text"
                        value={profile.username}
                        onChange={handleChange("username")}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4" className="pl-md-1">
                    <FormGroup>
                      <label>Email address</label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={handleChange("email")}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6" className="pr-md-1">
                    <FormGroup>
                      <label>First Name</label>
                      <Input
                        type="text"
                        value={profile.firstName}
                        onChange={handleChange("firstName")}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" className="pl-md-1">
                    <FormGroup>
                      <label>Last Name</label>
                      <Input
                        type="text"
                        value={profile.lastName}
                        onChange={handleChange("lastName")}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Address</label>
                      <Input
                        type="text"
                        value={profile.address}
                        onChange={handleChange("address")}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="4" className="pr-md-1">
                    <FormGroup>
                      <label>City</label>
                      <Input
                        type="text"
                        value={profile.city}
                        onChange={handleChange("city")}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4" className="px-md-1">
                    <FormGroup>
                      <label>Country</label>
                      <Input
                        type="text"
                        value={profile.country}
                        onChange={handleChange("country")}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4" className="pl-md-1">
                    <FormGroup>
                      <label>Postal Code</label>
                      <Input
                        type="number"
                        value={profile.postalCode}
                        onChange={handleChange("postalCode")}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>About Me</label>
                      <Input
                        type="textarea"
                        rows="4"
                        value={profile.aboutMe}
                        onChange={handleChange("aboutMe")}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Button color="primary" type="submit" className="btn-fill">
                  Save
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>

        {/* Profile Card */}
        <Col md="4">
          <Card className="card-user">
            <CardBody>
              <div className="author">
                <div className="block block-one" />
                <div className="block block-two" />
                <div className="block block-three" />
                <div className="block block-four" />
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  <img
                    alt="..."
                    className="avatar"
                    src={require("../assets/img/emilyz.jpg").default}
                  />
                  <h5 className="title">{profile.firstName} {profile.lastName}</h5>
                </a>
                <p className="description">CEO / Co-Founder</p>
              </div>
              <div className="card-description">
                {profile.aboutMe}
              </div>
            </CardBody>
            <CardFooter>
              <div className="button-container">
                <Button className="btn-icon btn-round" color="facebook">
                  <i className="fab fa-facebook" />
                </Button>
                <Button className="btn-icon btn-round" color="twitter">
                  <i className="fab fa-twitter" />
                </Button>
                <Button className="btn-icon btn-round" color="google">
                  <i className="fab fa-google-plus" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default UserProfile;
