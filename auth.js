const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport.js');

/**
 * Generates a JWT token for user authentication.
 * 
 * @function
 * @param {Object} user - The user object for which the token is generated.
 * @returns {string} - A JWT token.
 */
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

/**
 * Sets up the login route.
 * 
 * @function
 * @param {Object} router - The Express router object.
 */
module.exports = (router) => {
    /**
   * Route to authenticate and log in a user.
   *
   * @function
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Object} - JSON object containing user details and JWT token.
   */
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: error,
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}