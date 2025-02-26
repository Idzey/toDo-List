import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from './config';

declare global {
    namespace Express {
        interface User {
            id: string | ObjectId;
        }
    }
}


passport.use(
    new Strategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.userToken]),
            secretOrKey: config.JWT_SECRET
        },
        (JwtPayload, done) => {
            return done(null, JwtPayload);
        }
    )
);

export const generateAccessToken = (id: ObjectId) => {
    return jwt.sign({id}, config.JWT_SECRET, { expiresIn: '30m' });
};

export const generateRefreshToken = (id: ObjectId) => {
    return jwt.sign({id}, config.JWT_SECRET, { expiresIn: '7d' });
};