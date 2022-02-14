const { model, Schema } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
  {
    pizzaName: { type: String },
    createdBy: { type: String },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal) //using a getter function from utils
    },
    size: { type: String, default: 'Large' },
    toppings: [],
    // References Comment Model
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
  },
  {
    // tells schema to use virtuals, no need to return id
    toJSON: { virtuals: true, getters: true },
    id: false
  }
);

// virtual function, not store, usually calculated
PizzaSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});
// Create pizza model with schema
const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;
