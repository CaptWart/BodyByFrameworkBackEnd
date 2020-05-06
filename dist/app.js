"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _compression = _interopRequireDefault(require("compression"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _helmet = _interopRequireDefault(require("helmet"));

var _morgan = _interopRequireDefault(require("morgan"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _index = _interopRequireDefault(require("./routes/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var session = require("express-session");

var MongoStore = require("connect-mongo")(session);

var passport = require("./passport/setup");

var auth = require("./routes/auth");

var path = require("path");

//import usersRouter from './routes/users';
_dotenv["default"].config();

var app = (0, _express["default"])(); // database setup

var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/mydb';
var mongooseConfigs = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

_mongoose["default"].connect(mongoUri, mongooseConfigs).then(console.log("MongoDB connected ".concat(mongoUri)))["catch"](function (err) {
  return console.log(err);
});

app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use((0, _cookieParser["default"])());
app.use((0, _helmet["default"])());
app.use((0, _cors["default"])());
app.use((0, _compression["default"])()); // Express Session

app.use(session({
  secret: "very secret this is",
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: _mongoose["default"].connection
  })
}));
app.use('/api', _index["default"]); //app.use('/api/users', usersRouter);
// Passport middleware

app.use(passport.initialize());
app.use(passport.session()); // Routes

app.use("/api/auth", auth);
app.get("/", function (req, res) {
  return res.sendFile(path.join(__dirname, "/public/index.html"));
});
module.exports = app;