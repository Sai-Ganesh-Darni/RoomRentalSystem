import React from "react";
const MapBox = (props) => {
  return (
    <iframe
      width="100%"
      height="550"
      frameborder="0"
      style={{ border: 0 }}
      src={`https://www.google.com/maps/embed/v1/directions?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&origin=${props.origin}&destination=${props.destination}`}
      referrerpolicy="no-referrer-when-downgrade"
      title="destination_map"
    ></iframe>
  );
};
export default MapBox;
