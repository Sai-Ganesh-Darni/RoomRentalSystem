import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/auth-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const logoutHandler = () => {
    auth.logout();
    navigate("/");
  } ;
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/about" exact="true">
          {" "}
          About
        </NavLink>
      </li>
      <li>
        <NavLink to="/contactus" exact="true">
          {" "}
          Contact Us
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/myrooms`}> My Rooms</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/myaccount`}> My Account</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/addnewroom"> Add New Room</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/login"> Login </NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/signup"> Signup </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={logoutHandler}>Log Out</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
