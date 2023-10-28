import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import "./MyAccount.css";

import ErrorModal from "../UIElements/ErrorModal";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import SuccessModal from "../UIElements/SuccessModal";

const MyAccount = () => {
  const navigate = useNavigate();

  const auth = useContext(AuthContext);

  const [errorModal, setErrorModal] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const onFormChangeHandler = (e) => {
    const { value, name } = e.target;
    setUserDetails((state) => ({
      ...state,
      [name]: value,
    }));
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setIsLoading(true);
        console.log("auth.userId >>>", auth.userId);
        const response = await fetch(
          `http://localhost:5000/api/users/${auth.userId}`
          // `http://localhost:5000/api/users/62ab7ee35f02024ed8d3b3d4`
        );
        const responseData = await response.json();
        console.log("Response Data >>>>", responseData);
        setUserDetails({
          name: responseData.data.name,
          email: responseData.data.email,
          phone: responseData.data.phone,
          address: responseData.data.address,
        });
        // console.log(userDetails);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setErrorModal(err.message || "Error while fetching user data");
        console.log("Error while fetching user data >>", err.message);
      }
    };
    getUserDetails();
  }, []);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    // console.log("Users Details : ", userDetails);
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/users/updateMe", {
        method: "PATCH",
        body: JSON.stringify(userDetails),
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      // console.log("Response Data : ", responseData);
      setIsLoading(false);
      setSuccessModal(true);
    } catch (err) {
      setIsLoading(false);
      setErrorModal(
        err.message || "Error while SUbmiting the updated user deatils form"
      );
      console.log("Error while SUbmiting the updated user deatils form");
    }
  };

  const errorHandler = () => {
    setErrorModal(null);
  };

  const successHandler = () => {
    setSuccessModal(false);
    navigate("/");
  };
  return (
    <div>
      <ErrorModal error={errorModal} onClear={errorHandler} />
      <SuccessModal
        success={successModal}
        successMessage="User Details Updted Successfully!"
        onClear={successHandler}
      />
      {isLoading && <LoadingSpinner asOverlay />}
      <div id="MyAccount_Head">
        <h3>Update My Account :</h3>
        <Link to={"/updatepassword"}>Update Password </Link>
      </div>
      <div id="MyAccount">
        <form onSubmit={formSubmitHandler}>
          <div id="MyAccount_flex">
            <div>
              <label>Name :</label>
              <br></br>
              <input
                type="text"
                className="MyAccount_input"
                value={userDetails.name}
                onChange={onFormChangeHandler}
                name="name"
              />
              <br></br>
              <br></br>
              <label>E-mail : </label>
              <br></br>
              <input
                type="email"
                className="MyAccount_input"
                value={userDetails.email}
                onChange={onFormChangeHandler}
                name="email"
              />
              <br></br>
              <br></br>
              <label>Phone :</label>
              <br></br>
              <input
                type="tel"
                className="MyAccount_input"
                name="phone"
                onChange={onFormChangeHandler}
                value={userDetails.phone}
              />
              <br></br>
              <br></br>
              <label>Address :</label>
              <br></br>
              <input
                type="text"
                className="MyAccount_input"
                name="address"
                onChange={onFormChangeHandler}
                value={userDetails.address}
              />
              <br></br>
              <br></br>

              <button type="submit" id="MyAccount_btn">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default MyAccount;
