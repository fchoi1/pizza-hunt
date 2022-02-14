const { model, Schema } = require('mongoose');

const PizzaSchema = new Schema({
  pizzaName: {
    type: String
  },
  createdBy: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  size: {
    type: String,
    default: 'Large'
  },
  toppings: []
});

// Create pizza model with schema
const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;
