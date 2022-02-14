const { Comment, Pizza } = require('../models');

const commentController = {
  addComment: async ({ params, body }, res) => {
    try {
      const dbCommentData = await Comment.create(body);
      // Update pizza model
      const dbPizzaData = await Pizza.findOneAndUpdate(
        { _id: params.pizzaId },
        { $push: { comments: dbCommentData._id } }, // push method to add comment id to pizza comment array
        { new: true }
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
  removeComment: async ({ params }, res) => {
    try {
      const dbCommentData = await Comment.findOneAndDelete({
        _id: params.commentId
      });
      console.log('deleted comment', dbCommentData)
      if (!dbCommentData) {
        return res.status(404).json({ message: 'No comment with this id!' });
      }
      const dbPizzaData = await Pizza.findOneAndUpdate(
        { _id: params.pizzaId },
        { $pull: { comments: params.commentId } }, // pull function (remove)
        { new: true }
      );
      if (!dbPizzaData) {
        return res
          .status(404)
          .json({ message: 'No pizza found with this id!' });
      }
      res.json(dbPizzaData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
};

module.exports = commentController;
