import React from "react";
import { Link } from "react-router-dom";
// import "./Test.css";
import ImageSlider from "./ImageComponents/ImageSlider";
const Test = () => {
  const slides = [
    "http://localhost:5000/img/rooms/room-1655544340216.jpeg",
    "http://localhost:5000/img/rooms/room-1655546878330.jpeg",
    "http://localhost:5000/img/rooms/room-1655546991746.jpeg",
    "http://localhost:5000/img/rooms/room-1655546878309.jpeg",
  ];
  const containerStyles = {
    width: "500px",
    height: "280px",
    margin: "0 auto",
  };
  return (
    <div style={{ paddingBottom: "30px" }}>
      <h1>Hello monsterlessons</h1>
      <div style={containerStyles}>
        <ImageSlider slides={slides} />
      </div>
    </div>
  );
};
export default Test;
