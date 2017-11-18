'use strict';

const mongoose = require('mongoose'),
      bcrypt = require('bcrypt'),
      Schema   = mongoose.Schema;

const userSchema = new Schema({
      fullname: { type: String, trim:true, required: true },
      email: { type: String,  trim:true, required: true  },
      hash_password: { type: String,  required: true },
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date }
});


userSchema.method('comparePassword', function (password) {
  return bcrypt.compareSync(password, this.hash_password);
})

const User = mongoose.model('User', userSchema);


module.exports = User;