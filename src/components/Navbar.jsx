
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/users/userSlices';


const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.users.auth) || localStorage.getItem('userInfo');

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    dispatch(logoutUser());
    navigate('/');
  };
  
  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <i className="bi bi-currency-exchange fs-1 text-warning"></i>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportContent"
            aria-controls="navbarSupportContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
             
              <li className="nav-item mb-2">
                <Link to="/profile" className="btn btn-outline-warning me-2">
                  Dashboard
                </Link>
              </li>
             
            </ul>
            <form className="d-flex">
              {isAuthenticated ? (
                <>
                
                  <Link to="/add-note" className="btn btn-success me-2">
                    New Note
                  </Link>
                  
                  <button onClick={handleLogout} className="btn btn-primary">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
              )}
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;