import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv'
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoute.js'
import lexiqueRoutes from './routes/lexiqueRoute.js'
import cors from 'cors'
import path from 'path'

// config dotenv
dotenv.config();

// connect to DB
connectDB

const app = express()

// midellwares
app.use(cors())
app.use(express.json());
app.use(morgan('dev'))
app.use(express.static(__dirname, './client/build'))

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', lexiqueRoutes);

app.use('*', function(req, res){
  res.sendFile(path.join(__dirname, './clent/build/index.html'))
})


const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server Running on mode ${process.env.DEV_MODE} on port ${PORT}`.bgCyan.white)
})
