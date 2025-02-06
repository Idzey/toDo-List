import { Router } from "express";
import { Comment } from "../models/comment";
import { Task } from "../models/task";

const commentRouter = Router();


commentRouter.get('/:id', async (req, res, next) => {
    try {
        const task = await Comment.findOne({ _id: req.params.id });

        res.json(task);
    } catch (error) {
        next(error);
    }
});

commentRouter.post('/', async (req, res, next) => {
    try {
        const comment = new Comment({ ...req.body });
        const savedComment = await comment.save();
        await Task.updateOne({ _id: req.body.taskId }, { $push: { comments: savedComment.id } });

        res.json(savedComment);
    } catch (error) {
        next(error);
    }
});

commentRouter.delete('/:id', async (req, res, next) => {
    try {
        const comment = await Comment.findOne({ _id: req.params.id });
        await Comment.deleteOne({ _id: req.params.id });
        await Task.updateOne({ _id: comment?.taskId }, { $pull: { comments: comment?.id } });

        res.status(204).end();
    } catch (error) {
        next(error);
    }
});


export default commentRouter;