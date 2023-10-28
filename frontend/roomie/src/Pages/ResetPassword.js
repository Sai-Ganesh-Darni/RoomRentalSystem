import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import logo from "../assets/images/logo.png";
import "./ResetPassword.css";

import SuccessModal from "../UIElements/SuccessModal";
import ErrorModal from "../UIElements/ErrorModal";
import LoadingSpinner from "../UIElements/LoadingSpinner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(false);
  const [errorModal, setErrorModal] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(true);
    } else {
      setError(false);
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/users/resetPassword/${token}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              password: password,
            }),
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
          }
        );
        const responseData = await response.json();
        console.log("responseData>>", responseData);
        if (responseData.status === "fail" || responseData.status === "error") {
          throw new Error(
            responseData.message || "error in resetting the password"
          );
        }
        setIsLoading(false);
        setSuccess(true);
      } catch (err) {
        setIsLoading(false);
        setErrorModal(err.message || "error in resetting password");
        console.log("err>>", err.message);
      }
    }
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
        successMessage="Reset Password Successful!"
        onClear={successHandler}
      />
      {isLoading && <LoadingSpinner asOverlay />}
      <div className="mainDiv">
        <div className="cardStyle">
          <form
            onSubmit={submitHandler}
            id="signupForm"
            encType="multipart/form-data"
          >
            <img src={logo} id="signupLogo" alt="logo" />

            <h2 className="formTitle">Reset Your Password</h2>

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

export default ResetPassword;
