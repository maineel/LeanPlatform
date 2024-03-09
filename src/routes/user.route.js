import { Router } from 'express';
import { loginUser, logoutUser, rateMentor, registerUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const userRouter = Router();

userRouter.route('/register').post(registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').post(verifyJWT, logoutUser);
userRouter.route('/rateMentor').post(rateMentor);

export { userRouter };