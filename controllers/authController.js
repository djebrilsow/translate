import { comparePassword, hashPassword } from '../helpers/authHelper.js'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'


// Register
export const registerController = async (req, res) => {
        try {
            const {name, email, password, phone, adress, answer} = req.body

            // Validation
            if(!name){
                return res.send({message: 'Innde ina jojji!!'})
            }
            if(!email){
                return res.send({message: 'Email ina jojji'})
            }
            if(!password){
                return res.send({message: 'Finnde ina jojji'})
            }
            if(!phone){
                return res.send({message: 'Tonngoode ina jojji'})
            }
            if(!adress){
                return res.send({message: 'Ñiiɓirde ina jojji'})
            }
            if(!answer){
                return res.send({message: 'laaɓndal ina jojji'})
            }

            // check user
            const existingUser = await userModel.findOne({email})
             if(existingUser){
                return res.status(200).send({
                    succes: false,
                    message: "Oo ina winnditii, naatu e gollordu ma!"
                })
             }

            //  register user
            const hashedPassword = await hashPassword(password)
            // save
            const user = await new userModel({
                name, 
                email, 
                phone, 
                adress, 
                password: hashedPassword, 
                answer
            }).save()

            res.status(201).send({
                succes: true,
                message: 'O ɓeydaama',
                user
            })
            
        } catch (error) {
            console.log(error)
            res.status(500).send({
                succes: false,
                message: "Binnditagol heɓii cadeele",
                error
            })
        }
}

// Login
export const loginController = async (req, res) => {
    try {
        const {email, password} = req.body

        // Validation
        if(!email || !password) {
            return res.status(404).send({
                succes: false,
                message: "Email maa Finnde ndee feewaani"
            })
        }

        // check user
        const user = await userModel.findOne({email})
        if(!user){
            return  res.status(404).send({
                succes: false,
                message: "Email oo winnditaaki"
            })
        }

        const match = await comparePassword(password, user.password)
        if(!match){
            return res.status(200).send({
                succes: false,
                message: "Finnde ndee feewaani"
            })
        }

        // token
        const token = jwt.sign({_id: user._id}, process.env.SECRET, {expiresIn: '7d'});
        res.status(200).send({
            succes: true,
            message: "A yettiima gollordu ma",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                adress: user.adress,
                role: user.role,
            },
            token,
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            succes: false,
            message: 'Ceŋogol ngol hawrii e caɗeele',
            error
        })
    }

}

// forget 
export const forgetPasswordController = async (req, res) => {
        try {

            const {email, answer, newPassword} = req.body

            if(!email) {
                res.status(400).send({message: "Email ina jojji "})
            }
            if(!answer) {
                res.status(400).send({message: "Answer ina jojji "})
            }
            if(!newPassword) {
                res.status(400).send({message: "Finnde hesere ina jojji"})
            }

            // Check
            const user = await userModel.findOne({email, answer})

            // Validation
            if(!user) {
                return res.status(404).send({
                    succes: false,
                    message: "Email maa Answer feewaani"
                })
            }

            const hashed = await hashPassword(newPassword)
            await userModel.findOneAndUpdate(user._id, {password: hashed})
            res.status(200).send({
                succes: true,
                message: "Finnde ndee waylaama",
            })
            
        } catch (error) {
            console.log(error)
            res.status(500).send({
                succes: false,
                message: "Caɗeele kawraama",
                error
            })
        }

}

// test forgetPasswordController
export const testController = (req, res) => {
    res.send("Sokde boli")
}

