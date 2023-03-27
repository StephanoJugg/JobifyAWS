import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors'
import cors from 'cors';
import morgan from 'morgan';

// db
import connectDB from './db/connect';

// routers
import authRoutes from './routes/authRoutes';
import jobRouter from './routes/jobRoutes';

// middleware
import notFound from './middleware/not-found';
import errorMiddleware from './middleware/error-handler';
import auth from './middleware/auth';

//for deployment
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';


const app = express();
dotenv.config();
//const __dirname = dirname(fileURLToPath(import.meta.url));

if(process.env.NODE_ENV !== 'production'){
    app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
//for deployment
//app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/api/v1', (req, res) => {
    res.send('Hello World!')
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/jobs', auth,jobRouter)

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

app.use(notFound);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI!);
        app.listen(port, () => {
            console.log("Server running on port " + port)
        });
    } catch (err){
        console.log(err);
    }
};

start();