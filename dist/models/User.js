"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ThirdPartyProviderSchema = new _mongoose["default"].Schema({
  provider_name: {
    type: String,
    "default": null
  },
  provider_id: {
    type: String,
    "default": null
  },
  provider_data: {
    type: {},
    "default": null
  }
}); // Create Schema

var UserSchema = new _mongoose["default"].Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  email_is_verified: {
    type: Boolean,
    "default": false
  },
  password: {
    type: String
  },
  referral_code: {
    type: String,
    "default": function _default() {
      var hash = 0;

      for (var i = 0; i < this.email.length; i++) {
        hash = this.email.charCodeAt(i) + ((hash << 5) - hash);
      }

      var res = (hash & 0x00ffffff).toString(16).toUpperCase();
      return "00000".substring(0, 6 - res.length) + res;
    }
  },
  referred_by: {
    type: String,
    "default": null
  },
  third_party_auth: [ThirdPartyProviderSchema],
  date: {
    type: Date,
    "default": Date.now
  },
  fitnesses: [{
    workout: {
      type: String,
      required: "Workout is required to be entered."
    },
    weight: {
      type: Number,
      "default": 0
    },
    sets: {
      type: Number,
      "default": 0
    },
    reps: {
      type: Number,
      "default": 0
    },
    time: {
      type: Number,
      "default": 0
    },
    day: {
      type: Number,
      required: "Day is required."
    }
  }],
  foods: [{
    item: {
      type: String,
      required: "Item is required to be entered."
    },
    calories: {
      type: Number,
      required: "Calories is required to be entered."
    },
    day: {
      type: Number,
      required: "Day is required."
    }
  }],
  monies: [{
    item: {
      type: String,
      required: "Item is required to be entered."
    },
    price: {
      type: Number,
      required: "Price is required to be entered."
    },
    day: {
      type: Number,
      required: "Day is required."
    }
  }]
}, {
  strict: false
});

var User = _mongoose["default"].model("User", UserSchema);

module.exports = User;