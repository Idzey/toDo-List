import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, Request, NextFunction } from "express";
import config from './config';

interface UserRequest extends Request {
    user?: {
        id: string,
        username: string,
        tasks: [],
    },
    token?: string
}

const authMiddleware = (req: UserRequest, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization");

    try {
        if (!token) {
            res.status(401).json({ message: "Access denied. No token provided." });
            return;
        }

        const decoded = jwt.verify(token.replace("Bearer ", ""), config.SECRET) as JwtPayload;
        req.user = { id: decoded.id, username: decoded.username, tasks: decoded.tasks };
        req.token = token.replace("Bearer ", "")

        return next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
};

export {
    UserRequest,
    authMiddleware
}