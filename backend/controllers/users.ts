import { Router } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";

const userRouter = Router();

userRouter.post("/", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(401).json({ error: "invalid username or password" });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: passwordHash });

        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        next(error)
    }
});

export default userRouter;