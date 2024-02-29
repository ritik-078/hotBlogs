const jwt = require("jsonwebtoken");

function createJwtToken(user) {
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImgURL: user.profileImgURL,
        role: user.role
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    return token;

}

function validateToken(token) {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    return payload;
}

module.exports = { createJwtToken, validateToken};