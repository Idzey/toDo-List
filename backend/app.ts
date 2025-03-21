import express from 'express';
import taskRouter from './controllers/tasks';
import middleware from './utils/middleware';
import mongoose from 'mongoose';
import config from './utils/config';
import cors from 'cors';
import todoRouter from './controllers/todos';
import userRouter from './controllers/users';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import calendarRouter from './controllers/calendar';

const app = express();

mongoose.connect(config.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
});

mongoose.set("strictQuery", false);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
  origin: config.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use('/api/tasks', taskRouter);
app.use('/api/todos', todoRouter);
app.use('/api/users', userRouter);
app.use('/api/calendar', calendarRouter);

app.use(middleware.unknownEndpoint);
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  middleware.errorHandler(error, req, res, next);
});

export default app;