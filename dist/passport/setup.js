"use strict";

var bcrypt = require("bcryptjs");

var User = require("../models/User.js");

var passport = require("passport");

var LocalStrategy = require("passport-local").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
}); // Local Strategy

passport.use(new LocalStrategy({
  usernameField: "email"
}, function (email, password, done) {
  // Match User
  User.findOne({
    email: email
  }).then(function (user) {
    // Create new User
    if (!user) {
      var newUser = new User({
        email: email,
        password: password
      }); // Hash password before saving in database

      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then(function (user) {
            return done(null, user);
          })["catch"](function (err) {
            return done(null, false, {
              message: err
            });
          });
        });
      }); // Return other user
    } else {
      // Match password
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) throw err;

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: "Wrong password"
          });
        }
      });
    }
  })["catch"](function (err) {
    return done(null, false, {
      message: err
    });
  });
}));
module.exports = passport;