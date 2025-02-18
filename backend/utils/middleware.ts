import { Request, Response, NextFunction } from "express";

const unknownEndpoint = (_req: Request, res: Response) => {
    res.status(404).send({ error: 'unknown endpoint' });
}

const errorHandler = (error: any, _req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    if (error.name === 'CastError') {
        return res.status(404).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    } else if (error.name === 'MongoServerError' && error.message.includes("E11000 duplicate key error")) {
        return res.status(400).json({ error: 'expected `username` to be unique' });
    } else if (error.name == "TokenExpiredError") {
        return res.status(400).json({ error: 'invalid user token' });
    } else if (error.name == "NotBeforeError" || error.name == "JsonWebTokenError") {
        return res.status(400).json({ error: error.message });
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'token expired'
        });
    }
    return next(error);
}

export default {
    unknownEndpoint,
    errorHandler
}
