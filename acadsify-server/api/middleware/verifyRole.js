import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyRole = (roles) => {
    return async (req, res, next) => {
        const email = req.decoded.email;
        const query = { email: email };

        const user = await User.findOne(query);
        if (!user || !roles.includes(user.role)) {
            return res.status(403).send({ message: "forbidden access!" });
        }

        next();
    };
};

export default verifyRole;
