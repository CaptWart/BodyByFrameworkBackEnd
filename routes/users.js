const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../middleware/auth');
const Users = mongoose.model('Users');
require('../middleware/passport')

const bcrypt = require('bcryptjs');

//POST new user route (optional, everyone has access)
var dotenv = require('dotenv');
dotenv.config();


const nodemailer = require("nodemailer");

const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.sendEmail,
      pass: process.env.sendPassword
    }
  });
//   var rand,mailOptions,host,link;


var express = require('express')
var cors = require('cors')
var app = express()
var corsOptions = {
  origin: process.env.frontendtest,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


router.post('/createUser',  (req, res, next) => {
  const result = res
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

  Users.findOne({"email": req.body.email}).then(res => {
    console.log(res)
    if(res){
      return result.sendStatus(400)
    }
    // else if(res == null){
    //   return result.sendStatus(400)
    // }
    else{
      const finalUser = new Users(user);
      finalUser.isValidPassword(user.password);
      return finalUser.save()
      .then(() => result.json({ user: finalUser.toAuthJSON(), user: finalUser.verifyEmail() }));
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
      return res.sendStatus(401);
    }

    if(passportUser) {
      const token = passportUser.generateJWT();
      return res.cookie('token', token, { httpOnly: true, secure: false }).sendStatus(200);
    }

    return status(400).info;
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth, (req, res, next) => {
  const status = res;
  if(!req.id){
    return res.send("no id")
  }
  return Users.findOne({"_id" : req.id})
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }
      console.log(user.validEmail)
      if(!user.validEmail){
        user.verifyEmail()
        return status.sendStatus(403)
      }
        const payload = user.toAuthJSON()
      return res.send(payload);
    });
});

router.get('/logout', (req, res, next) => {
  res.clearCookie('token');
  res.redirect("/login")
})

//find user by id then set verify email to true
router.get('/verifyEmail', (req, res, next) => {
  const status = res;
  return Users.findOneAndUpdate({ _id: req.query.id }, 
    {$set : {validEmail: true}}, function(err, data){
      status.sendStatus(200)
    })
})

// router.get('/send', (req, res, next) => {
//     host=req.get('host');
//     link="http://"+req.get('host')+"/verify?id="+rand;
//     mailOptions={
//         to : req.query.email,
//         subject : "Please confirm your Email account",
//         html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
//     }
//     console.log(mailOptions);
//     smtpTransport.sendMail(mailOptions, function(error, response){
//      if(error){
//             console.log(error);
//         res.end("error");
//      }else{
//             console.log("Message sent: " + response.message);
//         res.end("sent");
//          }
//   })
// });

// //encrypt token from email and send password link with token in header
router.post('/sendPasswordReset', cors(corsOptions), (req, res, next) => {
  const userEmail = req.body.email;
  Users.findOne({email: userEmail})
  .then(user => {
    if(!user){
      console.log("no user")
    }
    else {
      const token = user.passwordReset()
      console.log(token)
      link=process.env.frontendtest+"/forgotpasswordChange?token="+token;
      mailOptions={
          to : userEmail,
          subject : "Body By Framework Password Reset",
          html : "Hello,<br> Please Click on the link to reset your password.<br><a href="+link+">Click here to reset</a>"
      }
      console.log(mailOptions);
      smtpTransport.sendMail(mailOptions, function(error, response){
       if(error){
              console.log(error);
          res.end("error");
       }else{
              console.log("Message sent: " + response.message);
          res.end("sent");
           }
       })

      return res.sendStatus(200)
    }
  })
})

router.get('/passwordReset', auth, (req, res, next) => {
  res.json("success")
})

router.post('/passwordReset', auth, async (req, res, next) => {
  const hash =  await bcrypt.hash(req.body.password, 10);
  return Users.findOneAndUpdate({_id: req.id}, {$set : {password: hash}}, function(err, data){
    res.sendStatus(200)
  })
})

router.post('/changePassword', auth, async (req, res, next) => {
  const hash =  await bcrypt.hash(req.body.password, 10);
  return Users.findOneAndUpdate({_id: req.id}, {$set : {password: hash}}, function(err, data){
  })

})

module.exports = router;