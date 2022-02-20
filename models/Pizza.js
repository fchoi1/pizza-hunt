const { model, Schema } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      required: 'You need to provide a pizza name!',
      trim: true
    },
    createdBy: {
      type: String,
      required: 'You need a user to create/update a pizza!',
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal) //using a getter function from utils
    },
    size: {
      type: String,
      default: 'Large',
      required: true,
      // Enumerable set of data that can be iterated over
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large']
    },
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
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length + 1,
    0
  );
});

// Create pizza model with schema
const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;
