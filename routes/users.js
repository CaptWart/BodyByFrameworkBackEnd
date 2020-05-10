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
  const result = res
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

  Users.findOne({"email": req.body.email}).then(res => {
    console.log(!res)
    if(res){
      return console.log("Email already exist")
    }
    else{
      const finalUser = new Users(user);
      finalUser.isValidPassword(user.password);
      return finalUser.save()
      .then(() => result.json({ user: finalUser.toAuthJSON() }));
    }
  })

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
      //console.log(err)
      //res.json("bad login")
      return res.sendStatus(401);
    }

    if(passportUser) {
      let user = passportUser;
      const token = passportUser.generateJWT();
      return res.cookie('token', token, { httpOnly: true, secure: false }).sendStatus(200);
    }

    return status(400).info;
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth, (req, res, next) => {
  return Users.findOne({"_id" : req.id})
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }
        const payload = user.toAuthJSON()
      return res.send(payload);
    });
});

router.get('/logout', (req, res, next) => {
  res.clearCookie('token');
  res.redirect("/login")
})

module.exports = router;