import { Router } from 'express';
import { registerMentor, loginMentor, logoutMentor, recommendStudent } from '../controllers/mentor.controller.js';
import { verifyJWT } from '../middleware/mentor.auth.middleware.js';

const mentorRouter = Router();

mentorRouter.route('/register').post(registerMentor);
mentorRouter.route('/login').post(loginMentor);
mentorRouter.route('/logout').post(verifyJWT, logoutMentor);
mentorRouter.route('/recommendStudent').post(verifyJWT, recommendStudent)

export { mentorRouter };