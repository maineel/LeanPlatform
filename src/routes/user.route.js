import { Router } from 'express';
import { getMentorDetails, loginUser, logoutUser, rateMentor, registerUser, reviewMentor } from '../controllers/user.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const userRouter = Router();

userRouter.route('/register').post(registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').post(verifyJWT, logoutUser);
userRouter.route('/rateMentor').post(rateMentor);
userRouter.route('/reviewMentor').post(reviewMentor);
userRouter.route('/getMentorDetails').get(getMentorDetails);

export { userRouter };