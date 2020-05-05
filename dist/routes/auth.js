"use strict";

var express = require("express");

var router = express.Router();

var passport = require("passport");

router.post("/register_login", function (req, res, next) {
  console.log(req.body);
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        errors: err
      });
    }

    if (!user) {
      return res.status(400).json({
        errors: "No user found"
      });
    }

    req.logIn(user, function (err) {
      if (err) {
        return res.status(400).json({
          errors: err
        });
      }

      return res.status(200).json({
        success: "logged in ".concat(user.id)
      });
    });
  })(req, res, next);
});
module.exports = router;