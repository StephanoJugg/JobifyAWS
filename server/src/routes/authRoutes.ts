import { register, login, updateUser } from '../controllers/authController';
import { Router } from 'express';

const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/update').patch(updateUser);


export default router;