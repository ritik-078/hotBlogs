const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
    {
        content:{ 
            type: String,
            required: true
        },
        blogID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog"
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },
    { timeseries: true }
)



const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;