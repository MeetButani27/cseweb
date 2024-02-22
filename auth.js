const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        
        if(token) {
            token = token.split(' ')[1];
            let user = jwt.verify(token, JWT_SECRET);
            req.email_id = user.email_id;
        }
        else {
            res.json({message: 'Unauthorized user'});
            return;
        }

        next();

    } catch (err) {
        console.log(err);
        res.json({message: 'Unauthorized user'});
    }
}

module.exports = auth;