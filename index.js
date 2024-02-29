const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const { checkforAuthentication } = require("./middlewares/authentication")
const Blog = require("./models/blog");

require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkforAuthentication())
app.use(express.static(path.resolve("./public")));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/user", userRoutes);  
app.use("/blog", blogRoutes); 

app.get("/", async (req, res) => {
    if(req.user === undefined)
        return res.redirect("/user/signin");

    const allBlogs = await Blog.find({});
    return res.render("home",{
        user: req.user,
        blogs: allBlogs
    });
})

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server Running on port:", PORT);
        });
    })
    .catch((err) => console.log(err));

