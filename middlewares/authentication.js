const { validateToken } = require("../utils/authentication");

function checkforAuthentication() {
    return (req, res, next) => {
        const userToken = req.cookies["token"];

        if(!userToken)
        { return next();    }

        try {
            const userPayload = validateToken(userToken);
            req.user = userPayload;

        } catch (error) {
        }

        return next();
    }
}

module.exports = {checkforAuthentication};