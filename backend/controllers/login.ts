import { Router } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../utils/config";
const loginRouter = Router();

loginRouter.post("/", async (req, res, next) => {
    try {
        const { username, password, token } = req.body;

        if (username && password) {
            const user = await User.findOne({ username: username });

            if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
                res.status(401).json({ error: "Invalid username or password" });
                return;
            }
        
            const userToken = jwt.sign({ username: user.username, id: user._id }, config.SECRET, { expiresIn: 60 * 60 });
        
            res.status(200).send({ token: userToken, username });
        }

        if (token) {
            const decodedToken = jwt.verify(token, config.SECRET) as { username: string, tasks: [], id: string };

            const user = await User.findOne({ _id: decodedToken.id });

            if (!user) {
                res.status(401).json({ error: "Invalid token" });
                return;
            }

            res.status(200).json({ token, username: user.username, tasks: user.tasks });
        }
    } catch (error) {
        next(error)
    }
});

export default loginRouter;