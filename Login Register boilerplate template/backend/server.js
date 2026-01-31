import cors from "cors";
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();



// app.get ('/', (req, res) => {
//     res.send ('Hello World!');
// });
app.use(cors()); 
app.use (express.json()); //to accept and parse json data in body 
app.use ("/api/users", authRoutes); //all routes in authRoutes will be prefixed with /api/users/login or /api/users/register


connectDB();



app.listen (PORT, "0.0.0.0",() => {
    console.log (`Server is running on port ${PORT}`);
});