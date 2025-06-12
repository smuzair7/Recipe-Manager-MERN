import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const MainNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
      if (token) fetchProfile();
      else setUser(null);
    };
    checkToken();
    const interval = setInterval(checkToken, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchProfile = async () => {
    console.log(localStorage.getItem('token'))
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);

        console.log("USER RECIEVED");
        console.log(data);
      }
    } catch (e){
      console.log('ERROR',e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm py-3 fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-warning d-flex align-items-center me-auto no-underline">
          <img 
            src="/recipe.png" 
            alt="Logo" 
            style={{ 
              height: '40px', 
              marginRight: '10px', 
              borderRadius: '0', // Ensure no circular styling
              overflow: 'visible' // Prevent clipping
            }} 
          />
          Today Recipe
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link as={Link} to="/" className="text-light">Home</Nav.Link>
            <Nav.Link as={Link} to="/browse" className="text-light">Browse</Nav.Link>
            {isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/add" className="text-light">Add Recipe</Nav.Link>
                <Nav.Link as={Link} to="/planner" className="text-light">Planner</Nav.Link>
              </>
            )}
            {isLoggedIn && user ? (
              <NavDropdown
                title={<span><i className="bi bi-person-circle"></i> {user.name}</span>}
                align="end"
                className="text-light"
              >
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-light">Login</Nav.Link>
                <Button as={Link} to="/register" className="btn-register ms-2">Register</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
