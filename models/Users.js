const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;


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
  var rand,mailOptions,host,link;


const generateToken = (userData) => {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);
  return jwt.sign({id: userData._id, email: userData.email}, process.env.jwtsecret, {
    expiresIn: '1800s'

  });
}

const UsersSchema = new Schema({
  email : {
    type : String,
    required : true,
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"]
  },
  nickname : {
    type : String,
    required : true,
    validate: [({ length }) => length <= 20, "Nickname must be less than 20 characters"]
  },
  password : {
    type : String,
    required : true,
    trim: true,
    match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, "Password not strong enough"]
  },
  ageCheck : {
    type: Boolean,
    required : true
  },
  policyCheck : {
    type: Boolean,
    required : true,
  },
  validEmail : {
    type: Boolean,
    required : true,
    default : false
  },
  plans: [
    {
        type: Schema.Types.ObjectId,
        ref: "Plan"
    } 
  ]
});

UsersSchema.pre('save', async function(next){
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

//We'll use this later on to make sure that the user trying to log in has the correct credentials
UsersSchema.methods.isValidPassword = async function(password){
  const compare = await bcrypt.compare(password, this.password);
  return compare;
}

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);
  return jwt.sign({id: this._id, email: this.email}, process.env.jwtsecret, {
    expiresIn: '1800s'
  });
}

UsersSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
    nickname: this.nickname,
    plans: this.plans,
  };
};

UsersSchema.methods.verifyEmail = function(){

  link="http://localhost:3000/verified?id="+this._id;
  mailOptions={
      to : this.email,
      subject : "Please confirm your Email account",
      html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
  }
  smtpTransport.sendMail(mailOptions, function(error, response){
   if(error){
          console.log(error);
      res.end("error");
   }else{
          console.log("Message sent: " + response.message);
      res.end("sent");
       }
})

  return console.log("endofverify")
};

UsersSchema.methods.passwordReset = function(){
  const token = generateToken(this)
  return token
  
}

const UserModel = mongoose.model('Users', UsersSchema);

module.exports = UserModel;

