import express from 'express';
import { registerUser, loginUser, firebaseLogin } from '../controllers/auth_controller';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/firebase-login', firebaseLogin);

export default router;
