import express from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import mongoose from 'mongoose';

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("./passport/setup");
const auth = require("./routes/auth");
var path = require("path");

import indexRouter from './routes/index';
//import usersRouter from './routes/users';
dotenv.config();
const app = express();

// database setup
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/mydb';
const mongooseConfigs = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose
    .connect(mongoUri, mongooseConfigs)
    .then(console.log(`MongoDB connected ${mongoUri}`))
    .catch(err => console.log(err));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(compression());

// Express Session
app.use(
    session({
        secret: "very secret this is",
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
);

app.use('/api', indexRouter);
//app.use('/api/users', usersRouter);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", auth);
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));

module.exports = app;
