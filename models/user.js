const mongoose = require("mongoose");
const path = require("path");
const { createHmac, randomBytes } = require("crypto");
const { createJwtToken } = require("../utils/authentication")
const userSchema = new mongoose.Schema(
    {
        fullName:{ 
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        salt: {
            type: String,
        },
        password: {
            type: String,
            required: true
        },
        profileImgURL: {
            type: String,
            default: "/images/defaultProfileImg.jpeg"
        },
        role:
        {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER"
        },
    },
    { timeseries: true }
)

userSchema.pre("save", function (next) {
    const user = this;
    if(!user.isModified("password"))
        return;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next(); 
})

userSchema.static("matchPasswordandGenToken", async function(email, password) {
    const user = await this.findOne({ email });
    if(!user)
        throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");
    if(hashedPassword !== userProvidedHash)
        throw new Error("Incorrect password");

    const token = createJwtToken(user); 
    return token;
})

const User = mongoose.model("User", userSchema);

module.exports = User;