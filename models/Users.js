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
  var rand,mailOptions,host;


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
    unique : true
  },
  nickname : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  ageCheck : {
    type: Boolean,
    required : true,
    default : false
  },
  policyCheck : {
    type: Boolean,
    required : true,
    default : false
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

// Not working...
UsersSchema.pre("findOneAndDelete", function(next) {
  Plan.deleteMany({userID: this._id}).exec();
  Day.deleteMany({userID: this._id}).exec();
  Fitness.deleteMany({userID: this._id}).exec();
  Food.deleteMany({userID: this._id}).exec();
  next();
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

  console.log("this: " + this._id)
  const link=process.env.frontendtest+"/verified?id="+this._id;
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
      console.log(link)
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

