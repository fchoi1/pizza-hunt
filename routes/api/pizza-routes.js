const {
  getAllPizza,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
  dropDb,
} = require('../../controllers/pizza-controller');

const router = require('express').Router();
// Set up GET all and POST at /api/pizzas

// /api/pizzas
router.route('/').get(getAllPizza).post(createPizza);

// /api/pizzas/all
router.route('/all').delete(dropDb)

// /api/pizzas/:id
router.route('/:id').get(getPizzaById).put(updatePizza).delete(deletePizza);



module.exports = router;
