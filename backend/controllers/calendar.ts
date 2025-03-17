import { Router } from "express";
import passport from "passport";
import { Calendar } from "../models/calendar";
import { User } from "../models/user";

const calendarRouter = Router();

calendarRouter.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'token missing or invalid' });
            return;
        }

        const userId = req.user.id;
        const tasks = await Calendar.find({ user: userId }).populate('user');

        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
}
);

calendarRouter.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ error: 'token missing or invalid' });
        return;
    }

    try {
        const task = await Calendar.findOne({ _id: req.params.id });

        res.json(task);
    } catch (error) {
        next(error);
    }
});


calendarRouter.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'token missing or invalid' });
            return;
        }

        const {id} = req.params;
        const updatedTask = await Calendar.findOneAndUpdate({ _id: id, user: req.user.id }, req.body, { returnDocument: 'after' });

        res.json(updatedTask);
    } catch (error) {
        next(error);
    }
});

calendarRouter.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ error: 'token missing or invalid' });
        return;
    }
    
    try {
        const todo = new Calendar({ ...req.body, user: req.user.id });
        const savedTodo = await todo.save();
        await User.updateOne({ _id: req.user.id }, { $push: { calendarTasks: savedTodo.id } });

        res.json(savedTodo);
    } catch (error) {
        next(error);
    }
});

calendarRouter.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ error: 'token missing or invalid' });
        return;
    }

    try {
        await Calendar.deleteOne({ _id: req.params.id });
        await User.updateOne({ _id: req.user.id }, { $pull: { calendarTasks: req.params.id } });

        res.status(204).end();
    } catch (error) {
        next(error);
    }
});


export default calendarRouter;