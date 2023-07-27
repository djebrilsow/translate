import express from 'express';
import { 
    registerController, 
    loginController,
    testController,
    forgetPasswordController
} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';

// router object
const router = express.Router()

// Ragister
router.post('/register',  registerController)


// Login
router.post('/login', loginController)

// Forget password
router.post('/forgot-password', forgetPasswordController)

// test routes
router.get('/test',requireSignIn, isAdmin, testController)

// protected User routeauth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ok: true})
})
// protected Admin routeauth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ok: true})
})


export default router;