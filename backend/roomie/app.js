// all configurations for exprees

const express = require("express");
const app = express(); // will add bunch of methods to app
const morgan = require("morgan"); // HTTP request Logger

const cors = require("cors");

const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const AppError = require("./utils/appError");

// MiddleWares
app.use(express.json()); // body parser

// Data  sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// CORS
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization"
//   );
//   next();
// });

app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// app.use(morgan("tiny"));
// app.use(express.static(`${__dirname}/routes`));
app.use(express.static(`${__dirname}/public`));

const usersRoutes = require("./routes/users-routes");
const roomsRoutes = require("./routes/rooms-routes");
app.use("/api/users", usersRoutes);
app.use("/api/rooms", roomsRoutes);

// Routes
// app.get("/api/", (req, res) => {
//   res.send("OK");
// }); // route handler

// app.post("/api/user/login", (req, res) => {
//   console.log(req.body);
//   res.send("DONE");
// });

// app.get("/api/:userid", (req, res) => {
//   console.log(req.params);
//   res.send("DONE");
// });

// app.all("*", (req, res, next) => {
//   res.status(404).json({
//     status: "fail",
//     message: `Can't Find ${req.originalUrl} on this server!`,
//   });
// });

app.all("*", (req, res, next) => {
  next(new AppError(`Can't Find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
