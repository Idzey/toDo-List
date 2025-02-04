import { Request, Response, NextFunction } from "express";
const unknownEndpoint = (_req: Request, res: Response) => {
    res.status(404).send({ error: 'unknown endpoint' });
}

const errorHandler = (error: any, _req: Request, res: Response, next: NextFunction) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return res.status(404).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }

    return next(error);
}

export default {
    unknownEndpoint,
    errorHandler
}
