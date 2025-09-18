import React from "react";
import { Container, Nav, NavItem, NavLink } from "reactstrap";

// Props:
// links: array of { label: string, href: string } for optional navigation links
// projectName: string, name of your project
function Footer({ links = [], projectName = "Land Registration" }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container fluid>
        {links.length > 0 && (
          <Nav className="justify-content-center mb-2">
            {links.map((link, idx) => (
              <NavItem key={idx}>
                <NavLink
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        )}
        <div className="text-center text-muted">
          © {currentYear} made with{" "}
          <i className="tim-icons icon-heart-2" aria-label="love" /> for{" "}
          <a
            href="https://www.creative-tim.com/?ref=bdr-user-archive-footer"
            target="_blank"
            rel="noopener noreferrer"
          >
            {projectName}
          </a>{" "}
          — a step towards digitalization.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
