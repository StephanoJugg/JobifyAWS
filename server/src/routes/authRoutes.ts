import { register, login, updateUser } from '../controllers/authController';
import { Router } from 'express';
import auth from '../middleware/auth';

const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/update').patch(auth, updateUser);


export default router;