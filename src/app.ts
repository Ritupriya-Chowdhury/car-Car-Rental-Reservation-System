import express, {Application, Request, Response} from 'express'
import cors from 'cors'
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';

const app : Application = express()


//parser
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'https://stirring-pie-8a9c1b.netlify.app'], 
  credentials: true
}));

const getController=(req:Request, res:Response) => {
  res.send('Hello World!')
}


app.get('/', getController);

// application routes
app.use('/api', router);



//Global Error Handler
app.use(globalErrorHandler);

//Not Found route
app.use(notFound);


export default app;