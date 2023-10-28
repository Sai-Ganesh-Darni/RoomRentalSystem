import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/auth-context";

import LoadingSpinner from "../UIElements/LoadingSpinner";
import ErrorModal from "../UIElements/ErrorModal";
import SuccessModal from "../UIElements/SuccessModal";

import ImageSlider from "../ImageComponents/ImageSlider";

import "./RoomDetails.css";
import MapBox from "../Pages/MapBox";

const RoomDetails = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { roomId } = useParams("roomId");
  console.log("In room details >Room Id >>>", roomId);
  const [loadedRoom, setLoadedRoom] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const getRoomDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/rooms/${roomId}`
        );
        const responseData = await response.json();
        console.log("Response Data >>>", responseData);
        if (responseData.status === "fail" || responseData.status === "error") {
          throw new Error("Given Room ID Is Not valid");
        }
        console.log(
          "In RoomDetials >Response Data.data >>>",
          responseData.data
        );
        setLoadedRoom(responseData.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err.message || "Error While getting room Details By Id");
        console.log("Error While getting room Details By Id");
      }
    };
    getRoomDetails();
  }, [roomId]);

  const deleteRoomHandler = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/rooms/${roomId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      const responseData = await response.json();
      console.log("in room details response data >>>", responseData);
      if (responseData.status === "fail" || responseData.status === "error") {
        throw new Error(responseData.message || "Error While Deleting Room");
      }
      setIsLoading(false);
      setSuccess(true);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Error While Deleting Room ");
    }
  };

  const updateClickHandler = () => {
    navigate(`/updateroom/${roomId}`);
  };
  const errorHandler = () => {
    setError(null);
  };

  const successHandler = () => {
    setSuccess(false);
    navigate("/myrooms");
  };
  const containerStyles = {
    width: "500px",
    height: "280px",
    margin: "0 auto",
  };

  return (
    <div id="room_details_page">
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}
      <SuccessModal
        success={success}
        successMessage="Room Deleted Successfully!"
        onClear={successHandler}
      />
      {!isLoading && loadedRoom && (
        <div id="room_details">
          <div className="room_header">
            <h1>{loadedRoom.title}</h1>
          </div>
          <div class="image_slider">
            <div style={containerStyles}>
              <ImageSlider
                slides={loadedRoom.images}
                prePath={`${process.env.REACT_APP_ASSET_URL}/img/rooms`}
              />
            </div>
          </div>
          {/* <ul style={{ borderTop: "2px solid green", marginTop: "30px" }}> */}
          <ul>
            <li>
              <h4>Listing Information : </h4>
              <div className="listing_information">
                <div className="address">
                  <span>Address :</span>
                  <br></br>
                  <span className="answer">
                    {loadedRoom.village}, {loadedRoom.city}, {loadedRoom.state}{" "}
                    ,{loadedRoom.zip} {"   -  "}
                    {loadedRoom.country}
                  </span>
                </div>
                <br></br>
                <div>
                  <label>Room Type : </label>
                  <span className="answer">{loadedRoom.room_type}</span>
                  <br />
                  <br></br>
                  <label>Building Type : </label>
                  <span className="answer">{loadedRoom.building_type}</span>
                </div>
                <br></br>
                <div>
                  <label>Rent :</label>
                  <span className="answer">
                    {"   ₹"}
                    {loadedRoom.rent}
                    {"/month"}
                  </span>
                </div>
                <br></br>
                <div>
                  {loadedRoom.utilities_included === "Yes" ? (
                    <span className="allowed">{"Utilities Included"}</span>
                  ) : (
                    <span className="notallowed">
                      {"Utilities Not Included"}
                    </span>
                  )}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {loadedRoom.pets_allowed === "Yes" ? (
                    <span className="allowed">{"Pets Allowed"}</span>
                  ) : (
                    <span className="notallowed">{"Pets Not Allowed"}</span>
                  )}
                </div>
                <br></br>
                <div className="listing_description">
                  Description :
                  <span className="answer">{loadedRoom.description}</span>
                </div>
              </div>
            </li>
            <li>
              <h4>Contact Information : </h4>
              <div className="listing_contact">
                <label>
                  Phone <i class="fa fa-phone" aria-hidden="true"></i> :{" "}
                  <span className="answer">{loadedRoom.phone}</span>
                </label>
                <br></br>
                <br></br>

                <label>
                  E-mail <i class="fa fa-envelope" aria-hidden="true"></i> :{" "}
                  <span className="answer">{loadedRoom.email} </span>
                </label>
                <br></br>
                <br></br>
                <div className="listing_first_date_available">
                  First Date Available <i class="fas fa-calendar-alt"></i> :{" "}
                  <span className="answer">
                    {loadedRoom.first_date_available.split("T")[0]}
                  </span>
                </div>
              </div>
            </li>
            {auth.userId === loadedRoom.creator && (
              <li>
                <h4>Owner's Decisions: </h4>

                <div className="owner_edit_delete">
                  <button className="example_g" onClick={updateClickHandler}>
                    Edit <i class="fa fa-edit"></i>
                  </button>
                  <br></br>
                  <br></br>
                  <button onClick={deleteRoomHandler} className="example_g">
                    {" "}
                    Delete <i class="fas fa-trash"></i>
                  </button>
                </div>
              </li>
            )}
          </ul>
        </div>
      )}
      <div className="map">
        {loadedRoom && (
          <MapBox origin={"basar"} destination={loadedRoom.village}></MapBox>
        )}
      </div>
    </div>
  );
};
export default RoomDetails;

<span></span>;
