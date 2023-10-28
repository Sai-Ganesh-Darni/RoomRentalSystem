import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "./ForgotPassword.css"; 

import LoadingSpinner from "../UIElements/LoadingSpinner";
import ErrorModal from "../UIElements/ErrorModal";
import SuccessModal from "../UIElements/SuccessModal";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    // console.log(">>", email);
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/forgotPassword`,
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();
      // console.log("Response Data >>>", responseData);
      if (responseData.status === "fail" || responseData.status === "error") {
        throw new Error(
          responseData.message || "error in backend in forgot password"
        );
      }
      setIsLoading(false);
      setSuccess(true);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "error in catch block of forgot password");
      console.log("error in try block in forgot password conmponent");
    }
    // console.log("submitted form");
  };

  const errorHandler = () => {
    setError(null);
  };

  const successHandler = () => {
    setSuccess(false);
    navigate("/");
  };
  return (
    <div id="forgot_password">
      <ErrorModal error={error} onClear={errorHandler} />
      <SuccessModal
        success={success}
        successMessage="Check Your Email for Reset Password link.."
        onClear={successHandler}
      />
      {isLoading && <LoadingSpinner asOverlay />}
      <div className="row">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <h1>Forgot Password ?</h1>
        <h6 className="information-text">
          Enter your registered email to reset your password.
        </h6>
        <form>
          <div className="form-group">
            <input
              type="email"
              name="user_email"
              id="user_email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <p>
              <label htmlFor="username">Email</label>
            </p>
            <button onClick={submitHandler} type="submit">
              Reset Password
            </button>
          </div>
        </form>
        <div className="footer">
          <h5>
            New here? <Link to={"/signup"}>Sign Up.</Link>
          </h5>
          <h5>
            Already have an account? <Link to={"/login"}>Sign In.</Link>
          </h5>
          <p class="information-text">
            <span class="symbols" title="Lots of love from me to YOU!">
              &hearts;{" "}
            </span>
            <a href="https://www.linkedin.com/in/sai-ganesh-darni-260589201/">
              Sai Ganesh Darni
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
