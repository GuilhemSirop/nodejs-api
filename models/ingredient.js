'use strict';

const mongoose = require('mongoose'),
      Schema   = mongoose.Schema,

      ingredientSchema = new Schema({
            name: { type: String, required: true },
            description: { type: String },
            weight: { type: String },
            price: { type: String,  required: true },
            created_at: { type: Date, default: Date.now },
            img: { type: String },
            deleted: {type: Boolean, default: false}
      });

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;