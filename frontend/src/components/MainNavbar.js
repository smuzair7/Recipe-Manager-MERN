import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const MainNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Listen for login/logout changes
  useEffect(() => {
    const checkToken = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      if (localStorage.getItem('token')) {
        fetchProfile();
      } else {
        setUser(null);
      }
    };
    checkToken();
    window.addEventListener('storage', checkToken);
    // Poll every 1s in case storage event doesn't fire (same tab)
    const interval = setInterval(checkToken, 1000);
    return () => {
      window.removeEventListener('storage', checkToken);
      clearInterval(interval);
    };
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/users/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <Navbar expand="lg" className="mb-4 shadow navbar-glass border-0 py-3" style={{ fontSize: '1.13rem' }}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-gradient d-flex align-items-center gap-2" style={{ fontSize: '2.1rem', letterSpacing: '2px' }}>
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg,#3b82f6 0%,#64748b 100%)',
            borderRadius: '50%',
            width: 38,
            height: 38,
            marginRight: 10,
            boxShadow: '0 2px 8px 0 rgba(59,130,246,0.13)'
          }}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none"><circle cx="19" cy="19" r="19" fill="#fff"/><text x="50%" y="55%" textAnchor="middle" fill="#3b82f6" fontSize="18" fontWeight="bold" dy=".3em">🍽️</text></svg>
          </span>
          Today Recipe
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/add">Add Recipe</Nav.Link>
            <Nav.Link as={Link} to="/browse">Browse</Nav.Link>
            <Nav.Link as={Link} to="/planner">Planner</Nav.Link>
            <Nav.Link as={Link} to="/shopping-list">Shopping List</Nav.Link>
          </Nav>
          <Nav>
            {isLoggedIn && user ? (
              <NavDropdown title={<span><i className="bi bi-person-circle"></i> {user.name}</span>} id="user-nav-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
