import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./AddNewRoom.css";
import ErrorModal from "../UIElements/ErrorModal";
import SuccessModal from "../UIElements/SuccessModal";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import { AuthContext } from "../context/auth-context";

const AddNewRoom = () => {
  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    room_type: "Private",
    building_type: "Apartment",
    utilities_included: "No",
    pets_allowed: "Yes",
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

  const onFormChangeHandler = (e) => {
    const { value, name, type, files } = e.target;
    setForm((state) => ({
      ...state,
      [name]: type === "file" ? files : value,
    }));
  };

  const addNewRoomHandler = async (e) => {
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
    for (const file of form.images) {
      formData.append("images", file);
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/rooms/addnewroom",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      const responseData = await response.json();
      console.log("Response Data : ", responseData);
      // console.log("test");
      setIsLoading(false);
      setSuccess(true);
    } catch (err) {
      console.log("Error : ", err);
      setIsLoading(false);
      setError(err.message || "Error While Creating New Room");
    }
    console.log("end");
  };

  const errorHandler = () => {
    setError(null);
  };

  const successHandler = () => {
    setSuccess(false);
    navigate("/");
  };

  return (
    <div>
      <ErrorModal error={error} onClear={errorHandler} />
      <SuccessModal
        success={success}
        successMessage="New Listing Created Sucessfully!"
        onClear={successHandler}
      />
      {isLoading && <LoadingSpinner asOverlay />}
      <form
        onSubmit={addNewRoomHandler}
        id="addnewroom"
        enctype="multipart/form-data"
      >
        <h3 id="head">New Listing</h3>
        <div id="Upload">
          <br></br>
          <span id="imgUpload">images:</span>
          <br></br>
          <br></br>
          <input
            type="file"
            className="file"
            accept=".jpg,.png,.jpeg"
            required
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

export default AddNewRoom;
