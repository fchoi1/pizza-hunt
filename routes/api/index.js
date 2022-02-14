const router = require('express').Router();
const pizzaRoutes = require('./pizza-routes');
const commentRoutes = require('./comments-routes');

router.use('/pizzas', pizzaRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
