const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const secret = 'secret';

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
    default : false
  },
  policyCheck : {
    type: Boolean,
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
  //'this' refers to the current document about to be saved
  const user = this;
  //Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
  //your application becomes.
  const hash = await bcrypt.hash(this.password, 10);
  //Replace the plain text password with the hash and then store it
  this.password = hash;
  //Indicates we're done and moves on to the next middleware
  next();
});

//We'll use this later on to make sure that the user trying to log in has the correct credentials
UsersSchema.methods.isValidPassword = async function(password){
  const user = this;
  //Hashes the password sent by the user for login and checks if the hashed password stored in the
  //database matches the one sent. Returns true if it does else false.
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);
  return jwt.sign({id: this._id, email: this.email}, secret, {
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

const UserModel = mongoose.model('Users', UsersSchema);

module.exports = UserModel;

