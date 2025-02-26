import jwt from 'jsonwebtoken';
import { Router } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/passportConfig";
import passport from "passport";
import config from '../utils/config';
import transporter from '../utils/emailConfig';

const userRouter = Router();

userRouter.post("/signup", async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            res.status(401).json({ error: "invalid data" });
            return;
        }

        if (await User.findOne({email: email})) {
            res.status(401).json({ error: "email already exists" });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const verificationToken = jwt.sign({ username, email, password: passwordHash }, config.EMAIL_SECRET, { expiresIn: '15m' });  
        const verificationLink = `http://localhost:5173/verifyEmail/${verificationToken}`;
        transporter.sendMail({
            from: config.SMTP_USER,
            to: email,
            subject: "Подтверждение регистрации",
            text: `Перейдите по ссылке для подтверждения: ${verificationLink}`
        });

        res.status(200).json({ message: "check your email" });
    } catch (error) {
        next(error)
    }
});

userRouter.get("/verifyEmail/:token", async (req, res, next) => {
    try {
        const { token } = req.params;
        if (!token) {
            res.status(401).json({ error: "no token" });
            return;
        }

        jwt.verify(token, config.EMAIL_SECRET, async (err: any, decoded: any) => {
            if (err) return res.status(403).json({ error: 'Invalid or expired token' });
            try {
                const newUser = new User({...decoded});
                const user = await newUser.save();

                const userToken = generateAccessToken(user._id);
                const refreshToken = generateRefreshToken(user._id);
    
                res.cookie("userToken", userToken, { httpOnly: true, maxAge: 30 * 60 * 1000 });
                res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    
                return res.status(200).json(user);
            } catch (error) {
                console.log(error)
                return res.status(401).json({ error: 'email already exists' });
            }
        });
    } catch (error) {
        next(error)
    }
});

userRouter.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Username and password are required" });
            return;
        }

        const user = await User.findOne({ email });
        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ error: "Invalid username or password" });
            return;
        }

        const userToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie("userToken", userToken, { httpOnly: true, maxAge: 30 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(201).send(user);
    } catch (error) {
        next(error)
    }
});

userRouter.get("/loginToken", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        if (req.user?.id) {
            const user = await User.findOne({ _id: req.user.id });
            res.status(201).json(user);
            return;
        } else {
            res.status(401);
        }
    } catch (err) {
        next(err);
    }
});

userRouter.get("/refresh", passport.authenticate('jwt', { session: false }), (req, res) => {
    jwt.verify(req.cookies['refreshToken'], config.JWT_SECRET, (err: any, decoded: any) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired refresh token' });

        const userToken = jwt.sign({ id: decoded.id }, config.JWT_SECRET, { expiresIn: '30m' });
        res.clearCookie("userToken");
        res.cookie("userToken", userToken, { httpOnly: true, maxAge: 30 * 60 * 1000 });
        return res.status(200).json({ message: "token refreshed" });
    });    
});

userRouter.get("/logout", passport.authenticate('jwt', { session: false }), (_req, res) => {
    res.clearCookie("userToken");
    res.clearCookie("refreshToken");
    res.status(200).send("Logged out");
});

export default userRouter;