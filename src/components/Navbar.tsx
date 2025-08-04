import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CustomNavbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Library System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Books</Nav.Link>
            
            {isAuthenticated && user?.user_type === 'student' && (
              <Nav.Link as={Link} to="/checkouts">My Checkouts</Nav.Link>
            )}
            
            {isAuthenticated && user?.user_type === 'librarian' && (
              <>
                <Nav.Link as={Link} to="/users">Users</Nav.Link>
                <Nav.Link as={Link} to="/checkouts">Checkouts</Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3">
                  Signed in as: {user?.first_name} ({user?.user_type})
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
