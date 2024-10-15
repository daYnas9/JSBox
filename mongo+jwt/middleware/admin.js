const { jwtPassword } = require("../../02-jwt");

// Middleware for handling auth
function adminMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.Authorization;
        const token = authHeader.split(' ')[1];
        try{
            const decodedValue = jwt.verify(token, jwtPassword);
            if(decodedValue.username) {
                next();
            } else {
                res.status(403).json({
                    errror: 'You are not authorized'
                })
            }
        } catch(e) {
            res.status(403).json({
                errror: 'You are not authorized'
            })
        }
     } catch(e) {
        res.status(500).json({
            error: 'Error occured while authenticating'
        })
    }
}

module.exports = adminMiddleware;