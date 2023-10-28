import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ErrorModal from "../UIElements/ErrorModal";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import SuccessModal from "../UIElements/SuccessModal";

import ImageSlider from "../ImageComponents/ImageSlider";

import { AuthContext } from "../context/auth-context";

const UpdateRoom = () => {
  const auth = useContext(AuthContext);

  const { roomId } = useParams();

  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [slides, setSlides] = useState([]);

  const [form, setForm] = useState({
    title: "",
    room_type: "",
    building_type: "",
    utilities_included: "",
    pets_allowed: "",
    rent: "",
    village: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    description: "",
    first_date_available: "",
    email: "",
    phone: "",
    images: "",
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/rooms/${roomId}`
        );
        const responseData = await response.json();
        console.log("Response >> ", response);
        console.log("ResponseData >> ", responseData);
        console.log("ResponseData room>> ", responseData.data);
        setForm(responseData.data);
        setForm((state) => {
          return { ...state, images: "" };
        });
        // console.log("room data >> ", responseData.data.room);
        // console.log("form.images>>>>", responseData.data.room.images);
        setSlides(responseData.data.images);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(
          err.message ||
            "Error in UpdateRoom Page while fetching Room Deatils by id"
        );
        console.log(
          "Error in UpdateRoom Page while fetching Room Deatils by id"
        );
      }
    };
    fetchRoom();
  }, [roomId]);

  const updateRoomHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("room_type", form.room_type);
    formData.append("building_type", form.building_type);
    formData.append("utilities_included", form.utilities_included);
    formData.append("pets_allowed", form.pets_allowed);
    formData.append("rent", form.rent);
    formData.append("village", form.village);
    formData.append("city", form.city);
    formData.append("state", form.state);
    formData.append("zip", form.zip);
    formData.append("country", form.country);
    formData.append("description", form.description);
    formData.append("first_date_available", form.first_date_available);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("creator", auth.userId);

    if (form.images) {
      // which means to update images
      for (const file of form.images) {
        formData.append("images", file);
      }
    }
    try {
      setIsLoading(true);
      console.log("form>>", form);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/rooms/${roomId}`,
        {
          method: "PATCH",
          body: formData,
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      const responseData = await response.json();
      console.log("Response Data : ", responseData);
      if (responseData.status === "error" || responseData.status === "fail") {
        throw new Error(
          responseData.message || "error while updating room by id"
        );
      }
      setIsLoading(false);
      setSuccess(true);
    } catch (err) {
      console.log("Error : ", err);
      setIsLoading(false);
      setError(err.message || "Error While Creating New Room");
    }
  };

  const onFormChangeHandler = (e) => {
    const { value, name, type, files } = e.target;
    setForm((state) => ({
      ...state,
      [name]: type === "file" ? files : value,
    }));
  };

  const errorHandler = () => {
    setError(null);
  };

  const successHandler = () => {
    setSuccess(false);
    navigate("/");
  };

  const containerStyles = {
    width: "500px",
    height: "280px",
    margin: "0 auto",
  };

  return (
    <div>
      <ErrorModal error={error} onClear={errorHandler} />
      <SuccessModal
        success={success}
        successMessage="Listing Details Updated Successfully!"
        onClear={successHandler}
      />
      {isLoading && <LoadingSpinner asOverlay />}

      <div style={{ paddingBottom: "30px" }}>
        <h3>Previously Uploaded Images: </h3>
        <div style={containerStyles}>
          <ImageSlider
            slides={slides}
            prePath={`${process.env.REACT_APP_ASSET_URL}/img/rooms`}
          />
        </div>
      </div>

      <form
        onSubmit={updateRoomHandler}
        id="addnewroom"
        enctype="multipart/form-data"
      >
        <h3 id="head">Update Listing</h3>
        <div id="Upload">
          <br></br>
          <span id="imgUpload">Update images Here :</span>
          <br></br>
          <br></br>
          <input
            type="file"
            className="file"
            accept=".jpg,.png,.jpeg"
            name="images"
            onChange={onFormChangeHandler}
            multiple
          />
          <h5> Listing Information:</h5>
          <hr style={{ color: "orange" }}></hr>
          <label>Title:</label>
          <br></br>
          <br></br>
          <input
            type="text"
            name="title"
            className="inputUpload"
            onChange={onFormChangeHandler}
            placeholder="Enter Titile"
            required
            value={form.title}
          />
          <br></br>
          <br></br>
          <div id="flex_div">
            <div id="f1">
              <label for="room">Room:</label>
              <br></br>
              <select name="room_type" id="room" onChange={onFormChangeHandler}>
                <option value="Shared" selected={form.room_type === "Shared"}>
                  Shared
                </option>
                <option value="Private" selected={form.room_type === "Private"}>
                  Private
                </option>
              </select>
            </div>
            <div id="f1">
              <label>Building Type:</label>
              <br></br>
              <select
                name="building_type"
                id="building"
                onChange={onFormChangeHandler}
              >
                <option value="Home" selected={form.building_type === "Home"}>
                  Home
                </option>
                <option
                  value="Apartment"
                  selected={form.building_type === "Apartment"}
                >
                  Apartment
                </option>
                <option
                  value="Gated Community"
                  selected={form.building_type === "Gated Community"}
                >
                  Gated Community
                </option>
              </select>
            </div>
            <div id="f1">
              <label>Utilities Included?</label>
              <br></br>
              <input
                type="radio"
                id="Yes"
                name="utilities_included"
                value="Yes"
                onChange={onFormChangeHandler}
                checked={form.utilities_included === "Yes"}
              />
              <label for="Yes">Yes</label>
              <input
                type="radio"
                id="No"
                name="utilities_included"
                value="No"
                onChange={onFormChangeHandler}
                checked={form.utilities_included === "No"}
              />
              <label for="No">No</label>
            </div>
            <div id="f1">
              <label>Pets Allowed?</label>
              <br></br>
              <input
                type="radio"
                id="Yes1"
                name="pets_allowed"
                value="Yes"
                onChange={onFormChangeHandler}
                checked={form.pets_allowed === "Yes"}
              />
              <label for="Yes">Yes</label>
              <input
                type="radio"
                id="No1"
                name="pets_allowed"
                value="No"
                onChange={onFormChangeHandler}
                checked={form.pets_allowed === "No"}
              />
              <label for="No">No</label>
            </div>
          </div>
          <br></br>
          <br></br>
          <label>Rent:</label>
          <br></br>
          <br></br>
          <input
            type="number"
            className="inputUpload"
            name="rent"
            onChange={onFormChangeHandler}
            placeholder="Enter Rent for Month"
            required
            value={form.rent}
          />
          <br></br>
          <br></br>
          <label>Village:</label>
          <br></br>
          <br></br>
          <input
            type="text"
            className="inputUpload"
            name="village"
            onChange={onFormChangeHandler}
            placeholder="Please Enter Village"
            required
            value={form.village}
          />
          <br></br>
          <br></br>
          <label>City:</label>
          <br></br>
          <br></br>
          <input
            type="text"
            className="inputUpload"
            name="city"
            onChange={onFormChangeHandler}
            placeholder="Please Enter City "
            required
            value={form.city}
          />
          <br></br>
          <br></br>
          <label>State:</label>
          <br></br>
          <br></br>
          <input
            type="text"
            className="inputUpload"
            name="state"
            onChange={onFormChangeHandler}
            placeholder="Please Enter State"
            required
            value={form.state}
          />
          <br></br>
          <br></br>
          <label>Zip:</label>
          <br></br>
          <br></br>
          <input
            type="number"
            className="inputUpload"
            name="zip"
            onChange={onFormChangeHandler}
            placeholder="Please Enter Zip Code"
            required
            value={form.zip}
          />
          <br></br>
          <br></br>
          <label>Contry:</label>
          <br></br>
          <br></br>
          <input
            type="text"
            className="inputUpload"
            name="country"
            onChange={onFormChangeHandler}
            placeholder="Please Enter Country"
            required
            value={form.country}
          />
          <br></br>
          <br></br>
          <label>Description about your space:</label>
          <br></br>
          <br></br>
          <input
            type="text"
            className="inputUpload"
            name="description"
            onChange={onFormChangeHandler}
            placeholder="Enter Description "
            required
            value={form.description}
          />
          <br></br>
          <br></br>
          <label>First Date Available:</label>
          <br></br>
          <br></br>
          <input
            type="Date"
            className="inputUpload"
            name="first_date_available"
            onChange={onFormChangeHandler}
            required
            value={form.first_date_available.split("T")[0]}
          />
          <br></br>
          <br></br>
          <h5>Contact:</h5>
          <hr style={{ color: "orange" }}></hr>
          <label>E-mail:</label>
          <br></br>
          <br></br>
          <input
            type="email"
            className="inputUpload"
            name="email"
            onChange={onFormChangeHandler}
            placeholder="email@email.com"
            required
            value={form.email}
          />
          <br></br>
          <br></br>
          <label>Phone:</label>
          <br></br>
          <br></br>
          <input
            type="tel"
            className="inputUpload"
            name="phone"
            onChange={onFormChangeHandler}
            placeholder="Enter Phone Number"
            required
            value={form.phone}
          />
          <br></br>
          <br></br>
          <button className="SubmitUpload">Submit</button>
          <br></br>
          <br></br>
        </div>
      </form>
    </div>
  );
};
export default UpdateRoom;
