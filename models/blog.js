const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
    {
        title:{ 
            type: String,
            required: true
        },
        body:{
            type: String,
            required: true,
            unique: true
        },
        coverImageURL: {
            type: String
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },
    { timeseries: true }
)



const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;