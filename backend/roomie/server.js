// configuration for server

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

// console.log(app.get("env"));
// console.log(process.env);
// console.log(process.env.PORT);
console.log("ENVIRONMENT = " + process.env.NODE_ENV);
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

// Starting Server
const port = 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});
