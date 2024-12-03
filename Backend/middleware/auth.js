const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    let authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Token not found' });
    }

    // Split the token from the header
    let clientToken = authHeader.split(" ")[1];

    try {
        // Verify the token
        let decoded = jwt.verify(clientToken, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).send({ message: 'Invalid token' });
        }
     
        // Attach the decoded token to the request object
        req.user = decoded;
        // Call the next middleware
        next();
    } catch (error) {
        console.log(error);
        // Send and error response if the Token is invalid
        return res.status(401).send({msg: "Invalid Token"});
    }
}

module.exports = verifyToken;