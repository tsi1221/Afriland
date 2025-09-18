import React, { useState, useEffect } from "react";
import classNames from "classnames";
import {
  Button,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink,
  Container,
  Modal,
  ModalHeader,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

function AdminNavbar({ sidebarOpened, toggleSidebar, brandText }) {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [modalSearchOpen, setModalSearchOpen] = useState(false);
  const [color, setColor] = useState("navbar-transparent");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 993 && collapseOpen) {
        setColor("bg-white");
      } else {
        setColor("navbar-transparent");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapseOpen]);

  const toggleCollapse = () => {
    setColor(collapseOpen ? "navbar-transparent" : "bg-white");
    setCollapseOpen(!collapseOpen);
  };

  const toggleModalSearch = () => setModalSearchOpen(!modalSearchOpen);

  return (
    <>
      <Navbar className={classNames("navbar-absolute", color)} expand="lg">
        <Container fluid>
          <div className="navbar-wrapper">
            <div
              className={classNames("navbar-toggle d-inline", {
                toggled: sidebarOpened,
              })}
            >
              <NavbarToggler type="button" onClick={toggleSidebar}>
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </NavbarToggler>
            </div>
            <NavbarBrand href="#" onClick={(e) => e.preventDefault()}>
              {brandText}
            </NavbarBrand>
          </div>

          <NavbarToggler onClick={toggleCollapse}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler>

          <Collapse navbar isOpen={collapseOpen}>
            <Nav className="ml-auto" navbar>
              {/* Search Button */}
              <NavLink className="mr-3" onClick={toggleModalSearch} style={{ cursor: "pointer" }}>
                <i className="tim-icons icon-zoom-split" />
                <span className="d-lg-none d-md-block">Search</span>
              </NavLink>

              {/* Notifications Dropdown */}
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle caret color="default" nav>
                  <div className="notification d-none d-lg-block d-xl-block" />
                  <i className="tim-icons icon-sound-wave" />
                  <p className="d-lg-none">Notifications</p>
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar" right>
                  {["Mike John responded to your email", "You have 5 more tasks", "Your friend Michael is in town", "Another notification", "Another one"].map((text, index) => (
                    <DropdownItem key={index}>{text}</DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>

              {/* Profile Dropdown */}
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle caret color="default" nav>
                  <div className="photo">
                    <img
                      alt="Profile"
                      src={require("assets/img/anime3.png").default}
                    />
                  </div>
                  <b className="caret d-none d-lg-block d-xl-block" />
                  <p className="d-lg-none">Account</p>
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar">
                  <DropdownItem>Profile</DropdownItem>
                  <DropdownItem>Settings</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Log out</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              <li className="separator d-lg-none" />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>

      {/* Search Modal */}
      <Modal modalClassName="modal-search" isOpen={modalSearchOpen} toggle={toggleModalSearch}>
        <ModalHeader>
          <Input placeholder="SEARCH" type="text" />
          <Button close aria-label="Close" onClick={toggleModalSearch} />
        </ModalHeader>
      </Modal>
    </>
  );
}

export default AdminNavbar;
