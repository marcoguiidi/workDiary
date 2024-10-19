import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/Navbar.css'; 

const Navbar = () => {

    return (
        <nav className="navbar">
            <div className="navbar-icons">
                <Link to="/logout" className="nav-icon">
                    <span className="icon">&#9211;</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
