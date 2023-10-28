const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const Room = require("./models/room");
const User = require("./models/user");

let data = [
  {
    title: "Hyderabad",
    room_type: "Private",
    building_type: "apartment",
    email: "test@test.com",
    phone: 1234567890,
    rent: 120,
  },
  {
    title: "Chennai",
    room_type: "Shared",
    building_type: "Gated ",
    email: "company@company.com",
    phone: 0987654321,
    rent: 200,
  },
];

const fillDummyRoomsData = async (req, res, next) => {
  try {
    await Room.insertMany(data);
  } catch (err) {
    console.log("error in inserting rooms data");
  }
  process.exit();
};

const deleteRoomsData = async (req, res, next) => {
  try {
    await Room.deleteMany();
    console.log("Successfully Deleted Room Collection");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteUsersData = async (req, res, next) => {
  try {
    await User.deleteMany();
    console.log("Successfully Deleted User Collection");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--dr") {
  deleteRoomsData();
} else if (process.argv[2] === "--du") {
  deleteUsersData();
}

if (process.argv[2] === "--cr") {
  fillDummyRoomsData();
}

mongoose
  .connect(
    process.env.DATABASE_LOCAL,
    //    {
    //   useNewUrlParser: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false, // to deal with deprecation warnings
    // }
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
  )
  .then((conn) => {
    // console.log(conn.connections);
    console.log("DB Connection Successful!");
  });
