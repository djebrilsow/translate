import categoryModel from "../models/categoryModel.js"
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
       try {
        const {name} = req.body

        if(!name) {
            res.status(401).send({message : 'Innde ina jojji'})
        }

        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory) {
            return res.status(200).send({
                succes: true,
                message : 'Ndee lowre ina woodi'
            })
        }

        const category = await new categoryModel({
            name, 
            slug:slugify(name)
        }).save()
        res.status(201).send({
            succes : true,
            message: "Lowre ndee tafaama",
            category

        })
        
       } catch (error) {
         console.log(error)
         res.status(500).send({
            succes: false,
            error,
            message : 'Waɗii caɗeele'
         })
       }
}

export const updateCategoryController = async (req, res) => {
    try {
        const {name} = req.body
        const {id} = req.params
        const category = await categoryModel.findByIdAndUpdate(id, {name, slug:slugify(name)}, {new: true})
        res.status(200).send({
            succes:true,
            message: 'Lowre ndee winnditaama',
            category
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            succes: false,
            message: 'Waɗii caɗeele seeɗa',
            error
        })
    }
}

export const categoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            succes: true,
            message: 'All Categories List',
            category
        })
        
    } catch (error) {
         console.log(error)
         res.status(500).send({
            succes: false,
            message: 'Error while getting all categories',
            error
         })
    }
}

export const singleCategoryController = async (req, res) => {
    try {
        
        const category = await categoryModel.findOne({slug: req.params.slug})
        res.status(200).send({
            succes: true,
            message: 'Get Single Category Succefully',
            category
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            succes: false,
            message: 'Error While getting Single Category',
            error
        })
    }
}

export const deleteCategoryController = async (req, res) => {
    try {
        const {id} = req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            succes: true,
            message: "Category deleted Succefully",
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            succes: false,
            message: 'Error While deleting Category',
            error
        })
    }
}