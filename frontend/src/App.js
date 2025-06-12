import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import MainNavbar from './components/MainNavbar';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Login from './components/Login';
import Register from './components/Register';
import AddRecipe from './components/AddRecipe';
import RecipeDetails from './components/RecipeDetails';
import BrowseRecipes from './components/BrowseRecipes';
import Planner from './components/Planner';
import ShoppingList from './components/ShoppingList';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <Container fluid className="p-0">
        <MainNavbar />
        {/* Navbar will go here */}
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add" element={<AddRecipe />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/browse" element={<BrowseRecipes />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
