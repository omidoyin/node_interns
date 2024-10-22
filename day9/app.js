var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var getTokenRouter = require("./routes/getToken");
var authMiddleware = require("./services/authMiddleware");
var maintenanceMiddleware = require("./services/maintenanceMiddleware");
var errorHandler = require("./services/errorHandler");

const db = require("./models");
var cors = require("cors");

var app = express();
app.set("db", db);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(maintenanceMiddleware);
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// Maintenance middleware (applies to all routes)

// Authentication middleware (applies to all API routes)
app.use("/token", getTokenRouter);
app.use("/api/v1/:portal/*", authMiddleware);

// Example route
app.get("/api/v1/:portal/something", (req, res) => {
  console.log("something");

  res.send(`Hello, user with ID: ${req.user_id}`);
});

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// Global error handler (always keep this at the end)
app.use(errorHandler);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
