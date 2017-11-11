'use strict';

const mongoose = require('mongoose'),
      Schema   = mongoose.Schema,

      pizzaSchema = new Schema({
            name: { type: String, unique: true, required: true },
            description: { type: String,  required: true },
            price: { type: String,  required: true },
            created_at: { type: Date, default: Date.now },
            updated_at: { type: Date },
            img: { type: String },
            ingredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }]
      });

const Pizza = mongoose.model('Pizza', pizzaSchema);

// Tentative échouée
pizzaSchema.pre("save", function (next) {
      const currentDate = new Date;
      this.updated_at = currentDate.now;
      next();
});

module.exports = Pizza;