import "./App.css";
import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import MainNavigation from "./Navigation/MainNavigation";

import Home from "./Home";
import Footer from "./Footer";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import About from "./Pages/About";
import ContactUs from "./Pages/ContactUs";
import AddNewRoom from "./rooms/AddNewRoom";

import MapBox from "./Pages/MapBox";

import MyAccount from "./Pages/MyAccount";
import Test from "./Test";

import { AuthContext } from "./context/auth-context";
import MyRooms from "./rooms/MyRooms"

import RoomCard from "./rooms/RoomCard";
import UpdateRoom from "./rooms/UpdateRoom";
import RoomDetails from "./rooms/RoomDetails";
import RoomList from "./rooms/RoomList";

import UpdatePassword from "./Pages/UpdatePassword";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import AllRooms from "./rooms/AllRooms";

let logoutTimer;

function App() {
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loadedRooms, setLoadedRooms] = useState();
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // one hour
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  // useEffect(() => {
  //   const getRooms = async () => {
  //     try {
  //       setIsLoading(true);
  //       const response = await fetch(
  //         `${process.env.REACT_APP_BACKEND_URL}/allrooms`
  //       );
  //       const responseData = await response.json();
  //       console.log("loadedRooms >> ", responseData.data.rooms);
  //       setLoadedRooms(responseData.data.rooms);
  //       setIsLoading(false);
  //     } catch (err) {
  //       setIsLoading(false);
  //       setError(err.message || "error while getting rooms by user id");
  //       console.log("Error while retrieving");
  //     }
  //   };
  //   getRooms();
  // }, []);

  const clearError = () => {
    setError(false);
  };

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);


  let routes;
  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/addnewroom" element={<AddNewRoom />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/MyRooms" element={<MyRooms/>}/>
        <Route path="/updateroom/:roomId" element={<UpdateRoom />} />
        <Route path="/roomdetails/:roomId" element={<RoomDetails />} />
        <Route path="/updatepassword" element={<UpdatePassword />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/RoomList" element={<AllRooms />}/>
        <Route path="*" element={<h1>Route Not Found</h1>} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/RoomList" element={<AllRooms />}/>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/test" element={<Test />} />
        <Route path="/testroomcard" element={<RoomCard />} />
        <Route path="/roomdetails/:roomId" element={<RoomDetails />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        <Route
          path="*"
          element={
            <h1>
              Error
              <p>Error</p>
              <p>Error</p>
              <p>Error</p>
            </h1>
          }
        />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <nav id="mainnavigation">
          <MainNavigation />
        </nav>
        {routes}
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
}
export default App;
