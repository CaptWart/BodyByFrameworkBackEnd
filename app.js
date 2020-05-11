const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const passport = require('passport');

const apiUsersRouter = require("./routes/api/users");
const apiPlansRouter = require("./routes/api/plans");
const apiDaysRouter = require("./routes/api/days");
const apiFitnessesRouter = require("./routes/api/fitnesses");
const apiFoodsRouter = require("./routes/api/foods");

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

//Initiate our app
const app = express();

app.disable('etag');

//Configure our app
//app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secret', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

if(!isProduction) {
  app.use(errorHandler());
}

//Configure Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/passport-jwt', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;


//Models & routes
require('./models/Users');
app.use(require('./middleware'));
app.use(require('./routes/users'));
app.use('/api/users', apiUsersRouter);
app.use("/api/plans", apiPlansRouter);
app.use("/api/days", apiDaysRouter);
app.use("/api/fitnesses", apiFitnessesRouter);
app.use("/api/foods", apiFoodsRouter);

app.use(passport.initialize());
app.use(passport.session());
require('./middleware/passport');
//Error handlers & middlewares
if(!isProduction) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

app.listen(3001, () => console.log('Server running on http://localhost:3001/'));