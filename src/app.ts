import express, {Application, Request, Response} from 'express'
import cors from 'cors'
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app : Application = express()


//parser
app.use(express.json());
app.use(cors());

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