import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

import ErrorModal from "../UIElements/ErrorModal";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import { AuthContext } from "../context/auth-context";

import login from "../assets/images/login.jpg";

const Login = (props) => {
  const navigate = useNavigate();

  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [password, setPassword] = useState();
  const [email, setEmail] = useState();

  const loginHandler = async (e) => {
    e.preventDefault();
    const data = { email: email, password: password };
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      // console.log("response : " + response);
      // console.log("Response Data : " + responseData);
      // console.log("Response Data : " + responseData.status);
      // console.log("Response Data : " + responseData.token);
      if (responseData.status === "fail" || !response.ok) {
        throw new Error(responseData.message);
      }

      auth.login(responseData.userId, responseData.token);
      setIsLoading(false);
      navigate("/");
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Error While Loging");
      console.log("Error in fetching user data");
    }
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <div id="container2">
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}
      <div style={{ display: "flex" }}>
        <div>
          <b>
            <h1 id="Sih">Sign in</h1>
          </b>
          <p className="S1">
            Don't have an account ?{" "}
            <Link to={"/signup"} id="snv">
              {" "}
              SignUp{" "}
            </Link>
          </p>
          <form onSubmit={loginHandler}>
            <div style={{ paddingTop: "30px" }}>
              <p>E-mail:</p>
              <input
                type="email"
                placeholder="email@email.com"
                className="inpT"
                onChange={(e) => setEmail(e.target.value)}
              />
              <br></br>
              <br></br>
              <p>Password:</p>
              <input
                type="password"
                placeholder="**********"
                className="inpT"
                onChange={(e) => setPassword(e.target.value)}
              />
              <br></br>
              <Link id="FPP" as={Link} to={"/forgotpassword"}>
                Forgot Password?
              </Link>
              <br></br>
              <button type="submit" className="buttonSig">
                Submit
              </button>
            </div>
          </form>
        </div>
        <div>
          <img src={login} alt="Error" id="imageLogin" />
        </div>
      </div>
    </div>
  );
};
export default Login;
