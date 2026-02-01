const jwt = require('jsonwebtoken');
const { verify } = require('jsonwebtoken');

const JWT_SIGN_SECRET = '0iureugfhqkwhuhuehuzue545kuztzuuiwerqoqrutzetfeefgdurfgaegtrqwseg454hfuwewefzu7efefew78e78fewffwff8ffjhdw45etjwquqwuzwwqiue9qwqwehrizqwuzeruqzwrzquw5r4qw5rqr4w4qe';
module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
                userId: userData.id,
            },
            JWT_SIGN_SECRET, {
                expiresIn: '72h',
            }
        );
    },
    validateToken: (req, res, next) => {
        const accessToken = req.header('accessToken');

        if (!accessToken) {
            return res.json({ error: 'User not logged in!' });
        }
        try {
            const validToken = verify(accessToken, JWT_SIGN_SECRET);
            req.user = validToken;
            if (validToken) {
                return next();
            }
        } catch (err) {
            return res.json({ error: err });
        }
    },
};