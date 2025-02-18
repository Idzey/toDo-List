import jwt, { JwtPayload } from 'jsonwebtoken';
import { Router } from "express";
import { Task } from '../models/task';
import { User } from "../models/user";
import config from '../utils/config';
import { authMiddleware, UserRequest } from '../utils/authMiddleware';

const taskRouter = Router();

taskRouter.use(authMiddleware);

taskRouter.get('/', async (req: UserRequest, res, next) => {
    try {
        const user = req.user;
        const tasks = await Task.find({user: user?.id}).populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
        }).populate('user');

        res.json(tasks);
    } catch (error) {
        next(error);
    }
});

taskRouter.get('/:id', async (req: UserRequest, res, next) => {
    try {
        const user = req.user;
        const task = await Task.findOne({ _id: req.params.id, user: user?.id }).populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
        }).populate("user");

        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
});

taskRouter.post('/', async (req: UserRequest, res, next) => {
    try {
        let { title, completed, comments, date } = req.body;

        const token = req?.token;
        if (!token) {
            res.status(401).json({ error: 'token missing' });
            return;
        }

        const decodedToken = jwt.verify(token, config.SECRET) as JwtPayload;
        if (!decodedToken.id) {
            res.status(401).json({ error: 'token invalid' })
            return;
        }

        const user = await User.findOne({_id: decodedToken.id});

        completed = completed || false;
        const task = new Task({ title, completed, comments, date, user: user?._id });
        const savedTask = await task.save();
        
        if (user) {
            await User.updateOne({_id: user._id}, { $push: { comments: savedTask.id }});
        } else {
            res.status(404).json({ error: 'user not found' });
            return;
        }

        res.json(savedTask);
    } catch (error) {
        next(error);
    }
});

taskRouter.put('/:id', async (req, res, next) => {
    try {
        const updatedTask = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, { returnDocument: 'after' }).populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
        });

        res.json(updatedTask);
    } catch (error) {
        next(error);
    }
});

taskRouter.delete('/:id', async (req, res, next) => {
    try {
        await Task.deleteOne({ _id: req.params.id });

        res.status(204).end();
    } catch (error) {
        next(error);
    }
});


export default taskRouter;