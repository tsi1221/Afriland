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
} from "reactstrap";

function AdminNavbar({ sidebarOpened, toggleSidebar, brandText }) {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [modalSearchOpen, setModalSearchOpen] = useState(false);
  const [color, setColor] = useState("navbar-transparent");

  // Update navbar color based on window size and collapse state
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
              <NavbarToggler onClick={toggleSidebar}>
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
              <NavLink
                href="/Help"
                className="faq"
                style={{
                  borderRadius: "10%",
                  fontWeight: "bold",
                  color: "black",
                  textDecoration: "none",
                }}
              >
                Help?
              </NavLink>
              <li className="separator d-lg-none" />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>

      <Modal
        modalClassName="modal-search"
        isOpen={modalSearchOpen}
        toggle={toggleModalSearch}
      >
        <ModalHeader>
          <Input placeholder="SEARCH" type="text" />
          <Button
            close
            aria-label="Close"
            onClick={toggleModalSearch}
          />
        </ModalHeader>
      </Modal>
    </>
  );
}

export default AdminNavbar;
