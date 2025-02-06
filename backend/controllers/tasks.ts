import { Router } from "express";
import { Task } from '../models/task';

const taskRouter = Router();

taskRouter.get('/', async (_req, res, next) => {
    try {
        const tasks = await Task.find({}).populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
        });

        res.json(tasks);
    } catch (error) {
        next(error);
    }
});

taskRouter.get('/:id', async (req, res, next) => {
    try {
        const task = await Task.findOne({ _id: req.params.id }).populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
        });

        res.json(task);
    } catch (error) {
        next(error);
    }
});

taskRouter.post('/', async (req, res, next) => {
    try {
        let { title, completed, comments, date } = req.body;
        comments = comments || [];
        completed = completed || false;
        const task = new Task({ title, completed, comments, date });
        const savedTask = await task.save();

        res.json(savedTask);
    } catch (error) {
        next(error);
    }
});

taskRouter.put('/:id', async (req, res, next) => {
    try {
        const updatedTask = await Task.findOneAndUpdate({ _id: req.params.id }, {...req.body}, { returnDocument: 'after' }).populate({
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