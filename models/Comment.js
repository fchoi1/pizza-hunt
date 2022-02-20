const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReplySchema = new Schema(
  {
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    replyBody: { type: String, required: 'reply body required', trim: true },
    writtenBy: { type: String, required: 'user required' },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    }
  },
  { toJSON: { getters: true } }
);

const CommentSchema = new Schema(
  {
    writtenBy: { type: String, required: 'user required' },
    commentBody: { type: String, required: 'comment body required' },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    replies: [ReplySchema]
  },
  { toJSON: { getters: true, virtuals: true }, id: false }
);
// Get comment length
CommentSchema.virtual('replyCount').get(function () {
  return this.replies.length;
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;
