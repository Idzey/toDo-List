import express from 'express';
import taskRouter from './controllers/tasks';
import middleware from './utils/middleware';
import mongoose from 'mongoose';
import config from './utils/config';
import cors from 'cors';
import commentRouter from './controllers/comments';

const app = express();

mongoose.connect(config.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
});

mongoose.set("strictQuery", false);

app.use(express.json());
app.use(cors())

app.use('/api/tasks', taskRouter);
app.use('/api/comments', commentRouter);

app.use(middleware.unknownEndpoint);
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  middleware.errorHandler(error, req, res, next);
});

export default app;