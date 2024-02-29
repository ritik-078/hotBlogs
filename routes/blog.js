const express = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,path.resolve(`./public/uploads`));
    },
    filename: function(req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    }
})
const upload = multer({storage: storage});


const router = express.Router();



router.get("/add-new", (req, res) => {
    if(req.user === undefined)
        return res.redirect("/user/signin");
    
    return res.render("addBlog", {
        user: req.user
    })
})
 
router.post("/", upload.single("coverImage"), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    });

    return res.redirect(`/blog/${blog._id}`);
})

router.post("/comment/:id", async (req, res) => {
    await  Comment.create({
        content: req.body.content,
        blogID: req.params.id,
        createdBy: req.user._id
    });
    return res.redirect(`/blog/${req.params.id}`)
})

router.get("/:id", async (req, res) => { 
    if(req.user === undefined)
        return res.redirect("/user/signin");

    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogID: req.params.id}).populate("createdBy");
    return res.render("blog",{
        blog,
        user: req.user,
        comments
    })
})

module.exports = router;