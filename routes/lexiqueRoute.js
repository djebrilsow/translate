import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { 
        createLexiqueController, 
        deleteLexiqueController, 
        getLexiqueController, 
        getSingleLexiqueController, 
        lexiqueCategoryController, 
        lexiqueCountController, 
        lexiqueFilterController, 
        lexiqueListController, 
        lexiquePhotoController, 
        relatedLexiqueController, 
        searchLexiqueController, 
        updateLexiqueController 
      } from '../controllers/lexiqueController.js';
import formidable from "express-formidable"


const router = express.Router();

// routes
router.post('/create-product', requireSignIn, isAdmin,  createLexiqueController)

// routes
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateLexiqueController)

// get product
router.get('/get-product', getLexiqueController)

// single product
router.get('/get-product/:slug', getSingleLexiqueController)

// get photo
router.get('/product-photo/:pid', lexiquePhotoController)

// delete product
router.delete('/delete-product/:pid', deleteLexiqueController)

// filter route
router.post('/product-filters',lexiqueFilterController)

// product count 
router.get('/product-count', lexiqueCountController)

// product per page
router.get('/product-list/:page', lexiqueListController)

// search product
router.get('/search/:keyword', searchLexiqueController)

// similar product
router.get('/related-product/:pid/:cid', relatedLexiqueController)

// category wise product
router.get('/product-category/:slug', lexiqueCategoryController)

export default router;