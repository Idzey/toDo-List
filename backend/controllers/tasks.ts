import { Router } from "express";
import { Task } from '../models/task';
import passport from 'passport';
import { User } from "../models/user";
import { Todo } from "../models/todo";

const taskRouter = Router();

taskRouter.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'token missing or invalid' });
            return;
        }

        const userId = req.user.id;
        const tasks = await Task.find({ user: userId }).populate({
            path: 'todos',
            options: { sort: { createdAt: -1 } },
        }).populate('user');

        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
}
);

taskRouter.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'token missing or invalid' });
            return;
        }

        const user = req.user;
        const task = await Task.findOne({ _id: req.params.id, user: user.id }).populate({
            path: 'todos',
            options: { sort: { createdAt: -1 } },
        }).populate("user");

        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
});

taskRouter.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        let { title, color, isOpened } = req.body;

        if (!req.user) {
            res.status(401).json({ error: 'token missing or invalid' });
            return;
        }

        const user = await User.findOne({ _id: req.user.id });

        isOpened = isOpened || true;
        if (user) {
            const task = new Task({ title, isOpened, color, user: user?._id });
            const savedTask = await task.save();

            user.tasks = [...user.tasks, savedTask._id];
            await user.save();
            res.status(200).json(savedTask);
        } else {
            res.status(404).json({ error: 'user not found' });
            return;
        }
    } catch (error) {
        next(error);
    }
});

taskRouter.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'token missing or invalid' });
            return;
        }

        const {id} = req.params;
        const updatedTask = await Task.findOneAndUpdate({ _id: id, user: req.user.id }, req.body, { returnDocument: 'after' }).populate({
            path: 'todos',
            options: { sort: { createdAt: -1 } },
        });

        res.json(updatedTask);
    } catch (error) {
        next(error);
    }
});

taskRouter.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'token missing or invalid' });
            return;
        }

        const user = await User.findOne({ _id: req.user.id });

        if (user) {
            await Task.deleteOne({ _id: req.params.id });
            await Todo.deleteMany({ taskId: req.params.id });
            
            const filtredTasks = user.tasks.filter(item => item.toString() != req.params.id);
            user.tasks = filtredTasks;
            await user.save();

            res.status(204).end();
        }
    } catch (error) {
        next(error);
    }
});


export default taskRouter;