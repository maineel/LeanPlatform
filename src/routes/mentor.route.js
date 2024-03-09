import { Router } from 'express';
import { registerMentor, loginMentor, logoutMentor } from '../controllers/mentor.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const mentorRouter = Router();

mentorRouter.route('/register').post(registerMentor);
mentorRouter.route('/login').post(loginMentor);
mentorRouter.route('/logout').post(verifyJWT, logoutMentor);

export { mentorRouter };