import { useState, useEffect, useContext } from "react";

import "./MyRooms.css";
import RoomCard from "./RoomCard";
import RoomList from "./RoomList";
import { AuthContext } from "../context/auth-context";

import ErrorModal from "../UIElements/ErrorModal";
import LoadingSpinner from "../UIElements/LoadingSpinner";

const MyRooms = () => {
  const auth = useContext(AuthContext);

  const [loadedRooms, setLoadedRooms] = useState();
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getRooms = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/rooms/rooms/${auth.userId}`
        );
        const responseData = await response.json();
        console.log("loadedRooms >> ", responseData.data.rooms);
        setLoadedRooms(responseData.data.rooms);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err.message || "error while getting rooms by user id");
        console.log("Error while retrieving");
      }
    };
    getRooms();
  }, [auth.userId]);

  const clearError = () => {
    setError(false);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedRooms && <RoomList items={loadedRooms} />}
    </>
  );
};

export default MyRooms;
