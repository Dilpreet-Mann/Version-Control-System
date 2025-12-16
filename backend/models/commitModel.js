const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommitSchema = new Schema({
  commitId: {
    type: String,
    required: true,
    unique: true,
  },
  message: {
    type: String,
    required: true,
  },
  repository: {
    type: Schema.Types.ObjectId,
    ref: "Repository",
  },
  repositoryName: {
    type: String,
  },
  files: [
    {
      filename: String,
      content: String,
      s3Key: String,
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  authorName: {
    type: String,
  },
  committedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Commit = mongoose.model("Commit", CommitSchema);
module.exports = Commit;

