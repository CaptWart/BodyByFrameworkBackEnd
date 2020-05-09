const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../middleware/auth');
const Users = mongoose.model('Users');
require('../middleware/passport')
//POST new user route (optional, everyone has access)

const secret = 'secret';

var express = require('express')
var cors = require('cors')
var app = express()
var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


router.post('/createUser',  (req, res, next) => {
  const user = req.body;
  console.log(req.body)
  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  const finalUser = new Users(user);

  finalUser.isValidPassword(user.password);

  return finalUser.save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }));
});

//POST login route (optional, everyone has access)
router.post('/login', cors(corsOptions), (req, res, next) => {
  const user = req.body;
  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('login', { session: true }, (err, passportUser, info) => {
    if(err) {
      console.log("bad login")
      return next(err);
    }

    if(passportUser) {
      let user = passportUser;
      const token = passportUser.generateJWT();
      console.log(token)
      return res.cookie('token', token, { httpOnly: true, secure: false }).sendStatus(200);

      //return res.json({ user: user.toAuthJSON() });
    }

    return status(400).info;
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth, (req, res, next) => {
  //const { payload: { id } } = req;
  //console.log(req.id)
  return Users.findById(req.id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }
        const payload = user.toAuthJSON()
        console.log("payload ", payload)
      return res.send(payload);
    });
});

router.get('/logout', (req, res, next) => {
  console.log("hi")
  res.clearCookie('token');
  res.send("hi")
})

module.exports = router;