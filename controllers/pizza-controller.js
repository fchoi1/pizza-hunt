const { Pizza } = require('../models');

const pizzaController = {
  // find pizza
  getAllPizza: async (req, res) => {
    try {
      const dbPizzaData = await Pizza.find({})
        // popluate() is the join equivalent
        .populate({
          path: 'comments',
          select: '-__v' // minus sign is not to select the _v field for comments
        })
        .select('-__v') // minus sign to not select __V field for Pizza
        .sort({ _id: -1 }); // sort by DESC order, gets newest pizza by timestamp in id
      res.json(dbPizzaData);
      dbPizzaData.forEach((item) => {
        console.log('comment count:', item.commentCount);
      });
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
  // find one pizza
  getPizzaById: async ({ params }, res) => {
    try {
      const dbPizzaData = await Pizza.findOne({ _id: params.id })
        // popluate() is the join equivalent
        .populate({
          path: 'comments',
          select: '-__v' // minus sign is not to select the _v field for comments
        })
        .select('-__v'); // minus sign to not select __V field for Pizza
      if (!dbPizzaData) {
        res.status(404).json({ message: 'No pizza found with this id!' });
        return;
      }
      res.json(dbPizzaData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
  // Create pizza
  createPizza: async ({ body }, res) => {
    try {
      const dbPizzaData = await Pizza.create(body);
      console.log('creating pizza', body);
      res.json(dbPizzaData);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // update a pizza (find single document and update, new version of the doc)
  updatePizza: async ({ params, body }, res) => {
    try {
      const dbPizzaData = await Pizza.findOneAndUpdate(
        { _id: params.id },
        body,
        {
          new: true,
          runValidators: true // For update to validate data
        }
      );
      if (!dbPizzaData) {
        res.status(404).json({ message: 'No pizza found with this id!' });
        return;
      }
      res.json(dbPizzaData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
  //delete pizza
  deletePizza: async ({ params }, res) => {
    try {
      const dbPizzaData = await Pizza.findOneAndDelete({ _id: params.id });
      if (!dbPizzaData) {
        res.status(404).json({ message: 'No pizza found with this id!' });
        return;
      }
      res.json(dbPizzaData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
  dropDb: async (req, res) => {
    try {
      const dpPizzaData = await Pizza.remove();
      console.log('collection removed', dpPizzaData);

      res.json({ message: 'model dropped' });
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
};

module.exports = pizzaController;
