import React from "react";
import cityscapes from "../src/assets/images/cityscapes.png";
import "./Home.css";
import { NavLink } from "react-router-dom";
const Home = (props) => {
  return (
    <React.Fragment>
      <div className="home-info">
        <div className="home-text">
          <h1>Find Your New Place with roomie!</h1>
          <p>
            Easy as making friends, with roomie you can look for many rooms
            available across the country.
          </p>
          <br></br>
          <br></br>
          {/* <form className="search_form">
            <input
              type="text"
              placeholder="Enter a City "
              id="autocomplete"
            ></input>
            <i
              className="fa fa-map-marker iconn"
              aria-hidden="true"
            ></i>
            <button type="submit" className="search">
              {" "}
              Search
            </button>
          </form> */}
          <br></br>
          <br></br>
          <NavLink className='all-room-btn' to='/RoomList'>All Available rooms</NavLink>
        </div>
        <img src={cityscapes} id="homeimg" alt="homepageimg" />
      </div>
    </React.Fragment>
  );
};
export default Home;
