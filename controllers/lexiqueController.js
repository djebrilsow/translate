import slugify from "slugify";
import productModel from "../models/lexiqueModel.js";
import categoryModel from '../models/categoryModel.js'
import fs from 'fs';
import lexiqueModel from "../models/lexiqueModel.js";


export const createLexiqueController = async (req, res) => {
    try {
        const { peul, french, english, category } = req.body;
        
        if(!peul || !french || !english || !category){
            return res.status(500).send({message:"Naatnu keɓe ma"})
        }

           // check user
           const existingLexique = await lexiqueModel.findOne({peul})
           if(existingLexique){
              return res.status(200).send({
                  success: true,  
                  message: "Ndee helmere ina winnditaa ko adii jooni!",
                  existingLexique
              })
           }
       
      
            const slug = slugify(peul);
            const products = new lexiqueModel({
                ...req.body,  
                slug: slug})
    
           
                await products.save();
                res.status(201).send({
                    success: true,
                    message: 'Helmere ndee ɓeydaama ',
                    products
                });

       
    } catch (error) {
        console.log(error);
        res.status(500).send({
            // success: false,
            message: 'Binnditgol helmere ndee hawrii e caɗeele',
            error
        });
    }
};


export const getLexiqueController = async (req, res) => {
    try {
        const products = await lexiqueModel.find({}).populate('category').select('-photo').limit(12).sort({createdAt: -1})
        
        res.status(200).send({
            success: true,
            countTotal: products.length,
            message: "Kuuɓal kelme goodaaɗe",
            products,
          
            
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: false,
            message: 'Gaddugol kelme ɗee waɗii caɗeele',
            error: error.message
        })
    }
}

export const getSingleLexiqueController = async (req, res) => {
    try {
        const slug = req.params.slug
        const product = await productModel.findOne({slug}).select('-photo').populate('category')
        res.status(200).send({
            status: true,
            message: 'Helmere ndee heɓaama',
            product
        })
        
    } catch (error) {
        consolr
        .log(error),
        res.status(500).send({
            success: false,
            message:'',
            product
        })
    }
}


export const lexiquePhotoController = async (req, res) => {
    try {
        const product = await lexiqueModel.findById(req.params.pid).select("photo");
        if (product.photo) {
            res.set('Content-Type', 'image/jpeg'); // Remplacez 'image/jpeg' par le type MIME approprié
            return res.status(200).send(product.photo);
        }

        // Ajouter la ligne suivante pour renvoyer une réponse si la condition est évaluée à false
        return res.status(404).send('Ngal natal woodaani');

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Gaddugol natal ngal waɗii caɗeele',
            error
        });
    }
};


export const deleteLexiqueController = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.pid).select('-photo')
        if(product){
            res.status(500).send({
                status: true,
                message: 'Helmere ndee momtaama !'
            })
        }
        else{
            res.status(404).send({
                status: true,
                message: 'Ndee helmere woodaani!'
            })
        }
       
        
    } catch (error) {
        console.log(error)
        res.status(500).send
({
    success: false,
    message: 'Momtugol helmere ndee waɗii caɗeele',
    error
})    }
}


export const updateLexiqueController = async (req, res) => {
    try {
        const { peul, french, english, category  } = req.fields;
        const { photo } = req.files;

        // Validation
        switch(true) {
            case !peul:
                return res.status(500).send({ message: 'Helmere e Pulaar ina jojji' });
            case !french:
                return res.status(500).send({ message: 'Helmere farayse ina jojji' });
            case !english:
                return res.status(500).send({ message: 'Helmere englee ina jojji' });
            case !category:
                return res.status(500).send({ message: 'Lowre helmere ina jojji' });
            case photo && photo.size > 1000000:
                return res.status(500).send({ message: 'Photo is required and should be less than 1mb' });
        }

       
        const products = await productModel.findByIdAndUpdate(req.params.pid, {
            ...req.fields, slug: slugify(peul)
        }, {new: true})
      

        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();
        res.status(201).send({
            success: true,
            message: 'Helmere ndee waylaama',
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Baylugol helmere ndee hawrii e caɗeele !',
            error
        });
    }
}


// filters
export const lexiqueFilterController = async (req, res) => {
    try {
        const {checked, radio} = req.body
        let args = {}
        if(checked.length > 0) {
            args.category = checked
        }
        if(radio.length){
            args.price = {$gte: radio[0], $lte: radio[1]}
        }

        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            products,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Cuɓtagol kelme waɗii caɗeele',
            error
        })
    }
}


// product count
export const lexiqueCountController = async (req, res) => {
    try {
        const total = await lexiqueModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Product Count",
            error
        })
    }
}


// product list base on page
export const lexiqueListController = async (req, res) => {
    try {
        const perPage = 4
        const page = req.params.page ? req.params.page : 4
        const products = await lexiqueModel
        .find({})
        .select('-photo')
        .skip((page-1) * perPage)
        .limit(perPage)
        .sort({createdAt: -1});
        res.status(200).send({
            success: true,
            products
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in per page controller",
            error
        })
    }
}

// serach product
export const searchLexiqueController = async (req, res) => {
    try {
        const {keyword} = req.params
        const result = await lexiqueModel.find({
            $or: [
                {peul : {$regex : keyword, $options: "i"}},
                {french : {$regex : keyword, $options: "i"}},
                {english : {$regex : keyword, $options: "i"}}
            ]
        }).select('-photo');
        res.json(result)
        
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Njiylagol helmere ndee waɗii caɗeele",
            error
        })
    }
}

// similar products
export const relatedLexiqueController = async (req, res) => {
    try {
        const {pid, cid} = req.params
        const product = await productModel.find({
            category: cid,
            _id: {$ne:pid}
        })
        .select('-photo')
        .limit(3)
        .populate('category')

        res.status(200).send({
            success: true,
            product,
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error while geting related product",
            error
        })
    }
}

// get product by category
export const lexiqueCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({slug: req.params.slug})
        const product = await productModel.find({category}).populate('category').select('-photo')
        res.status(200).send({
            success: true,
            category,
            product
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error while getting products',
            error
        })
    }
}