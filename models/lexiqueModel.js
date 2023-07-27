import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    peul: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    french: {
        type: String,
        required: true,
    },
    english: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    },
 
}, {timestamps: true})

export default mongoose.model('lexique', productSchema)