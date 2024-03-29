const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: {
    type: String,
     unique: true, 
     lowercase: true, 
     trim: true, 
     required: 'Email address is required'
  },
  password: { type: String },
  resetPasswordToken: String,
  passwordExpiry: { type: Date },
  entrepreneur: {
    name: String,
    description: String,
    status: {type: String, default: 'pending'}, //complete, pending
  },
  vendor: {
    name: String,
    description: String,
    status: {type: String, default: 'pending'}, //complete, pending
  },
  student : {
    name: String,
    description: String,
    status: {type: String, default: 'pending'}, //complete, pending
  },
  investor : {
    name: String,
    description: String,
    status: {type: String, default: 'pending'}, //complete, pending
  },
  profileType: [String] // [student], [vendor, investor]

});


userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User