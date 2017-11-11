'use strict';

const mongoose = require('mongoose'),
      Schema   = mongoose.Schema,

      ingredientSchema = new Schema({
            name: { type: String, unique: true, required: true },
            description: { type: String,  required: true },
            price: { type: String,  required: true },
            created_at: { type: Date, default: Date.now },
            img: { type: String },
      });

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;