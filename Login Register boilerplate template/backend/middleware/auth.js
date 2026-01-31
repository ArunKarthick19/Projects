import user from '../models/User.js';
import jwt from 'jsonwebtoken';


export const protect = async (req, res, next) => {
    let token;

    try{

         if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { //it should start with Bearer
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await user.findById(decoded.id).select('-password'); //excluding password when returning user details

        return next();
    }

 
   
    }
       catch(err){
        console.error("token error", err.message);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }

}
