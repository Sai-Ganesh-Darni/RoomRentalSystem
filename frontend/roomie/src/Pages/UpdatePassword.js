import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/auth-context";

import "./UpdatePassword.css";
import logo from "../assets/images/logo.png";

import ErrorModal from "../UIElements/ErrorModal";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import SuccessModal from "../UIElements/SuccessModal";

const UpdatePassword = () => {
  const navigate = useNavigate();

  const auth = useContext(AuthContext);
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState("");
  const [success, setSuccess] = useState(false);

  const [error, setError] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(true);
    } else {
      setError(false);
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/users/updateMyPassword`,
          {
            method: "PATCH",
            body: JSON.stringify({
              passwordCurrent: passwordCurrent,
              password: password,
            }),
            headers: {
              Authorization: `Bearer ${auth.token}`,
              "Content-Type": "application/json; charset=UTF-8",
            },
          }
        );
        const responseData = await response.json();
        console.log(
          "response data in update password handler >>>",
          responseData
        );
        if (responseData.status === "fail" || responseData.status === "error") {
          throw new Error(
            responseData.message || "error in update password backend"
          );
        }
        auth.login(auth.userId, responseData.token);
        setIsLoading(false);
        setSuccess(true);
      } catch (err) {
        setIsLoading(false);
        setErrorModal(err.message || "error in updating password");
        console.log("error in updating password in backend");
      }
    }
    console.log("submit is clicked");
  };

  const errorHandler = () => {
    setErrorModal(null);
  };

  const successHandler = () => {
    setSuccess(false);
    navigate("/");
  };
  return (
    <div id="updatepassword">
      <ErrorModal error={errorModal} onClear={errorHandler} />
      <SuccessModal
        success={success}
        successMessage="Password Updated Successfully!"
        onClear={successHandler}
      />
      {isLoading && <LoadingSpinner asOverlay />}
      <div className="mainDiv">
        <div className="cardStyle">
          <form onSubmit={submitHandler} id="signupForm">
            <img src={logo} id="signupLogo" alt="logo" />

            <h2 className="formTitle">Update Your Password</h2>

            <div className="inputDiv">
              <label className="inputLabel">Currnet Password</label>
              <input
                type="password"
                id="passwordCurrent"
                name="passwordCurrent"
                required
                minLength={6}
                placeholder={"Currnet Password "}
                value={passwordCurrent}
                onChange={(e) => setPasswordCurrent(e.target.value)}
              />
            </div>
            <div className="inputDiv">
              <label className="inputLabel">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                placeholder={"Enter Password "}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="inputDiv">
              <label className="inputLabel">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                minLength={6}
                placeholder={"Renter Password "}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && (
              <div
                style={{
                  textAlign: "center",
                  paddingTop: "20px",
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                <span>
                  <i className="fa fa-key" aria-hidden="true"></i>Password don't
                  match.
                </span>
              </div>
            )}
            <div className="buttonWrapper">
              <button type="submit" id="submitButton" className="submitButton">
                <span>Continue </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default UpdatePassword;
