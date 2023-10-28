const mongoose = require("mongoose");
const multer = require("multer");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const Room = require("../models/room");
const User = require("../models/user");
const AppError = require("../utils/appError");
const { fstat } = require("fs");

const aliasTopRooms = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "rent";
  // req.query.fields = "title";
  next();
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/rooms");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `room-${Date.now()}.${ext}`);
  },
});

// const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please Upload Image Only!"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// upload.single("image"); //=>req.file
// const uploadRoomImages = upload.array("images", 3); // req.files
const uploadRoomImages = upload.array("images"); // it will automatically adds  req.files

const createRoom = async (req, res, next) => {
  let imageFileNames = [];
  req.files.forEach((obj) => {
    imageFileNames.push(obj.filename);
  });

  let createdRoom = new Room({
    title: req.body.title,
    room_type: req.body.room_type,
    building_type: req.body.building_type,
    utilities_included: req.body.utilities_included,
    pets_allowed: req.body.pets_allowed,
    rent: req.body.rent,
    village: req.body.village,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    country: req.body.country,
    description: req.body.description,
    first_date_available: req.body.first_date_available,
    email: req.body.email,
    phone: req.body.phone,
    creator: req.user._id,
    images: imageFileNames,
  });

  try {
    await createdRoom.save();
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { rooms: createdRoom } }
    );
  } catch (err) {
    return next(
      new Error("Error While Inserting Created Room Id in Users Room Array!")
    );
  }

  res.json({
    status: "success",
    data: {
      createdRoom,
    },
  });
};

const updateRoomById = async (req, res, next) => {
  const to_update = {
    title: req.body.title,
    room_type: req.body.room_type,
    building_type: req.body.building_type,
    utilities_included: req.body.utilities_included,
    pets_allowed: req.body.pets_allowed,
    rent: req.body.rent,
    village: req.body.village,
    city: req.body.city,
    state: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    description: req.body.description,
    first_date_available: req.body.first_date_available,
    email: req.body.email,
    phone: req.body.phone,
  };

  let imageFileNames = [];
  req.files.forEach((obj) => {
    imageFileNames.push(obj.filename);
  });
  if (imageFileNames.length === 0) {
    // delete
    console.log("zero images");
  } else {
    console.log("non zero images");
    to_update.images = imageFileNames;
  }

  try {
    const room = await Room.findByIdAndUpdate(req.params.roomId, to_update, {
      new: true, // to return newly updated document to client
      runValidators: true,
    });

    if (!room) {
      return next(new AppError("No Room Found with given ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: room,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const getAllRooms = async (req, res, next) => {
  try {
    // 1A) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // console.log(JSON.parse(queryStr));
    // console.log(req.query, queryObj);
    // const query = await Room.find(JSON.parse(queryStr));
    // const query = await Room.find(queryObj);
    // const rooms = await Room.find(req.query);
    // const rooms = await Room.find();

    // 2) SORTING
    let query = Room.find(JSON.parse(queryStr));
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
      // sort('field1' 'field2');
    }

    // 3) Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1; // multiply with 1 to convert string number to integer
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numRooms = await Room.countDocuments();
      if (skip >= numRooms) {
        throw new Error("This Page Doesn't Exist!");
      }
    }

    const rooms = await query;
    res.json({
      status: "success",
      data: rooms,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId);
    console.log(room, req.params.roomId);

    if (!room) {
      return next(new AppError("No Room Found with given ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: room,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const getRoomsByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let rooms;
  try {
    rooms = await User.findById(userId).populate("rooms");
    console.log(rooms);
    res.json({
      status: "success",
      data: rooms,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const deleteRoomById = async (req, res, next) => {
  let roomToDelete;
  try {
    roomToDelete = await Room.findById(req.params.roomId);
  } catch (err) {
    return next(new AppError("No Room Found with given ID", 404));
  }

  console.log("room To Delete >>> ", roomToDelete);
  let room;
  try {
    room = await Room.findByIdAndDelete(req.params.roomId);
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message || "Error While Deleting Room",
    });
  }

  try {
    await User.findOneAndUpdate(
      { _id: roomToDelete.creator },
      { $pull: { rooms: roomToDelete._id } }
    );
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message || "Error While poppig room id from user document",
    });
  }

  // deleting uploaded room Images
  if (process.env.ROOM_IMG_FILE_PATH) {
    for (let img_file of roomToDelete.images) {
      fs.unlink(`${process.env.ROOM_IMG_FILE_PATH}${img_file}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  } else {
    console.log("Please Configure Path to files in env");
  }

  res.json({
    status: "success",
    data: room,
  });
};

const protect = async (req, res, next) => {
  //1)Getting Token
  // console.log(req.headers);
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Your are not Logged In!", 401));
  }
  //2)Verification

  let decoded = "";
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);
  } catch (err) {
    return next(new AppError("Invalid JWT Token! Please Login Again!", 401));
  }
  //3)Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  //4) Check if user changed password after token was issued
  // if password is changed recently throw error

  // grant access
  req.user = freshUser;
  next();
};

exports.aliasTopRooms = aliasTopRooms;
exports.uploadRoomImages = uploadRoomImages;
exports.createRoom = createRoom;
exports.updateRoomById = updateRoomById;
exports.deleteRoomById = deleteRoomById;
exports.protect = protect;

exports.getAllRooms = getAllRooms;
exports.getRoomById = getRoomById;
exports.getRoomsByUserId = getRoomsByUserId;
