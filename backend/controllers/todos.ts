import { Router } from "express";
import { Todo } from "../models/todo";
import { Task } from "../models/task";
import passport from "passport";

const todoRouter = Router();

todoRouter.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ error: 'token missing or invalid' });
        return;
    }

    try {
        const task = await Todo.findOne({ _id: req.params.id });

        res.json(task);
    } catch (error) {
        next(error);
    }
});


todoRouter.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'token missing or invalid' });
            return;
        }

        const {id} = req.params;
        const updatedTask = await Todo.findOneAndUpdate({ _id: id, user: req.user.id }, req.body, { returnDocument: 'after' });

        res.json(updatedTask);
    } catch (error) {
        next(error);
    }
});

todoRouter.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ error: 'token missing or invalid' });
        return;
    }
    
    try {
        const todo = new Todo({ ...req.body, user: req.user.id });
        const savedTodo = await todo.save();
        await Task.updateOne({ _id: req.body.taskId }, { $push: { todos: savedTodo.id } });

        res.json(savedTodo);
    } catch (error) {
        next(error);
    }
});

todoRouter.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ error: 'token missing or invalid' });
        return;
    }

    try {
        const todo = await Todo.findOne({ _id: req.params.id });
        await Todo.deleteOne({ _id: req.params.id });
        await Task.updateOne({ _id: todo?.taskId }, { $pull: { todos: todo?.id } });

        res.status(204).end();
    } catch (error) {
        next(error);
    }
});


export default todoRouter;