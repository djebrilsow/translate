import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';

// Protected Routes token base
export const requireSignIn = async (req, res, next) => {
    
    try {
        const decode = jwt.verify(
            req.headers.authorization, 
            process.env.SECRET
            );
            req.user = decode;
        
        next();
        
    } catch (error) {
        console.log(error)
        res.send('Something went wrong')
    }
}


// admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id)
        if(user.role !== 1) {
            return res.status(401).send({
                status: false,
                message: "UnAuthorized Access"
            })
        }
        else {
            next();
        }
        
    } catch (error) {
        console.log(error)
        res.status(401).send({
            succes: false,
            error,
            message: "Error in admin middelware"
        })
    }
}