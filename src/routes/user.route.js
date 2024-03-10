import { Router } from 'express';
import { getMentorDetails, getRecommendations, loginUser, logoutUser, rateMentor, registerUser, reviewMentor } from '../controllers/user.controller.js';
import { verifyJWT } from '../middleware/user.auth.middleware.js';

const userRouter = Router();

userRouter.route('/register').post(registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').post(verifyJWT, logoutUser);
userRouter.route('/rateMentor').post(verifyJWT, rateMentor);
userRouter.route('/reviewMentor').post(verifyJWT, reviewMentor);
userRouter.route('/getMentorDetails').get(verifyJWT, getMentorDetails);
userRouter.route('/getRecommendation').get(verifyJWT, getRecommendations);

export { userRouter };